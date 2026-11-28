import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import type { CmsDocumentType, CmsStatus } from "@/types/cms";
import type { CmsSupabaseClient } from "@/lib/supabaseServer";
import { CMS_CONTENT_CACHE_TAG, CMS_SETTINGS_CACHE_TAG, CMS_THEME_CACHE_TAG } from "@/lib/cmsDocuments";

const DANGEROUS_KEYS = new Set(["__proto__", "prototype", "constructor"]);

export function sanitizeJson(value: unknown, depth = 0): unknown {
  if (depth > 24) throw new Error("Content nesting is too deep.");
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new Error("Numbers must be finite.");
    return value;
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeJson(item, depth + 1));
  if (typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      if (DANGEROUS_KEYS.has(key)) continue;
      if (key.length > 160) throw new Error("Content field names are too long.");
      result[key] = sanitizeJson(child, depth + 1);
    }
    return result;
  }
  throw new Error("Unsupported content value.");
}

export function sanitizeDocumentData(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Content data must be an object.");
  const sanitized = sanitizeJson(value);
  const serialized = JSON.stringify(sanitized);
  if (serialized.length > 1_000_000) throw new Error("Content is too large.");
  return sanitized as Record<string, unknown>;
}

export function validSlug(value: unknown): value is string {
  return typeof value === "string" && value.length <= 160 && /^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/.test(value);
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 150);
}

export function validDocumentType(value: unknown): value is CmsDocumentType {
  return (
    typeof value === "string" &&
    ["package", "destination", "page", "homepage", "settings", "theme", "testimonial", "faq", "banner"].includes(value)
  );
}

const CLIENT_SETTINGS_KEYS = new Set(["branding", "contact", "footer", "social", "announcement", "seo"]);
const CLIENT_BRANDING_KEYS = new Set(["name", "shortName", "operatorName", "tagline", "headerLogo", "headerLogoAlt", "footerLogo", "footerLogoAlt"]);
const BASIC_SEO_KEYS = new Set(["title", "metaDescription"]);

const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

/**
 * Client admins may only change everyday content. Developer-only fields keep
 * their saved values instead of being erased when a client saves a form.
 */
export function restrictClientData(
  type: CmsDocumentType,
  data: Record<string, unknown>,
  current: Record<string, unknown> | null,
  isDeveloper: boolean,
): Record<string, unknown> {
  if (isDeveloper) return data;
  const result = { ...data };
  const saved = isRecord(current) ? current : {};

  if (type === "settings") {
    for (const key of Object.keys(result)) if (!CLIENT_SETTINGS_KEYS.has(key)) delete result[key];
    const savedBranding = isRecord(saved.branding) ? saved.branding : {};
    const nextBranding = isRecord(result.branding) ? result.branding : {};
    const branding: Record<string, unknown> = { ...savedBranding };
    for (const key of CLIENT_BRANDING_KEYS) if (key in nextBranding) branding[key] = nextBranding[key];
    result.branding = branding;
    const savedSeo = isRecord(saved.seo) ? saved.seo : {};
    const nextSeo = isRecord(result.seo) ? result.seo : {};
    const seo: Record<string, unknown> = { ...savedSeo };
    for (const key of BASIC_SEO_KEYS) if (key in nextSeo) seo[key] = nextSeo[key];
    result.seo = seo;
    return result;
  }

  if (["package", "destination", "page", "homepage"].includes(type) && isRecord(result.seo)) {
    const savedSeo = isRecord(saved.seo) ? saved.seo : {};
    const nextSeo = result.seo;
    const seo: Record<string, unknown> = { ...savedSeo };
    for (const key of BASIC_SEO_KEYS) if (key in nextSeo) seo[key] = nextSeo[key];
    result.seo = seo;
  }
  return result;
}

export async function recordAudit(
  supabase: CmsSupabaseClient,
  actorId: string,
  action: string,
  entityType: string,
  entityId: string | null,
  metadata: Record<string, unknown> = {},
): Promise<void> {
  const { error } = await supabase.from("cms_audit_log").insert({
    actor_id: actorId,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });
  if (error) throw new Error(`Content changed but audit logging failed: ${error.message}`);
}

export function publicPathForDocument(
  type: CmsDocumentType,
  slug: string,
  data: Record<string, unknown> = {},
  previousData: Record<string, unknown> = {},
): string | null {
  if (type === "package") return `/packages/${slug}`;
  if (type === "destination") return `/destinations/${slug}`;
  if (type === "homepage") return "/";
  if (type === "page") {
    const custom = typeof data.publicPath === "string" ? data.publicPath : typeof previousData.publicPath === "string" ? previousData.publicPath : null;
    if (custom?.startsWith("/") && !custom.startsWith("//")) return custom;
    return `/pages/${slug}`;
  }
  return null;
}

export function revalidateCms(type: CmsDocumentType, ...paths: Array<string | null | undefined>): void {
  revalidatePath("/", "layout");
  revalidateTag(CMS_CONTENT_CACHE_TAG, "max");
  if (type === "theme") revalidateTag(CMS_THEME_CACHE_TAG, "max");
  if (type === "settings") revalidateTag(CMS_SETTINGS_CACHE_TAG, "max");
  if (type === "package") {
    revalidatePath("/journeys");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  }
  if (type === "destination") {
    revalidatePath("/destinations");
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
  }
  for (const path of paths) if (path?.startsWith("/")) revalidatePath(path);
}

/** Rebuild exact media references for both independently stored content states. */
export async function syncMediaReferences(
  supabase: CmsSupabaseClient,
  documentId: string,
  draftData: unknown,
  publishedData: unknown,
): Promise<void> {
  const { data: assets, error: assetError } = await supabase.from("media_assets").select("id,public_url");
  if (assetError) throw new Error(assetError.message);

  const matchers = ((assets ?? []) as Array<{ id: string; public_url: string }>)
    .flatMap((asset) => [
      { key: asset.public_url, mediaId: asset.id },
      { key: asset.id, mediaId: asset.id },
    ])
    .filter((matcher) => matcher.key);

  const references: Array<{
    media_id: string;
    document_id: string;
    field_path: string;
    content_state: "draft" | "published";
  }> = [];

  function walk(value: unknown, path: string, contentState: "draft" | "published") {
    if (typeof value === "string") {
      for (const matcher of matchers) {
        if (value === matcher.key || value.includes(matcher.key)) {
          references.push({
            media_id: matcher.mediaId,
            document_id: documentId,
            field_path: `${contentState}.${path || "value"}`,
            content_state: contentState,
          });
        }
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => walk(item, `${path}.${index}`, contentState));
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, child] of Object.entries(value)) walk(child, path ? `${path}.${key}` : key, contentState);
    }
  }

  walk(draftData, "", "draft");
  walk(publishedData, "", "published");

  const unique = Array.from(
    new Map(references.map((reference) => [`${reference.media_id}:${reference.field_path}:${reference.content_state}`, reference])).values(),
  );

  const { error: deleteError } = await supabase.from("media_references").delete().eq("document_id", documentId);
  if (deleteError) throw new Error(deleteError.message);
  if (unique.length) {
    const { error } = await supabase.from("media_references").insert(unique);
    if (error) throw new Error(error.message);
  }
}

export function isCmsStatus(value: unknown): value is CmsStatus {
  return typeof value === "string" && ["draft", "published", "unpublished", "archived"].includes(value);
}
