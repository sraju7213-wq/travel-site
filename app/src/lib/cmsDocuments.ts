import "server-only";

import { draftMode } from "next/headers";
import { cacheTag } from "next/cache";
import { getAllPackages, slugify, toPackageViewModel, type GalleryImage } from "@/data/catalogue";
import { DESTINATIONS, type Destination } from "@/data/siteContent";
import { BRAND } from "@/data/brandConfig";
import type {
  CmsDestination,
  CmsDocument,
  CmsDocumentType,
  CmsHomepageData,
  CmsPageData,
  CmsSettings,
  CmsStatus,
  CmsTheme,
} from "@/types/cms";
import type { PackageViewModel, TravelPackage } from "@/types/travel";
import { isSupabaseConfigured } from "@/lib/supabaseConfig";
import { createSupabasePublicClient, createSupabaseServerClient } from "@/lib/supabaseServer";
import { DEFAULT_CMS_SETTINGS, DEFAULT_CMS_THEME } from "@/lib/cmsDefaults";

interface CmsDocumentRow {
  id: string;
  type: CmsDocumentType;
  slug: string;
  title: string;
  status: CmsStatus;
  draft_data: Record<string, unknown> | null;
  published_data: Record<string, unknown> | null;
  published_slug: string | null;
  sort_order: number;
  created_by: string | null;
  updated_by: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export const CMS_THEME_CACHE_TAG = "cms-theme";
export const CMS_SETTINGS_CACHE_TAG = "cms-settings";

const DOCUMENT_SELECT =
  "id,type,slug,title,status,draft_data,published_data,published_slug,sort_order,created_by,updated_by,published_at,created_at,updated_at";
const PUBLIC_DOCUMENT_SELECT =
  "id,type,slug,title,status,published_data,published_slug,sort_order,created_by,updated_by,published_at,created_at,updated_at";

function normalizeDocument<T>(row: CmsDocumentRow): CmsDocument<T> {
  return {
    id: row.id,
    type: row.type,
    slug: row.slug,
    title: row.title,
    status: row.status,
    draftData: (row.draft_data ?? {}) as T,
    publishedData: row.published_data as T | null,
    publishedSlug: row.published_slug,
    sortOrder: row.sort_order,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function isPreviewRequested(explicitPreview?: boolean): Promise<boolean> {
  if (explicitPreview !== undefined) return explicitPreview;
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}

async function cmsClient(preview: boolean) {
  return preview ? createSupabaseServerClient() : createSupabasePublicClient();
}

export const CMS_CONTENT_CACHE_TAG = "cms-content";

/** Cached published document read for public pages and their metadata. */
async function getPublishedCmsDocumentCached<T>(type: CmsDocumentType, slug: string): Promise<CmsDocument<T> | null> {
  "use cache";
  cacheTag(CMS_CONTENT_CACHE_TAG);
  const { data, error } = await createSupabasePublicClient()
    .from("public_cms_documents")
    .select(PUBLIC_DOCUMENT_SELECT)
    .eq("type", type)
    .eq("published_slug", slug)
    .eq("status", "published")
    .not("published_data", "is", null)
    .maybeSingle();
  if (error) throw new Error(`Unable to load CMS ${type} content: ${error.message}`);
  return data ? normalizeDocument<T>(data as unknown as CmsDocumentRow) : null;
}

/** Cached published collection read for public pages. */
async function getPublishedCmsDocumentsCached<T>(type: CmsDocumentType): Promise<Array<CmsDocument<T>>> {
  "use cache";
  cacheTag(CMS_CONTENT_CACHE_TAG);
  const { data, error } = await createSupabasePublicClient()
    .from("public_cms_documents")
    .select(PUBLIC_DOCUMENT_SELECT)
    .eq("type", type)
    .eq("status", "published")
    .not("published_data", "is", null)
    .order("sort_order")
    .order("title");
  if (error) throw new Error(`Unable to load CMS ${type} collection: ${error.message}`);
  return ((data ?? []) as unknown as CmsDocumentRow[]).map((row) => normalizeDocument<T>(row));
}

export async function getCmsDocument<T = Record<string, unknown>>(
  type: CmsDocumentType,
  slug: string,
  preview?: boolean,
): Promise<CmsDocument<T> | null> {
  if (!isSupabaseConfigured) return null;
  const isPreview = await isPreviewRequested(preview);
  if (!isPreview) return getPublishedCmsDocumentCached<T>(type, slug);
  const supabase = await cmsClient(true);
  const { data, error } = await supabase
    .from("cms_documents")
    .select(DOCUMENT_SELECT)
    .eq("type", type)
    .eq("slug", slug)
    .neq("status", "archived")
    .maybeSingle();
  if (error) throw new Error(`Unable to load CMS ${type} content: ${error.message}`);
  return data ? normalizeDocument<T>(data as unknown as CmsDocumentRow) : null;
}

export async function getCmsDocuments<T = Record<string, unknown>>(
  type: CmsDocumentType,
  preview?: boolean,
): Promise<Array<CmsDocument<T>>> {
  if (!isSupabaseConfigured) return [];
  const isPreview = await isPreviewRequested(preview);
  if (!isPreview) return getPublishedCmsDocumentsCached<T>(type);
  const { data, error } = await (await cmsClient(true))
    .from("cms_documents")
    .select(DOCUMENT_SELECT)
    .eq("type", type)
    .neq("status", "archived")
    .order("sort_order")
    .order("title");
  if (error) throw new Error(`Unable to load CMS ${type} collection: ${error.message}`);
  return ((data ?? []) as unknown as CmsDocumentRow[]).map((row) => normalizeDocument<T>(row));
}

export function contentOf<T>(document: CmsDocument<T>, preview = false): T {
  const previewEnabled = preview;
  return (previewEnabled ? document.draftData : document.publishedData ?? document.draftData) as T;
}

function normalizePackage(pkg: TravelPackage & Record<string, unknown>, slug?: string): PackageViewModel {
  const text = (value: unknown): string => (typeof value === "string" ? value : "");
  const regions = Array.isArray(pkg.region) ? pkg.region.map(String) : [];
  const flags = Array.isArray(pkg.content_flags) ? pkg.content_flags : [];
  const id = typeof pkg.id === "string" && pkg.id ? pkg.id : slug ?? (text(pkg.slug) || "package");
  const base = toPackageViewModel({ ...pkg, id, region: regions, content_flags: flags } as TravelPackage);
  const title = typeof pkg.title === "string" ? pkg.title : base.title;
  const media = Array.isArray(pkg.media) ? (pkg.media as PackageViewModel["media"]) : [];
  return {
    ...base,
    ...pkg,
    id,
    title,
    slug: slug ?? (typeof pkg.slug === "string" ? pkg.slug : base.slug),
    region: regions.length ? regions : base.region,
    summary: text(pkg.summary),
    category: text(pkg.category),
    duration: text(pkg.duration),
    brochure_code: text(pkg.brochure_code),
    destination: text(pkg.destination),
    destinationSlug: text(pkg.destinationSlug),
    regionName: text(pkg.regionName),
    difficulty: typeof pkg.difficulty === "string" || pkg.difficulty === null ? pkg.difficulty : base.difficulty,
    content_flags: [],
    hasReviewFlags: base.hasReviewFlags,
    difficultyLabel: typeof pkg.difficulty === "string" ? pkg.difficulty : null,
    difficultyVerified: typeof pkg.difficulty === "string" && pkg.difficulty.length > 0,
    multiCountry: base.multiCountry,
    primaryRegion: base.primaryRegion,
    secondaryRegions: base.secondaryRegions,
    media,
  } as PackageViewModel;
}

export async function getPublishedPackages(preview?: boolean): Promise<PackageViewModel[]> {
  if (!isSupabaseConfigured) return getAllPackages();
  const documents = await getCmsDocuments<TravelPackage & Record<string, unknown>>("package", preview);
  const isPreview = await isPreviewRequested(preview);
  return documents
    .filter((doc) => isPreview || doc.status === "published")
    .map((doc) => {
      const source = isPreview ? doc.draftData : doc.publishedData ?? doc.draftData;
      return { ...normalizePackage(source, doc.publishedSlug ?? doc.slug), status: doc.status };
    });
}

export async function getPackageBySlugCms(slug: string, preview?: boolean): Promise<PackageViewModel | undefined> {
  if (!isSupabaseConfigured) return getAllPackages().find((pkg) => pkg.slug === slug);
  const isPreview = await isPreviewRequested(preview);
  const document = await getCmsDocument<TravelPackage & Record<string, unknown>>("package", slug, isPreview);
  if (!document) return undefined;
  const source = isPreview ? document.draftData : document.publishedData ?? document.draftData;
  return { ...normalizePackage(source, document.publishedSlug ?? document.slug), status: document.status };
}

export async function getCmsPackageGallery(pkg: PackageViewModel): Promise<GalleryImage[]> {
  const hasCmsMediaModel = Array.isArray(pkg.media) || Array.isArray(pkg.gallery) || "heroImage" in pkg;
  const combined = [...(pkg.media ?? []), ...(pkg.gallery ?? []), ...(pkg.additionalImages ?? [])];
  if (combined.some((image) => image.visible !== false && image.url)) {
    const seen = new Set<string>();
    return combined
      .filter((image) => image.visible !== false && image.url && !seen.has(image.url) && seen.add(image.url))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((image) => ({ src: image.url, caption: image.caption ?? image.alt ?? "" }));
  }
  if (hasCmsMediaModel) return [];
  const { getPackageGallery } = await import("@/data/catalogue");
  return getPackageGallery(pkg);
}

function mapStaticDestination(destination: Destination, index: number): CmsDestination {
  const slug = slugify(destination.name);
  return {
    ...destination,
    slug,
    name: destination.name,
    shortDescription: destination.blurb,
    description: destination.blurb,
    heroImage: destination.image,
    imageAlt: destination.name,
    focalPoint: { x: 0.5, y: 0.5 },
    gallery: [{ url: destination.image, alt: destination.name, caption: destination.tagline, order: index }],
    highlights: [],
    relatedPackages: [],
    location: {},
    seo: { title: destination.name, metaDescription: destination.blurb },
    href: `/destinations/${slug}`,
  };
}

export async function getPublishedDestinations(preview?: boolean): Promise<CmsDestination[]> {
  if (!isSupabaseConfigured) return DESTINATIONS.map(mapStaticDestination);
  const documents = await getCmsDocuments<CmsDestination>("destination", preview);
  const isPreview = await isPreviewRequested(preview);
  return documents.map((doc) => {
    const source = isPreview ? doc.draftData : doc.publishedData ?? doc.draftData;
    return { ...source, slug: doc.publishedSlug ?? doc.slug, name: source.name };
  });
}

export async function getDestinationBySlug(slug: string, preview?: boolean): Promise<CmsDestination | undefined> {
  if (!isSupabaseConfigured) return DESTINATIONS.map(mapStaticDestination).find((destination) => destination.slug === slug);
  const isPreview = await isPreviewRequested(preview);
  const document = await getCmsDocument<CmsDestination>("destination", slug, isPreview);
  if (!document) return undefined;
  const source = isPreview ? document.draftData : document.publishedData ?? document.draftData;
  return { ...source, slug: document.publishedSlug ?? document.slug, name: source.name };
}

export async function getCmsHomepage(preview?: boolean): Promise<CmsDocument<CmsHomepageData> | null> {
  return getCmsDocument<CmsHomepageData>("homepage", "home", preview);
}

export async function getCmsPage(slug: string, preview?: boolean): Promise<CmsDocument<CmsPageData> | null> {
  return getCmsDocument<CmsPageData>("page", slug, preview);
}

export async function getSiteSettings(preview?: boolean): Promise<CmsSettings> {
  if (!isSupabaseConfigured) return DEFAULT_CMS_SETTINGS;
  const document = await getCmsDocument<Partial<CmsSettings>>("settings", "global", preview);
  const source = document ? (await isPreviewRequested(preview) ? document.draftData : document.publishedData ?? document.draftData) : {};
  return {
    ...DEFAULT_CMS_SETTINGS,
    ...source,
    branding: { ...DEFAULT_CMS_SETTINGS.branding, ...source.branding },
    contact: { ...DEFAULT_CMS_SETTINGS.contact, ...source.contact },
    navigation: { ...DEFAULT_CMS_SETTINGS.navigation, ...source.navigation },
    footer: { ...DEFAULT_CMS_SETTINGS.footer, ...source.footer },
    announcement: { ...DEFAULT_CMS_SETTINGS.announcement, ...source.announcement },
    social: source.social ?? DEFAULT_CMS_SETTINGS.social,
    seo: { ...DEFAULT_CMS_SETTINGS.seo, ...source.seo },
  };
}

/**
 * Published settings for metadata. Viewport and metadata cannot be streamed,
 * so these reads are cached instead of deferring the whole route to request time.
 */
export async function getCmsSettingsForMetadata(): Promise<CmsSettings> {
  "use cache";
  cacheTag(CMS_SETTINGS_CACHE_TAG);
  return getSiteSettings(false);
}

/**
 * Theme values for the document viewport and layout shell. Viewport cannot be
 * streamed, so the read is cached instead of deferring the whole route to
 * request time.
 */
export async function getCmsThemeForViewport(): Promise<CmsTheme> {
  "use cache";
  cacheTag(CMS_THEME_CACHE_TAG);
  return getCmsTheme(false);
}

export async function getCmsTheme(preview?: boolean): Promise<CmsTheme> {
  if (!isSupabaseConfigured) return DEFAULT_CMS_THEME;
  const document = await getCmsDocument<Partial<CmsTheme>>("theme", "global", preview);
  const source = document ? (await isPreviewRequested(preview) ? document.draftData : document.publishedData ?? document.draftData) : {};
  return {
    ...DEFAULT_CMS_THEME,
    ...source,
    colors: { ...DEFAULT_CMS_THEME.colors, ...source.colors },
    typography: { ...DEFAULT_CMS_THEME.typography, ...source.typography },
    buttons: { ...DEFAULT_CMS_THEME.buttons, ...source.buttons },
    borderRadius: { ...DEFAULT_CMS_THEME.borderRadius, ...source.borderRadius },
  };
}

export function packagePublicUrl(slug: string): string {
  return `/packages/${slug}`;
}

export function destinationPublicUrl(slug: string): string {
  return `/destinations/${slug}`;
}

export function pagePublicUrl(slug: string): string {
  return `/pages/${slug}`;
}

export function getCmsSiteUrl(settings?: CmsSettings): string {
  const configured = settings?.siteUrl || settings?.seo?.siteUrl || process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const CMS_BRAND_FALLBACK = BRAND;
