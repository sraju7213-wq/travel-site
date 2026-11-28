import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { recordAudit, sanitizeDocumentData } from "@/lib/cmsServer";
import { createMediaAsset, safeFolder } from "@/lib/mediaServer";
import { normalizeMediaAsset } from "@/lib/mediaPresentation";

export async function GET(request: Request) {
  try {
    const { supabase } = await requireCmsAdmin();
    const { searchParams } = new URL(request.url);
    let query = supabase.from("media_assets").select("*").order("updated_at", { ascending: false }).limit(500);
    const q = searchParams.get("q")?.trim();
    const kind = searchParams.get("kind");
    const folder = searchParams.get("folder");
    if (q) query = query.or(`name.ilike.%${q.replace(/[%_,()]/g, "")}%,alt_text.ilike.%${q.replace(/[%_,()]/g, "")}%,caption.ilike.%${q.replace(/[%_,()]/g, "")}%`);
    if (kind === "image" || kind === "video" || kind === "file") query = query.eq("kind", kind);
    if (folder) query = query.eq("folder", safeFolder(folder));
    const { data, error } = await query;
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ assets: ((data ?? []) as Record<string, unknown>[]).map(normalizeMediaAsset) });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { supabase, user } = await requireCmsAdmin();
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "A file is required." }, { status: 400 });

    const asset = await createMediaAsset(supabase, user.id, file, {
      folder: typeof formData.get("folder") === "string" ? String(formData.get("folder")) : "/",
      altText: typeof formData.get("altText") === "string" ? String(formData.get("altText")) : "",
      caption: typeof formData.get("caption") === "string" ? String(formData.get("caption")) : "",
      name: typeof formData.get("name") === "string" ? String(formData.get("name")) : file.name,
    });
    await recordAudit(supabase, user.id, "upload_media", "media", String(asset.id), { name: asset.name, folder: asset.folder, kind: asset.kind });
    return Response.json({ asset: normalizeMediaAsset(asset) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed." }, { status: 400 });
  }
}

// Kept explicit so unknown fields cannot be mass-assigned.
export function validateMediaMetadata(value: unknown): Record<string, unknown> {
  const input = sanitizeDocumentData(value);
  const output: Record<string, unknown> = {};
  if (typeof input.name === "string" && input.name.trim()) output.name = input.name.trim().slice(0, 240);
  if (typeof input.folder === "string") output.folder = safeFolder(input.folder);
  if (typeof input.altText === "string") output.alt_text = input.altText.slice(0, 1000);
  if (typeof input.caption === "string") output.caption = input.caption.slice(0, 2000);
  return output;
}
