import type { MetadataRoute } from "next";
import { getCmsSiteUrl, getSiteSettings } from "@/lib/cmsDocuments";

export default async function robots(): Promise<MetadataRoute.Robots> { const settings = await getSiteSettings(false); const base = getCmsSiteUrl(settings); return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/login", "/api/admin/preview"] }], sitemap: `${base}/sitemap.xml` }; }
