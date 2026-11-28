import type { Metadata } from "next";
import { draftMode } from "next/headers";
import PageShell from "@/components/PageShell";
import HomeVideoExperience from "@/components/HomeVideoExperience";
import DiscoverSection from "@/components/DiscoverSection";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import PillarsTabs from "@/components/PillarsTabs";
import ImpactSection from "@/components/ImpactSection";
import CtaZoom from "@/components/CtaZoom";
import HomepageRenderer from "@/components/cms/HomepageRenderer";
import { getCmsHomepage, getCmsSiteUrl, getPublishedDestinations, getPublishedPackages, getSiteSettings } from "@/lib/cmsDocuments";
import type { CmsSection } from "@/types/cms";

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: preview } = await draftMode();
  const [settings, homepage] = await Promise.all([getSiteSettings(preview), getCmsHomepage(preview)]);
  const source = preview ? homepage?.draftData : homepage?.publishedData ?? homepage?.draftData;
  const seo = source?.seo ?? {};
  const siteUrl = getCmsSiteUrl(settings);
  const title = seo.title || `${settings.branding.name} — ${settings.branding.tagline ?? ""}`.trim();
  const description = seo.metaDescription || "Specialist travel across India and Nepal: tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats. Enquire today.";
  return { title, description, alternates: { canonical: seo.canonicalUrl || siteUrl }, openGraph: { title: seo.openGraphTitle || title, description: seo.openGraphDescription || description, type: "website", images: seo.socialImage ? [{ url: seo.socialImage, alt: seo.socialImageAlt }] : undefined }, robots: { index: seo.noIndex !== true, follow: seo.noFollow !== true } };
}

export default async function Home() {
  const { isEnabled: preview } = await draftMode();
  const [homepage, packages, destinations] = await Promise.all([getCmsHomepage(preview), getPublishedPackages(preview), getPublishedDestinations(preview)]);
  const data = preview ? homepage?.draftData : homepage?.publishedData ?? homepage?.draftData;
  const sections = (data?.sections ?? []) as CmsSection[];

  return <PageShell mainClassName="">
    {homepage && sections.length ? <HomepageRenderer sections={sections} packages={packages} destinations={destinations} /> : <>
      <HomeVideoExperience />
      <DiscoverSection />
      <DestinationCarousel destinations={destinations.map((destination) => ({ name: destination.name, tagline: destination.tagline ?? destination.shortDescription ?? "", image: destination.heroImage || destination.image || "", blurb: destination.shortDescription || destination.tagline || destination.description || "", href: typeof destination.href === "string" ? destination.href : `/destinations/${destination.slug ?? ""}` }))} />
      <ExperienceCarousel />
      <PillarsTabs />
      <ImpactSection />
      <CtaZoom image="/images/orbit/kashmir-shikara-peaks.jpg" imageAlt="A shikara on Dal Lake beneath the forested and snow-capped Kashmir mountains" sectionClassName="min-h-[460px] md:min-h-[520px]" contentClassName="py-16 md:py-20 -translate-y-10 md:-translate-y-12" />
    </>}
  </PageShell>;
}
