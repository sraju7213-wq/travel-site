import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryPayload } from "@/lib/enquiryValidation";
import { getPackageBySlug } from "@/data/catalogue";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseClient";
import { BRAND } from "@/data/brandConfig";

const DEDUPE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const UPSTREAM_TIMEOUT_MS = 10_000; // 10 seconds
const MAX_PAYLOAD_BYTES = 32 * 1024; // 32 KB limit

// In-memory deduplication and rate limiting caches
const seenSubmissions = new Map<string, number>();
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isDuplicate(submissionId: string): boolean {
  const now = Date.now();
  for (const [id, at] of seenSubmissions) {
    if (now - at > DEDUPE_WINDOW_MS) seenSubmissions.delete(id);
  }
  if (seenSubmissions.has(submissionId)) return true;
  seenSubmissions.set(submissionId, now);
  return false;
}

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 6;

  // Clean expired windows
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }

  const current = rateLimitMap.get(clientIp);
  if (!current) {
    rateLimitMap.set(clientIp, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(request: Request) {
  // 1. Content-Length check to reject oversized payloads
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json(
      { ok: false, code: "payload_too_large", message: "Request payload exceeds size limit." },
      { status: 413 }
    );
  }

  // 2. IP-based rate limiting for spam prevention
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "client-default";

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        message: "Too many submission attempts. Please wait a few minutes before trying again.",
      },
      { status: 429 }
    );
  }

  // 3. Body parse with safe error handling
  let body: Partial<EnquiryPayload> & { submissionId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request body could not be parsed." },
      { status: 400 }
    );
  }

  // 4. Honeypot check (anti-bot trap)
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request could not be processed." },
      { status: 400 }
    );
  }

  // 5. Strict server-side field validation
  const errors = validateEnquiry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, code: "validation_failed", errors },
      { status: 400 }
    );
  }

  const packageSlug = typeof body.packageSlug === "string" ? body.packageSlug : null;
  const pkg = packageSlug ? getPackageBySlug(packageSlug) : undefined;
  const submissionId = typeof body.submissionId === "string" ? body.submissionId : "";

  // 6. Deduplication check
  if (submissionId && isDuplicate(submissionId)) {
    return NextResponse.json(
      { ok: false, code: "duplicate", message: "This enquiry has already been submitted." },
      { status: 409 }
    );
  }

  // 7. Secure database storage via Supabase (if configured)
  if (isSupabaseConfigured) {
    try {
      const supabase = getSupabaseAdmin();
      const { data: record, error: dbError } = await supabase
        .from("enquiries")
        .insert({
          full_name: body.fullName?.trim(),
          email: body.email?.trim().toLowerCase(),
          phone: body.phone?.trim(),
          preferred_contact: body.preferredContact === "phone" ? "phone" : "email",
          package_slug: pkg?.slug ?? null,
          package_title: pkg?.title ?? (body.packageTitle || "Tailor-made custom trip"),
          enquiry_type: body.enquiryType === "package" ? "package" : "custom",
          travel_date: body.travelDate?.trim() || null,
          dates_flexible: body.datesFlexible === true,
          travellers: String(body.travellers || "2"),
          message: body.message?.trim() ?? "",
          consent: body.consent !== false,
          submission_id: submissionId || null,
          status: "New",
        })
        .select("id")
        .single();

      if (!dbError && record) {
        return NextResponse.json({
          ok: true,
          code: "enquiry_recorded",
          id: record.id,
          message: "Your enquiry has been received and recorded.",
        });
      }

      // Safe error log without echoing any personal user data
      if (dbError) {
        console.error("Database storage failed with code:", dbError.code);
      }
    } catch (err) {
      // Safe error log without echoing personal data
      console.error(
        "Database exception:",
        err instanceof Error ? err.name : "unknown_error"
      );
    }
  }

  // 8. Fallback to upstream webhook if configured
  const endpoint = process.env.ENQUIRY_API_URL;
  const apiKey = process.env.ENQUIRY_API_KEY;

  if (endpoint) {
    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          enquiryType: body.enquiryType === "package" ? "package" : "custom",
          packageSlug: pkg?.slug ?? null,
          packageTitle: pkg?.title ?? (body.packageTitle || "Tailor-made custom trip"),
          packageCode: pkg?.brochure_code ?? null,
          fullName: body.fullName?.trim(),
          email: body.email?.trim().toLowerCase(),
          phone: body.phone?.trim(),
          preferredContact: body.preferredContact === "phone" ? "phone" : "email",
          travelDate: body.travelDate?.trim() || null,
          datesFlexible: body.datesFlexible === true,
          travellers: String(body.travellers || "2"),
          message: body.message?.trim() ?? "",
          submittedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        cache: "no-store",
      });

      if (upstream.ok) {
        return NextResponse.json({
          ok: true,
          code: "enquiry_dispatched",
          message: "Your enquiry has been dispatched to our booking desk.",
        });
      }
    } catch (err) {
      console.error("Upstream dispatch failed:", err instanceof Error ? err.name : "unknown_error");
    }
  }

  // 9. When no submission destination is configured or available, return truthful 503
  return NextResponse.json(
    {
      ok: false,
      code: "not_configured",
      message:
        `The enquiry system is currently undergoing configuration. Please contact our concierge desk (${BRAND.name}) or your travel agent directly.`,
    },
    { status: 503 }
  );
}
