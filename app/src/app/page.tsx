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
        <section className="section-signature border-t border-white/5 py-14 text-white md:py-20">
          <Container>
            <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <p className="subtitle-large mb-3 text-brass font-accent">Signature Journeys</p>
                <h2 className="text-h2 text-white font-serif font-light leading-tight">
                  Tailor-Made Tours &amp; Small-Group Expeditions
                </h2>
              </div>
              <Link
                href="/explore"
                className="group inline-flex items-center gap-2 text-[11px] font-accent uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
              >
                View all {allPackages.length} journeys
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
            <PackageGrid packages={featuredPackages} className="my-0" />
          </Container>
        </section>
      </ScrollReveal>

      <ImpactSection />
      <CtaZoom />
    </PageShell>
  );
}
