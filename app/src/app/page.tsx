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
        <section className="section-signature relative overflow-hidden border-t border-white/5 py-10 text-white md:py-12">
          <Container className="max-w-7xl">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--color-wild-orange)]"><span className="h-px w-8 bg-[var(--color-wild-orange)]" />Journeys, thoughtfully chosen</p>
                <h2 className="max-w-3xl font-serif text-3xl font-light leading-tight tracking-normal text-white md:text-4xl">
                  Find your way through India &amp; Nepal
                </h2>
              </div>
              <Link
                href="/explore"
                className="group inline-flex shrink-0 items-center gap-3 border-b border-white/30 pb-2 text-[10px] font-sans uppercase tracking-[0.18em] text-white/65 transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)]"
              >
                View all {allPackages.length} journeys
                <span
                  aria-hidden="true"
                  className="text-base transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
            <PackageGrid packages={featuredPackages.slice(0, 3)} className="my-0" compact />
          </Container>
        </section>
      </ScrollReveal>

      <ImpactSection />
      <CtaZoom />
    </PageShell>
  );
}
