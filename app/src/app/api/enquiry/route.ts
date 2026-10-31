import { NextResponse } from "next/server";
import { validateEnquiry, type EnquiryPayload } from "@/lib/enquiryValidation";
import { getPackageBySlug } from "@/data/catalogue";
import { getSupabaseAdmin } from "@/lib/supabaseClient";

const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
const UPSTREAM_TIMEOUT_MS = 10_000;

const seenSubmissions = new Map<string, number>();

function isDuplicate(submissionId: string): boolean {
  const now = Date.now();
  for (const [id, at] of seenSubmissions) {
    if (now - at > DEDUPE_WINDOW_MS) seenSubmissions.delete(id);
  }
  if (seenSubmissions.has(submissionId)) return true;
  seenSubmissions.set(submissionId, now);
  return false;
}

export async function POST(request: Request) {
  let body: Partial<EnquiryPayload> & { submissionId?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request body could not be parsed." },
      { status: 400 },
    );
  }

  // Honeypot check
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request could not be processed." },
      { status: 400 },
    );
  }

  const errors = validateEnquiry(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, code: "validation_failed", errors },
      { status: 400 },
    );
  }

  const packageSlug = typeof body.packageSlug === "string" ? body.packageSlug : null;
  const pkg = packageSlug ? getPackageBySlug(packageSlug) : undefined;
  const submissionId = typeof body.submissionId === "string" ? body.submissionId : "";

  if (submissionId && isDuplicate(submissionId)) {
    return NextResponse.json(
      { ok: false, code: "duplicate", message: "This enquiry was already submitted." },
      { status: 409 },
    );
  }

  // 1. Direct recording in Supabase database
  try {
    const supabase = getSupabaseAdmin();
    const { data: record, error: dbError } = await supabase
      .from("enquiries")
      .insert({
        full_name: body.fullName?.trim(),
        email: body.email?.trim(),
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
  } catch (err) {
    console.error("Supabase insert error:", err);
  }

  // 2. Fallback to upstream webhook if configured
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
          ...body,
          submittedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        cache: "no-store",
      });

      if (upstream.ok) {
        return NextResponse.json({ ok: true });
      }
    } catch {
      // Fall through to unconfigured response
    }
  }

  return NextResponse.json(
    {
      ok: false,
      code: "not_configured",
      message:
        "The enquiry could not be saved. Please contact India Nepal Travel Centre or your travel agent.",
    },
    { status: 503 },
  );
}
