import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";

const STATUSES = ["New", "In Review", "Quoted", "Confirmed", "Archived"] as const;

export async function GET() {
  try {
    const { supabase } = await requireCmsAdmin();
    const { data, error } = await supabase
      .from("enquiries")
      .select("id, full_name, email, phone, preferred_contact, package_slug, package_title, enquiry_type, travel_date, travellers, message, status, notes, submission_id, created_at")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return Response.json({ enquiries: data ?? [] });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { supabase } = await requireCmsAdmin();
    const body = await request.json().catch(() => ({})) as { id?: unknown; status?: unknown; notes?: unknown };
    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return Response.json({ error: "An enquiry id is required." }, { status: 400 });

    const patch: Record<string, string> = {};
    if (body.status !== undefined) {
      if (typeof body.status !== "string" || !STATUSES.includes(body.status as (typeof STATUSES)[number])) {
        return Response.json({ error: "Unknown enquiry status." }, { status: 400 });
      }
      patch.status = body.status;
    }
    if (body.notes !== undefined) {
      if (typeof body.notes !== "string" || body.notes.length > 4000) {
        return Response.json({ error: "Notes must be under 4000 characters." }, { status: 400 });
      }
      patch.notes = body.notes;
    }
    if (!Object.keys(patch).length) return Response.json({ error: "Nothing to update." }, { status: 400 });

    const { data, error } = await supabase.from("enquiries").update(patch).eq("id", id).select("id, status, notes").maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return Response.json({ error: "Enquiry not found." }, { status: 404 });
    return Response.json({ enquiry: data });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
