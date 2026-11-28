import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase } = await requireCmsAdmin();
    const { id } = await context.params;
    const { data, error } = await supabase
      .from("cms_document_revisions")
      .select("*")
      .eq("document_id", id)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ revisions: data ?? [] });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
