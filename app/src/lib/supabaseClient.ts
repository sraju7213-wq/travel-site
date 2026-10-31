import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vvmlthlguleysyhmkcfx.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWx0aGxndWxleXN5aG1rY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MzI2MTQsImV4cCI6MjEwOTAwODYxNH0.yAgf8hEgpdrcHoIZAtwDDTqTtqBlQYHU5UyGB-jhkjw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    return supabase;
  }
  return createClient(supabaseUrl, serviceRoleKey);
}
