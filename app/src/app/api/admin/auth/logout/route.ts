import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient, cmsErrorResponse } from "@/lib/supabaseServer";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    // A preview cookie can otherwise outlive the session and make public
    // routes try to read draft content without administrator rights.
    (await draftMode()).disable();
    return NextResponse.redirect(new URL("/login", request.url), 303);
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
