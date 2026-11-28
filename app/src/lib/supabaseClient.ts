import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, isSupabaseConfigured } from "@/lib/supabaseConfig";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

export { isSupabaseConfigured, SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL };

// Public forms use insert-only RLS. There is deliberately no anonymous
// service-role fallback. Administrator operations use a verified user session.
export function getSupabaseAdmin(): never {
  throw new Error("Use a server-verified administrator Supabase session; no service-role fallback is available.");
}
