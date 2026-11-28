import { createSupabaseServerClient, cmsErrorResponse } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";
    if (!email || !password || email.length > 320 || password.length > 256) {
      return Response.json({ error: "Email and password are required." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) return Response.json({ error: "Invalid email or password." }, { status: 401 });

    const { data: admin, error: adminError } = await supabase
      .from("cms_admin_users")
      .select("user_id,role,is_active")
      .eq("user_id", data.user.id)
      .eq("is_active", true)
      .maybeSingle();
    if (adminError || !admin || !["admin", "developer"].includes(admin.role)) {
      await supabase.auth.signOut();
      return Response.json({ error: "This account is not authorized for website management." }, { status: 403 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
