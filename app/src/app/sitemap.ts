import type { MetadataRoute } from "next";
import { getCmsDocuments, getCmsSiteUrl, getPublishedDestinations, getPublishedPackages, getSiteSettings } from "@/lib/cmsDocuments";
import { publicPathForDocument } from "@/lib/cmsServer";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, packages, destinations, pages] = await Promise.all([getSiteSettings(false), getPublishedPackages(false), getPublishedDestinations(false), getCmsDocuments<Record<string, unknown>>("page", false)]);
  const base = getCmsSiteUrl(settings);
  const staticPaths = ["/", "/journeys", "/destinations", "/houseboats", "/about", "/contact", "/enquiry", "/privacy"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({ url: `${base}${path}` }));
  for (const pkg of packages) {
    const seo = pkg.seo ?? {};
    if (seo.noIndex || seo.includeInSitemap === false) continue;
    entries.push({ url: `${base}/packages/${pkg.slug}`, lastModified: undefined });
  }
  for (const destination of destinations) {
    const seo = destination.seo ?? {};
    if (seo.noIndex || seo.includeInSitemap === false) continue;
    entries.push({ url: `${base}/destinations/${destination.slug}` });
  }
  for (const page of pages) {
    const data = page.publishedData ?? {};
    const seo = (data.seo ?? {}) as { noIndex?: boolean; includeInSitemap?: boolean };
    if (seo.noIndex || seo.includeInSitemap === false) continue;
    const path = publicPathForDocument("page", page.publishedSlug ?? page.slug, data, data);
    entries.push({ url: `${base}${path ?? `/pages/${page.publishedSlug ?? page.slug}`}`, lastModified: new Date(page.updatedAt) });
  }
  return entries;
}
