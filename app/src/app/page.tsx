import PageShell from "@/components/PageShell";
import { BRAND } from "@/data/brandConfig";
import HomeVideoExperience from "@/components/HomeVideoExperience";
import DiscoverSection from "@/components/DiscoverSection";
import DestinationCarousel from "@/components/DestinationCarousel";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import PillarsTabs from "@/components/PillarsTabs";
import ImpactSection from "@/components/ImpactSection";
import CtaZoom from "@/components/CtaZoom";

export const metadata = {
  title: `${BRAND.name} — ${BRAND.tagline}`,
  description:
    "Specialist travel across India and Nepal: tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats. Enquire today.",
  openGraph: {
    siteName: BRAND.name,
    locale: "en_IN",
    type: "website",
  },
};

export default function Home() {
  return (
    <PageShell mainClassName="">
      <HomeVideoExperience />
      <DiscoverSection />
      <DestinationCarousel />
      <ExperienceCarousel />
      <PillarsTabs />

      <ImpactSection />
      <CtaZoom
        image="/images/orbit/kashmir-shikara-peaks.jpg"
        imageAlt="A shikara on Dal Lake beneath the forested and snow-capped Kashmir mountains"
        sectionClassName="min-h-[460px] md:min-h-[520px]"
        contentClassName="py-16 md:py-20 -translate-y-10 md:-translate-y-12"
      />
    </PageShell>
  );
}
