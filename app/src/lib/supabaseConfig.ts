export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  "https://vvmlthlguleysyhmkcfx.supabase.co";

// Supabase publishable/anonymous keys are not secrets. Production should still
// provide the environment value; never add a service-role key here.
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWx0aGxndWxleXN5aG1rY2Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0MzI2MTQsImV4cCI6MjEwOTAwODYxNH0.yAgf8hEgpdrcHoIZAtwDDTqTtqBlQYHU5UyGB-jhkjw";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
