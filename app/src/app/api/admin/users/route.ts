import { CmsAuthError, cmsErrorResponse, requireCmsDeveloper } from "@/lib/supabaseServer";
import { createSupabaseAdminClient, UserManagementUnavailable } from "@/lib/supabaseAdmin";
import { listCmsUsers } from "@/lib/cmsUsers";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function errorResponse(error: unknown) {
  if (error instanceof UserManagementUnavailable) return Response.json({ error: error.message }, { status: 503 });
  if (error instanceof CmsAuthError) return cmsErrorResponse(error);
  console.error(error instanceof Error ? error.message : "User management request failed");
  return Response.json({ error: "The request could not be completed." }, { status: 500 });
}

function roleOf(value: unknown): "admin" | "developer" | null {
  return value === "admin" || value === "developer" ? value : null;
}

async function preventLastDeveloperLoss(admin: ReturnType<typeof createSupabaseAdminClient>, userId: string, current: { role: string; is_active: boolean }, nextRole?: string | null, nextActive?: boolean) {
  const losingAccess = (current.role === "developer") && ((nextRole && nextRole !== "developer") || nextActive === false);
  if (!losingAccess) return false;
  const { count, error } = await admin.from("cms_admin_users").select("id", { count: "exact", head: true }).eq("role", "developer").eq("is_active", true);
  if (error) throw new Error(error.message);
  return (count ?? 0) <= 1;
}

export async function GET() {
  try {
    await requireCmsDeveloper();
    return Response.json({ users: await listCmsUsers() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireCmsDeveloper();
    const admin = createSupabaseAdminClient();
    const body = await request.json().catch(() => ({})) as { email?: unknown; password?: unknown; role?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = roleOf(body.role);
    if (!EMAIL.test(email)) return Response.json({ error: "Enter a valid email address." }, { status: 400 });
    if (password.length < MIN_PASSWORD) return Response.json({ error: `Password must be at least ${MIN_PASSWORD} characters.` }, { status: 400 });
    if (!role) return Response.json({ error: "Choose a valid role." }, { status: 400 });

    const { data: created, error: createError } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (createError) return Response.json({ error: createError.message }, { status: 400 });
    if (!created.user) throw new Error("The user was created but could not be read back.");

    const { error: insertError } = await admin.from("cms_admin_users").insert({ user_id: created.user.id, role, is_active: true });
    if (insertError) {
      await admin.auth.admin.deleteUser(created.user.id);
      throw new Error(insertError.message);
    }
    return Response.json({ user: { id: created.user.id, email, role, isActive: true } }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const context = await requireCmsDeveloper();
    const admin = createSupabaseAdminClient();
    const body = await request.json().catch(() => ({})) as { userId?: unknown; role?: unknown; isActive?: unknown; password?: unknown };
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) return Response.json({ error: "A user id is required." }, { status: 400 });
    if (userId === context.user.id) return Response.json({ error: "You cannot change your own access. Ask another developer." }, { status: 400 });

    const role = body.role === undefined ? undefined : roleOf(body.role);
    if (body.role !== undefined && !role) return Response.json({ error: "Choose a valid role." }, { status: 400 });
    const isActive = body.isActive === undefined ? undefined : body.isActive === true;
    if (body.isActive !== undefined && typeof body.isActive !== "boolean") return Response.json({ error: "Invalid access state." }, { status: 400 });
    const password = typeof body.password === "string" ? body.password : undefined;
    if (password !== undefined && password.length < MIN_PASSWORD) return Response.json({ error: `Password must be at least ${MIN_PASSWORD} characters.` }, { status: 400 });
    if (role === undefined && isActive === undefined && password === undefined) return Response.json({ error: "Nothing to update." }, { status: 400 });

    const { data: target, error: targetError } = await admin.from("cms_admin_users").select("role, is_active").eq("user_id", userId).maybeSingle();
    if (targetError) throw new Error(targetError.message);
    if (!target) return Response.json({ error: "User not found." }, { status: 404 });
    if (await preventLastDeveloperLoss(admin, userId, target, role, isActive)) {
      return Response.json({ error: "At least one active developer must remain." }, { status: 400 });
    }

    if (role !== undefined || isActive !== undefined) {
      const patch: Record<string, unknown> = {};
      if (role !== undefined) patch.role = role;
      if (isActive !== undefined) patch.is_active = isActive;
      const { error } = await admin.from("cms_admin_users").update(patch).eq("user_id", userId);
      if (error) throw new Error(error.message);
    }
    if (password !== undefined) {
      const { error } = await admin.auth.admin.updateUserById(userId, { password });
      if (error) return Response.json({ error: error.message }, { status: 400 });
    }
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const context = await requireCmsDeveloper();
    const admin = createSupabaseAdminClient();
    const body = await request.json().catch(() => ({})) as { userId?: unknown };
    const userId = typeof body.userId === "string" ? body.userId : "";
    if (!userId) return Response.json({ error: "A user id is required." }, { status: 400 });
    if (userId === context.user.id) return Response.json({ error: "You cannot remove your own account." }, { status: 400 });

    const { data: target, error: targetError } = await admin.from("cms_admin_users").select("role, is_active").eq("user_id", userId).maybeSingle();
    if (targetError) throw new Error(targetError.message);
    if (!target) return Response.json({ error: "User not found." }, { status: 404 });
    if (await preventLastDeveloperLoss(admin, userId, target)) {
      return Response.json({ error: "At least one active developer must remain." }, { status: 400 });
    }

    const { error: removeError } = await admin.from("cms_admin_users").delete().eq("user_id", userId);
    if (removeError) throw new Error(removeError.message);
    const { error: authError } = await admin.auth.admin.deleteUser(userId);
    if (authError) return Response.json({ error: authError.message }, { status: 400 });
    return Response.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
