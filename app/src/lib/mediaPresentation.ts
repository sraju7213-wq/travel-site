import type { CmsMediaAsset } from "@/types/cms";

export function normalizeMediaAsset(row: Record<string, unknown>): CmsMediaAsset {
  return {
    id: String(row.id ?? ""),
    bucketId: String(row.bucketId ?? row.bucket_id ?? "website-media"),
    storagePath: String(row.storagePath ?? row.storage_path ?? ""),
    publicUrl: String(row.publicUrl ?? row.public_url ?? ""),
    name: String(row.name ?? "Untitled media"),
    folder: String(row.folder ?? "/"),
    kind: (row.kind === "video" || row.kind === "file" ? row.kind : "image") as CmsMediaAsset["kind"],
    mimeType: String(row.mimeType ?? row.mime_type ?? "application/octet-stream"),
    sizeBytes: Number(row.sizeBytes ?? row.size_bytes ?? 0),
    width: row.width == null ? null : Number(row.width),
    height: row.height == null ? null : Number(row.height),
    altText: String(row.altText ?? row.alt_text ?? ""),
    caption: String(row.caption ?? ""),
    variants: Array.isArray(row.variants) ? row.variants as CmsMediaAsset["variants"] : [],
    createdBy: row.createdBy == null && row.created_by == null ? null : String(row.createdBy ?? row.created_by),
    updatedBy: row.updatedBy == null && row.updated_by == null ? null : String(row.updatedBy ?? row.updated_by),
    createdAt: String(row.createdAt ?? row.created_at ?? ""),
    updatedAt: String(row.updatedAt ?? row.updated_at ?? ""),
  };
}
