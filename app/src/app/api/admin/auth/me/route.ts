import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";

export async function GET() {
  try {
    const { user } = await requireCmsAdmin();
    return Response.json({ user: { id: user.id, email: user.email }, admin: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
