import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabaseConfig";

function copyAuthResponse(target: NextResponse, source: NextResponse) {
  source.cookies.getAll().forEach((cookie) => target.cookies.set(cookie));
  source.headers.forEach((value, key) => {
    if (key.toLowerCase().startsWith("x-supabase") || key.toLowerCase() === "cache-control") target.headers.set(key, value);
  });
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>, headers: Record<string, string>) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        Object.entries(headers).forEach(([key, value]) => supabaseResponse.headers.set(key, value));
      },
    },
  });

  // Required by @supabase/ssr: refresh verified auth claims before reads.
  await supabase.auth.getClaims();

  const pathname = request.nextUrl.pathname;
  const canRedirect = !pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next");
  if (canRedirect) {
    const { data: redirects } = await supabase
      .from("cms_redirects")
      .select("source_path,destination_path,status_code")
      .eq("source_path", pathname)
      .eq("is_active", true)
      .limit(1);

    const match = redirects?.[0];
    if (match && typeof match.destination_path === "string" && match.destination_path.startsWith("/") && !match.destination_path.startsWith("//")) {
      const target = new URL(match.destination_path, request.url);
      // Do not create redirect loops.
      if (target.pathname !== pathname) {
        const response = NextResponse.redirect(target, match.status_code ?? 301);
        copyAuthResponse(response, supabaseResponse);
        response.headers.set("Cache-Control", "no-store");
        return response;
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)"],
};
