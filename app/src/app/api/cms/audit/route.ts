import { cmsErrorResponse, requireCmsDeveloper } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireCmsDeveloper();
    const limit = Math.min(200, Math.max(1, Number(new URL(request.url).searchParams.get("limit")) || 100));
    const { data, error } = await supabase.from("cms_audit_log").select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ entries: data ?? [] });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
