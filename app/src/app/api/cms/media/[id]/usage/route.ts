import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { findMediaUsage } from "@/lib/mediaServer";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase } = await requireCmsAdmin();
    const { id } = await context.params;
    const usage = await findMediaUsage(supabase, id);
    return Response.json({ usage, inUse: usage.length > 0 });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
