import { revalidatePath } from "next/cache";
import { cmsErrorResponse, requireCmsAdmin } from "@/lib/supabaseServer";
import { recordAudit } from "@/lib/cmsServer";
import { findMediaUsage, replaceMediaAsset } from "@/lib/mediaServer";
import { validateMediaMetadata } from "@/app/api/cms/media/route";
import { normalizeMediaAsset } from "@/lib/mediaPresentation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await requireCmsAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const metadata = validateMediaMetadata(body);
    if (!Object.keys(metadata).length) return Response.json({ error: "No supported media fields supplied." }, { status: 400 });
    const { data, error } = await supabase
      .from("media_assets")
      .update({ ...metadata, updated_by: user.id })
      .eq("id", id)
      .select("*")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 400 });
    await recordAudit(supabase, user.id, "update_media", "media", id, metadata);
    revalidatePath("/", "layout");
    return Response.json({ asset: normalizeMediaAsset(data) });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await requireCmsAdmin();
    const { id } = await context.params;
    const body = (await request.json().catch(() => ({}))) as { confirm?: boolean };
    if (body.confirm !== true) return Response.json({ error: "Explicit deletion confirmation is required." }, { status: 400 });

    const { data: asset, error: readError } = await supabase.from("media_assets").select("*").eq("id", id).maybeSingle();
    if (readError) return Response.json({ error: readError.message }, { status: 500 });
    if (!asset) return Response.json({ error: "Media asset not found." }, { status: 404 });

    const usage = await findMediaUsage(supabase, id);
    if (usage.length) return Response.json({ error: "This media asset is in use and cannot be deleted.", usage }, { status: 409 });

    const { error } = await supabase.from("media_assets").delete().eq("id", id);
    if (error) return Response.json({ error: error.message }, { status: 500 });
    if (asset.bucket_id === "website-media" && asset.storage_path) {
      const variantPaths = Array.isArray(asset.variants)
        ? (asset.variants as Array<{ url?: string }>).map((variant) => {
            try { return new URL(variant.url ?? "").pathname.split(`/website-media/`)[1]; } catch { return null; }
          }).filter((value): value is string => Boolean(value))
        : [];
      const { error: storageError } = await supabase.storage.from(asset.bucket_id).remove([asset.storage_path, ...variantPaths]);
      if (storageError) throw new Error(`Database metadata removed but storage cleanup failed: ${storageError.message}`);
    }
    await recordAudit(supabase, user.id, "delete_media", "media", id, { name: asset.name, storagePath: asset.storage_path });
    revalidatePath("/", "layout");
    return Response.json({ ok: true });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}

// Multipart replacement uses the same id/public URL and preserves references.
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { supabase, user } = await requireCmsAdmin();
    const { id } = await context.params;
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "A replacement file is required." }, { status: 400 });
    const asset = await replaceMediaAsset(supabase, user.id, id, file);
    await recordAudit(supabase, user.id, "replace_media", "media", id, { name: asset.name });
    revalidatePath("/", "layout");
    return Response.json({ asset: normalizeMediaAsset(asset) });
  } catch (error) {
    return cmsErrorResponse(error);
  }
}
