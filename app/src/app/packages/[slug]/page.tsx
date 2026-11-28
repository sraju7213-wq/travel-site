export const instant = false;
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Container from "@/components/Container";
import EnquiryModalProvider from "@/components/package/EnquiryModal";
import PackageHero from "@/components/package/PackageHero";
import PackageSidebar from "@/components/package/PackageSidebar";
import PackageWorkspace from "@/components/package/PackageWorkspace";
import PageShell from "@/components/PageShell";
import { BRAND } from "@/data/brandConfig";
import { getCmsPackageGallery, getPackageBySlugCms, getPublishedPackages } from "@/lib/cmsDocuments";

interface PackagePageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PackagePageProps): Promise<Metadata> {
  const { slug } = await params; const { isEnabled: preview } = await draftMode(); const pkg = await getPackageBySlugCms(slug, preview); if (!pkg) return { title: `Journey not found — ${BRAND.name}` };
  const seo = pkg.seo ?? {}; const title = seo.title || `${pkg.title} — ${BRAND.name}`; const description = seo.metaDescription || pkg.shortDescription || pkg.summary;
  return { title, description, alternates: { canonical: seo.canonicalUrl || `/packages/${pkg.slug}` }, openGraph: { title: seo.openGraphTitle || title, description: seo.openGraphDescription || description, type: "website", images: seo.socialImage ? [{ url: seo.socialImage, alt: seo.socialImageAlt }] : undefined }, robots: { index: seo.noIndex !== true, follow: seo.noFollow !== true } };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params; const { isEnabled: preview } = await draftMode(); const pkg = await getPackageBySlugCms(slug, preview); if (!pkg) notFound();
  const allPackages = await getPublishedPackages(preview);
  const explicitRelated = (pkg.relatedPackages ?? []).map((relatedSlug) => allPackages.find((item) => item.slug === relatedSlug)).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const related = explicitRelated.length ? explicitRelated : allPackages.filter((item) => item.id !== pkg.id).map((item) => ({ item, sameCategory: item.category === pkg.category, sharedRegions: item.region.filter((region) => pkg.region.includes(region)).length })).filter((entry) => entry.sameCategory || entry.sharedRegions > 0).sort((a, b) => Number(b.sameCategory) - Number(a.sameCategory) || b.sharedRegions - a.sharedRegions || a.item.title.localeCompare(b.item.title)).slice(0, 3).map((entry) => entry.item);
  const gallery = await getCmsPackageGallery(pkg);

  return <EnquiryModalProvider packageInfo={{ slug: pkg.slug, title: pkg.title, code: pkg.brochure_code, duration: pkg.duration }}><PageShell>
    <PackageHero pkg={pkg} />
    <Container wide className="py-8 animate-rise-in stagger-5"><div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12"><section className="lg:col-span-8"><PackageWorkspace pkg={pkg} gallery={gallery} /></section><aside className="lg:sticky lg:top-24 lg:col-span-4"><PackageSidebar pkg={pkg} related={related} /></aside></div></Container>
  </PageShell></EnquiryModalProvider>;
}
