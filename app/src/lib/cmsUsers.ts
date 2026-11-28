import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

export type CmsUserView = {
  id: string;
  email: string;
  role: "admin" | "developer";
  isActive: boolean;
  createdAt: string | null;
  lastSignInAt: string | null;
};

/** Combines CMS role records with Supabase Auth identities. Server-only. */
export async function listCmsUsers(): Promise<CmsUserView[]> {
  const admin = createSupabaseAdminClient();
  const [roles, identities] = await Promise.all([
    admin.from("cms_admin_users").select("user_id, role, is_active, created_at").order("created_at", { ascending: true }),
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  if (roles.error) throw new Error(roles.error.message);
  if (identities.error) throw new Error(identities.error.message);

  const byId = new Map((identities.data?.users ?? []).map((user) => [user.id, user]));
  return (roles.data ?? []).map((row) => {
    const identity = byId.get(row.user_id);
    return {
      id: row.user_id,
      email: identity?.email ?? "Unknown email",
      role: row.role === "developer" ? "developer" : "admin",
      isActive: row.is_active !== false,
      createdAt: row.created_at ?? null,
      lastSignInAt: identity?.last_sign_in_at ?? null,
    };
  });
}
