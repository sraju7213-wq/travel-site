import { Suspense } from "react";
import type { Metadata } from "next";
import CtaZoom from "@/components/CtaZoom";
import Container from "@/components/Container";
import PageShell from "@/components/PageShell";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageHero from "@/components/ui/PageHero";
import { getAllPackages } from "@/data/catalogue";

export const metadata: Metadata = {
  title: "Explore Tours",
  description:
    "Browse all India and Nepal tour packages. Filter by category, region, duration, activity and difficulty.",
};

const allPackages = getAllPackages();

const CATALOGUE_FACTS = [
  { value: String(allPackages.length), label: "Itineraries", note: "From the printed brochure catalogue." },
  { value: "6", label: "Categories", note: "Stopovers, India tours, Himalaya, Nepal and houseboats." },
  { value: "2", label: "Realms", note: "India and Nepal specialist travel." },
  { value: "Up to 15", label: "Per group", note: "Small private groups or solo travellers." },
];

export default function ExplorePage() {
  return (
    <PageShell mainClassName="">
      <PageHero
        align="left"
        image="/images/destinations/journey.jpg"
        imageAlt="The Taj Mahal in Agra standing majestically under a vibrant blue sky"
        eyebrow="Curated journeys"
        title={
          <>
            Journeys across
            <span className="block text-white/60">India & Nepal</span>
          </>
        }
        lead={
          <>
            Twenty-seven itineraries, from Himalayan treks to Kashmir houseboats.
            <br className="hidden sm:block" />
            Find the journey that fits the way you travel.
          </>
        }
        primaryCta={{ label: "Plan a tailor-made trip", href: "/enquiry" }}
        secondaryCta={{ label: "Kashmir houseboats", href: "/houseboats" }}
        scrollCue
      />

      {/* Catalogue + filters */}
      <section className="section-journeys py-14 md:py-20">
        <Container wide>
          <div className="mb-10 max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Explore the journeys
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              Journeys shaped around you
              <span className="block text-white/55">from Himalaya to the Kashmir valleys</span>
            </h2>
          </div>

          <Suspense fallback={<p className="py-20 font-display text-white/70">Loading journeys…</p>}>
            <SearchAndFilters packages={allPackages} />
          </Suspense>
        </Container>
      </section>

      <CtaZoom
        image="/images/destinations/kashmir-shikara.jpg"
        imageAlt="Houseboats moored on Dal Lake in Srinagar beneath snow-covered mountains"
        eyebrow="Plan your journey"
        title={
          <>
            India & Nepal,<br className="hidden sm:block" /> your way.
          </>
        }
        body="Every journey can be tailored around your dates, party size and interests. Tell us what you want to discover."
        ctaLabel="Enquire now"
        ctaHref="/enquiry"
      />
    </PageShell>
  );
}
