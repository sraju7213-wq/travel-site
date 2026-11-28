import "server-only";

import { cache } from "react";
import { connection } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabaseConfig";

export type CmsSupabaseClient = SupabaseClient;

const createSupabaseServerClientImpl = async (): Promise<CmsSupabaseClient> => {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot set cookies. proxy.ts refreshes sessions.
        }
      },
    },
  }) as CmsSupabaseClient;
};

/** Reuse one client per request instead of constructing a new one for every guard call. */
export const createSupabaseServerClient = cache(createSupabaseServerClientImpl);

export function createSupabasePublicClient(): CmsSupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  });
}

export type CmsRole = "admin" | "developer";

export interface CmsAdminContext {
  supabase: CmsSupabaseClient;
  user: User;
  role: CmsRole;
}

/** Verify Auth on the server AND require an active CMS administrator role. */
const requireCmsAdminImpl = async (): Promise<CmsAdminContext> => {
  // Admin content is always request-specific. Opting into request-time rendering
  // keeps timestamps and session checks out of the static shell.
  await connection();
  const supabase = await createSupabaseServerClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw new CmsAuthError(401, "Sign in as an authorized administrator.");
  }

  const { data: admin, error: adminError } = await supabase
    .from("cms_admin_users")
    .select("user_id, role, is_active")
    .eq("user_id", userData.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (adminError || !admin || !["admin", "developer"].includes(admin.role)) {
    throw new CmsAuthError(403, "Your account is not authorized for website management.");
  }

  return { supabase, user: userData.user, role: admin.role as CmsRole };
};

/**
 * Layout and page both guard admin routes. Memoize per render so the session
 * lookup and role query happen once per request rather than twice.
 */
export const requireCmsAdmin = cache(requireCmsAdminImpl);

/** Require the developer role for advanced settings, theme and audit access. */
export const requireCmsDeveloper = cache(async (): Promise<CmsAdminContext> => {
  const context = await requireCmsAdmin();
  if (context.role !== "developer") {
    throw new CmsAuthError(403, "This control is available to developers only.");
  }
  return context;
});

export class CmsAuthError extends Error {
  constructor(public status: 401 | 403, message: string) {
    super(message);
    this.name = "CmsAuthError";
  }
}

/**
 * Page/layout variant: an unauthenticated visitor is sent to the sign-in page
 * instead of surfacing CmsAuthError as an uncaught runtime error. API routes
 * should keep using requireCmsAdmin() so they can return a 401 JSON response.
 */
export async function requireCmsAdminPage(): Promise<CmsAdminContext> {
  try {
    return await requireCmsAdmin();
  } catch (error) {
    if (error instanceof CmsAuthError) {
      const next = encodeURIComponent("/admin");
      redirect(error.status === 401 ? `/login?next=${next}` : `/login?next=${next}&reason=unauthorized`);
    }
    throw error;
  }
}

/** Page variant for developer-only screens: non-developers return to the dashboard. */
export async function requireCmsDeveloperPage(): Promise<CmsAdminContext> {
  try {
    return await requireCmsDeveloper();
  } catch (error) {
    if (error instanceof CmsAuthError) {
      redirect(error.status === 401 ? `/login?next=${encodeURIComponent("/admin")}` : "/admin");
    }
    throw error;
  }
}

export function cmsErrorResponse(error: unknown): Response {
  if (error instanceof CmsAuthError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error(error instanceof Error ? error.message : "CMS request failed");
  return Response.json({ error: "The CMS request could not be completed." }, { status: 500 });
}
