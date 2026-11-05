import Image from "next/image";
import { Suspense } from "react";
import { getAllPackages } from "@/data/catalogue";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BackgroundShapes from "@/components/ui/BackgroundShapes";

export const metadata: Metadata = {
  title: "Explore Tours",
  description:
    "Browse all India and Nepal tour packages. Filter by category, region, duration, activity and difficulty.",
};

const allPackages = getAllPackages();

export default function ExplorePage() {
  return (
    <PageShell>
      <BackgroundShapes />
      <Container>
        <ScrollReveal start="top 90%" once>
          <section className="relative my-6 h-[420px] overflow-hidden rounded-[1.25rem] shadow-2xl md:my-8 md:h-[520px] border border-white/5">
            <Image
              src="/images/hero/hero-pangong.jpg"
              alt="Himalayan mountain landscape above a high-altitude lake"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(177,138,81,0.08)_0%,transparent_50%,rgba(255,110,0,0.05)_100%)]" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-16 md:pt-20 pb-10">
              <p className="subtitle-large mb-5 text-brass">All journeys</p>
              <h1 className="text-h2 mb-5 text-white">Explore our tours</h1>
              <p className="max-w-2xl font-display text-lg leading-relaxed text-white/90">
                Every itinerary in our brochure catalogue — tailor-made tours, small-group journeys,
                Himalayan treks and stopovers. Search, filter, then enquire for dates and pricing.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-display text-white/60">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  {allPackages.length} curated itineraries
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  5 regions across India & Nepal
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Small groups & private tours
                </span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <Suspense fallback={<p className="py-20 font-display text-white/70">Loading trips…</p>}>
          <SearchAndFilters packages={allPackages} />
        </Suspense>
      </Container>
    </PageShell>
  );
}