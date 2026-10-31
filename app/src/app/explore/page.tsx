import Image from "next/image";
import { Suspense } from "react";
import { getAllPackages } from "@/data/catalogue";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Tours",
  description:
    "Browse all India and Nepal tour packages. Filter by category, region, duration, activity and difficulty.",
};

const allPackages = getAllPackages();

export default function ExplorePage() {
  return (
    <PageShell>
      <Container>
        <section className="relative my-6 h-[420px] overflow-hidden rounded-[1.25rem] shadow-2xl md:my-8 md:h-[520px]">
          <Image
            src="/images/hero/hero-pangong.jpg"
            alt="Himalayan mountain landscape above a high-altitude lake"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-16 md:pt-20 pb-10">
            <p className="subtitle-large mb-5 text-brass">All journeys</p>
            <h1 className="text-h2 mb-5 text-white">Explore our tours</h1>
            <p className="max-w-2xl font-display text-lg leading-relaxed text-white/90">
              Every itinerary in our brochure catalogue — tailor-made tours, small-group journeys,
              Himalayan treks and stopovers. Search, filter, then enquire for dates and pricing.
            </p>
          </div>
        </section>

        <Suspense fallback={<p className="py-20 font-display text-white/70">Loading trips…</p>}>
          <SearchAndFilters packages={allPackages} />
        </Suspense>
      </Container>
    </PageShell>
  );
}
