import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath as revalidateCachePath } from "next/cache";
import { requireCmsAdmin } from "@/lib/supabaseServer";
import { publicPathForDocument } from "@/lib/cmsServer";
import type { CmsDocumentType } from "@/types/cms";

export async function GET(request: Request) {
  const { supabase } = await requireCmsAdmin();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("documentId");
  if (!id) return Response.json({ error: "documentId is required." }, { status: 400 });

  const { data, error } = await supabase.from("cms_documents").select("*").eq("id", id).maybeSingle();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "Content not found." }, { status: 404 });

  const path = publicPathForDocument(data.type as CmsDocumentType, data.slug, data.draft_data, data.published_data ?? {}) ?? "/";
  const safePath = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  const draft = await draftMode();
  draft.enable();
  revalidateCachePath(safePath);
  redirect(safePath);
}
