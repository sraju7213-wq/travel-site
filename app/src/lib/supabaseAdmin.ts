import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabaseConfig";

export class UserManagementUnavailable extends Error {
  constructor() {
    super("User management is not configured. Add a Supabase service-role/secret key to the server environment.");
    this.name = "UserManagementUnavailable";
  }
}

/** Accept both the classic service-role JWT and the newer secret key format. */
const serverKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || "";

export const isUserManagementConfigured = Boolean(serverKey());

/** Server-only client for Supabase Auth admin operations. Never import from a client component. */
export function createSupabaseAdminClient(): SupabaseClient {
  const serviceRoleKey = serverKey();
  if (!serviceRoleKey) throw new UserManagementUnavailable();
  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
