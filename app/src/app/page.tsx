import Link from "next/link";
import { getAllPackages } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import { BRAND } from "@/data/brandConfig";
import Container from "@/components/Container";
import PackageGrid from "@/components/PackageGrid";
import HomeVideoExperience from "@/components/HomeVideoExperience";
import DiscoverSection from "@/components/DiscoverSection";
import DestinationCarousel from "@/components/DestinationCarousel";
import JourneysBand from "@/components/JourneysBand";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import PillarsTabs from "@/components/PillarsTabs";
import ImpactSection from "@/components/ImpactSection";
import CtaZoom from "@/components/CtaZoom";
import ScrollReveal from "@/components/ui/ScrollReveal";

const FEATURED_IDS = [
  "golden-triangle",
  "kashmir-zanskar-ladakh-trek",
  "glimpses-of-kerala",
  "nepal-wildlife-safari",
  "markha-valley",
  "kashmir-package-7-day",
];

const allPackages = getAllPackages();
const featuredPackages = FEATURED_IDS.map((id) => allPackages.find((p) => p.id === id)).filter(
  (p): p is NonNullable<typeof p> => Boolean(p),
);

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
      <JourneysBand />
      <ExperienceCarousel />
      <PillarsTabs />

      {/* Signature journeys */}
      <ScrollReveal start="top 90%" once>
        <section className="bg-[#0C1617] py-16 text-white md:py-24 border-t border-white/5">
          <Container>
            <div className="mb-10 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="subtitle-large mb-4 text-brass font-accent">Signature Journeys</p>
                <h2 className="text-h2 text-white font-serif font-light leading-tight">
                  Tailor-Made Tours &amp; Small-Group Expeditions
                </h2>
              </div>
              <Link href="/explore" className="btn-tertiary">
                View all {allPackages.length} journeys <span aria-hidden="true">→</span>
              </Link>
            </div>
            <PackageGrid packages={featuredPackages} />
          </Container>
        </section>
      </ScrollReveal>

      <ImpactSection />
      <CtaZoom />
    </PageShell>
  );
}
