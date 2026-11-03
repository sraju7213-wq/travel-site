import { isSupabaseConfigured } from "@/lib/supabaseClient";

/**
 * Checks whether an actual, functional submission destination is configured.
 * Returns true if an external webhook (ENQUIRY_API_URL) or a Supabase database is active.
 */
export function isEnquiryBackendConfigured(): boolean {
  const hasWebhook = Boolean(process.env.ENQUIRY_API_URL);
  const hasSupabase =
    isSupabaseConfigured ||
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  return hasWebhook || hasSupabase;
}
