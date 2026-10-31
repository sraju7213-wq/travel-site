import Link from "next/link";
import { getAllPackages } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import PackageGrid from "@/components/PackageGrid";
import HomeVideoExperience from "@/components/HomeVideoExperience";
import DiscoverSection from "@/components/DiscoverSection";
import DestinationCarousel from "@/components/DestinationCarousel";
import JourneysBand from "@/components/JourneysBand";
import ExperienceCarousel from "@/components/ExperienceCarousel";
import PillarsTabs from "@/components/PillarsTabs";
import ImpactSection from "@/components/ImpactSection";
import PromiseCards from "@/components/PromiseCards";
import CtaZoom from "@/components/CtaZoom";
import NewsletterSection from "@/components/NewsletterSection";

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

// The newsletter form is only shown when a mailing list is actually connected,
// so visitors never see a signup form that cannot record a subscription.
const newsletterConfigured = Boolean(process.env.NEWSLETTER_API_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);

export const metadata = {
  title: "India Nepal Travel Organisation — Specialist Travel Since 1927",
  description:
    "Specialist travel across India and Nepal: tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats. Enquire today.",
  openGraph: {
    siteName: "India Nepal Travel Organisation",
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
      <section className="bg-[#0C1617] py-20 text-white md:py-28 border-t border-white/5">
        <Container>
          <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="subtitle-large mb-5 text-brass">Signature journeys</p>
              <h2 className="text-h2 text-white">
                Tailor-made tours and small-group journeys
              </h2>
            </div>
            <Link href="/explore" className="btn-tertiary">
              View all {allPackages.length} journeys <span aria-hidden="true">→</span>
            </Link>
          </div>
          <PackageGrid packages={featuredPackages} />
        </Container>
      </section>

      <ImpactSection />
      <PromiseCards />
      <CtaZoom />
      {newsletterConfigured && <NewsletterSection />}
    </PageShell>
  );
}
