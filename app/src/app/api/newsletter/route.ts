import { NextResponse } from "next/server";
import { validateNewsletter, type NewsletterPayload } from "@/lib/enquiryValidation";
import { getSupabaseAdmin } from "@/lib/supabaseClient";

export async function POST(request: Request) {
  let body: Partial<NewsletterPayload>;
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request could not be read." },
      { status: 400 },
    );
  }

  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json(
      { ok: false, code: "invalid_request", message: "The request could not be processed." },
      { status: 400 },
    );
  }

  const errors = validateNewsletter(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { ok: false, code: "validation_failed", errors },
      { status: 400 },
    );
  }

  // 1. Direct recording in Supabase newsletters table
  try {
    const supabase = getSupabaseAdmin();
    const { error: dbError } = await supabase
      .from("newsletters")
      .upsert(
        {
          first_name: body.firstName?.trim() || null,
          surname: body.surname?.trim() || null,
          email: body.email?.trim().toLowerCase(),
          country: body.country?.trim() || null,
          consent: true,
        },
        { onConflict: "email" }
      );

    if (!dbError) {
      return NextResponse.json({ ok: true });
    }
  } catch (err) {
    console.error("Supabase newsletter insert error:", err);
  }

  // 2. Fallback to upstream webhook if configured
  const endpoint = process.env.NEWSLETTER_API_URL;
  const apiKey = process.env.NEWSLETTER_API_KEY;

  if (endpoint) {
    try {
      const upstream = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(apiKey ? { authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          firstName: body.firstName?.trim() ?? "",
          surname: body.surname?.trim() ?? "",
          email: body.email?.trim(),
          country: body.country?.trim() ?? "",
          subscribedAt: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      });

      if (upstream.ok) {
        return NextResponse.json({ ok: true });
      }
    } catch {
      // Fall through to error
    }
  }

  return NextResponse.json(
    {
      ok: false,
      code: "upstream_failed",
      message: "Your subscription could not be recorded. Please try again later.",
    },
    { status: 502 },
  );
}
