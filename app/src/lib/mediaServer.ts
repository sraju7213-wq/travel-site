import "server-only";

import { randomUUID } from "crypto";
import sharp from "sharp";
import type { CmsSupabaseClient } from "@/lib/supabaseServer";
import { SUPABASE_URL } from "@/lib/supabaseConfig";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
const MAX_IMAGE_BYTES = 30 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const MEDIA_BUCKET = "website-media";

interface ProcessedMedia {
  kind: "image" | "video";
  extension: string;
  mimeType: string;
  buffer: Buffer;
  width: number | null;
  height: number | null;
  variants: Array<{ buffer: Buffer; width: number; height: number }>;
}

export interface MediaUsage {
  documentId: string;
  documentTitle: string;
  documentType: string;
  slug: string;
  status: string;
  state: "draft" | "published";
  fieldPath: string;
}

function safeBaseName(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 100) || "media";
}

export function safeFolder(folder: unknown): string {
  if (typeof folder !== "string") return "/";
  const clean = folder
    .split("/")
    .map((part) => safeBaseName(part))
    .filter((part) => part && part !== "." && part !== "..")
    .slice(0, 8)
    .join("/");
  return `/${clean}`.replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}

function storageFolder(folder: string): string {
  return folder === "/" ? "" : folder.replace(/^\//, "").replace(/\/$/, "");
}

function validateVideo(buffer: Buffer, mimeType: string): boolean {
  if (mimeType === "video/webm") return buffer.length > 4 && buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]));
  if (mimeType === "video/mp4" || mimeType === "video/quicktime") {
    return buffer.length > 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp";
  }
  return false;
}

async function processUpload(file: File): Promise<ProcessedMedia> {
  const mimeType = file.type.toLowerCase();
  const isImage = IMAGE_TYPES.has(mimeType);
  const isVideo = VIDEO_TYPES.has(mimeType);
  if (!isImage && !isVideo) throw new Error("Unsupported file type. Use JPEG, PNG, WebP, AVIF, GIF, MP4, WebM, or QuickTime.");
  if (file.size === 0) throw new Error("Empty files cannot be uploaded.");
  if (file.size > (isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES)) throw new Error(isImage ? "Images must be 30 MB or smaller." : "Videos must be 100 MB or smaller.");
  // Never trust an extension or browser-supplied MIME type. Images are fully
  // decoded/re-encoded by sharp; videos require a matching container signature.
  const lowerName = file.name.toLowerCase();
  const allowedExtension = isImage
    ? /\.(jpe?g|png|webp|avif|gif)$/.test(lowerName)
    : /\.(mp4|webm|mov)$/.test(lowerName);
  if (!allowedExtension) throw new Error("The file extension does not match a supported media type.");

  const input = Buffer.from(await file.arrayBuffer());
  if (isVideo) {
    if (!validateVideo(input, mimeType)) throw new Error("The video file signature is invalid.");
    const extension = mimeType === "video/webm" ? "webm" : mimeType === "video/quicktime" ? "mov" : "mp4";
    return { kind: "video", extension, mimeType, buffer: input, width: null, height: null, variants: [] };
  }

  try {
    const image = sharp(input, { failOn: "error", limitInputPixels: 100_000_000 }).rotate();
    const { data, info } = await image
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer({ resolveWithObject: true });

    const variants: Array<{ buffer: Buffer; width: number; height: number }> = [];
    for (const width of [640, 1280, 1920]) {
      if (width >= info.width) continue;
      const variant = await sharp(data)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      variants.push({ buffer: variant.data, width: variant.info.width, height: variant.info.height });
    }

    return { kind: "image", extension: "webp", mimeType: "image/webp", buffer: data, width: info.width, height: info.height, variants };
  } catch (error) {
    throw new Error(`Invalid or unsafe image: ${error instanceof Error ? error.message : "decode failed"}`);
  }
}

function publicUrl(supabaseUrl: string, bucket: string, path: string): string {
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function uploadToStorage(
  supabase: CmsSupabaseClient,
  bucket: string,
  storagePath: string,
  buffer: Buffer,
  contentType: string,
  upsert: boolean,
): Promise<void> {
  const { error } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
    contentType,
    cacheControl: "60",
    upsert,
  });
  if (error) throw new Error(error.message);
}

export async function createMediaAsset(
  supabase: CmsSupabaseClient,
  userId: string,
  file: File,
  options: { folder?: string; altText?: string; caption?: string; name?: string },
): Promise<Record<string, unknown>> {
  const processed = await processUpload(file);
  const folder = safeFolder(options.folder);
  const prefix = `${storageFolder(folder)}${storageFolder(folder) ? "/" : ""}`;
  const directory = `${prefix}${Date.now()}-${randomUUID()}`;
  const base = safeBaseName(file.name);
  const storagePath = `${directory}/${base}.${processed.extension}`;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || SUPABASE_URL;

  await uploadToStorage(supabase, MEDIA_BUCKET, storagePath, processed.buffer, processed.mimeType, false);
  const variants = [];
  for (const variant of processed.variants) {
    const variantPath = `${directory}/${base}-${variant.width}.webp`;
    await uploadToStorage(supabase, MEDIA_BUCKET, variantPath, variant.buffer, "image/webp", false);
    variants.push({ url: publicUrl(supabaseUrl, MEDIA_BUCKET, variantPath), width: variant.width, height: variant.height, format: "webp" });
  }

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      bucket_id: MEDIA_BUCKET,
      storage_path: storagePath,
      public_url: publicUrl(supabaseUrl, MEDIA_BUCKET, storagePath),
      name: (options.name || file.name).slice(0, 240),
      folder,
      kind: processed.kind,
      mime_type: processed.mimeType,
      size_bytes: processed.buffer.length,
      width: processed.width,
      height: processed.height,
      alt_text: (options.altText ?? "").slice(0, 1000),
      caption: (options.caption ?? "").slice(0, 2000),
      variants,
      created_by: userId,
      updated_by: userId,
    })
    .select("*")
    .single();
  if (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([storagePath, ...variants.map((variant) => variant.url.split(`/${MEDIA_BUCKET}/`)[1]).filter((value): value is string => Boolean(value))]);
    throw new Error(error.message);
  }
  return data;
}

export async function replaceMediaAsset(
  supabase: CmsSupabaseClient,
  userId: string,
  id: string,
  file: File,
): Promise<Record<string, unknown>> {
  const { data: existing, error: readError } = await supabase.from("media_assets").select("*").eq("id", id).maybeSingle();
  if (readError) throw new Error(readError.message);
  if (!existing) throw new Error("Media asset not found.");

  const processed = await processUpload(file);
  if (processed.kind !== existing.kind) throw new Error("A replacement must use the same image/video media type.");
  const bucket = existing.bucket_id || MEDIA_BUCKET;
  const storagePath = existing.storage_path;
  const directory = storagePath.split("/").slice(0, -1).join("/");
  const base = safeBaseName(storagePath.split("/").pop() || "media");
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || SUPABASE_URL;

  // Keep the original public URL stable so every reference updates together.
  await uploadToStorage(supabase, bucket, storagePath, processed.buffer, processed.mimeType, true);
  const variants = [];
  for (const variant of processed.variants) {
    const variantPath = `${directory}${directory ? "/" : ""}${base}-${variant.width}.webp`;
    await uploadToStorage(supabase, bucket, variantPath, variant.buffer, "image/webp", true);
    variants.push({ url: publicUrl(supabaseUrl, bucket, variantPath), width: variant.width, height: variant.height, format: "webp" });
  }

  const { data, error } = await supabase
    .from("media_assets")
    .update({
      mime_type: processed.mimeType,
      size_bytes: processed.buffer.length,
      width: processed.width,
      height: processed.height,
      variants,
      updated_by: userId,
    })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

function walkMedia(value: unknown, path: string, key: string, output: MediaUsage[], base: Omit<MediaUsage, "state" | "fieldPath">, state: "draft" | "published") {
  if (typeof value === "string" && (value === key || value.includes(key))) {
    output.push({ ...base, state, fieldPath: path || "value" });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkMedia(item, `${path}.${index}`, key, output, base, state));
    return;
  }
  if (value && typeof value === "object") {
    for (const [childKey, child] of Object.entries(value)) walkMedia(child, path ? `${path}.${childKey}` : childKey, key, output, base, state);
  }
}

export async function findMediaUsage(supabase: CmsSupabaseClient, id: string): Promise<MediaUsage[]> {
  const { data: asset, error: assetError } = await supabase.from("media_assets").select("id,public_url").eq("id", id).maybeSingle();
  if (assetError) throw new Error(assetError.message);
  if (!asset) throw new Error("Media asset not found.");
  const { data: documents, error } = await supabase.from("cms_documents").select("id,title,type,slug,status,draft_data,published_data");
  if (error) throw new Error(error.message);

  const output: MediaUsage[] = [];
  for (const document of documents ?? []) {
    const base = { documentId: document.id, documentTitle: document.title, documentType: document.type, slug: document.slug, status: document.status };
    for (const key of [asset.id, asset.public_url]) {
      walkMedia(document.draft_data, "", key, output, base, "draft");
      walkMedia(document.published_data, "", key, output, base, "published");
    }
  }
  return Array.from(new Map(output.map((usage) => [`${usage.documentId}:${usage.state}:${usage.fieldPath}:${usage.fieldPath}`, usage])).values());
}
