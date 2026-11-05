import { Suspense } from "react";
import { getPackagesByCategory } from "@/data/catalogue";
import Link from "next/link";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { Metadata } from "next";
import ScrollReveal from "@/components/ui/ScrollReveal";
import BackgroundShapes from "@/components/ui/BackgroundShapes";

interface CategoryPageProps {
  params: { category: string };
}

export const instant = false;
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = ((await params).category as string) ?? "";
  const packages = getPackagesByCategory(category);
  return {
    title: `${category} Journeys`,
    description: packages
      ? `Browse ${packages.length} ${category.toLowerCase()} packages across India and Nepal.`
      : `Browse ${category} packages across India and Nepal.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = decodeURIComponent((await params).category as string);
  const categoryPackages = getPackagesByCategory(category);

  return (
    <PageShell>
      <BackgroundShapes />
      <Container>
        <ScrollReveal start="top 90%" once>
          <section className="relative my-6 h-[360px] overflow-hidden rounded-[1.25rem] shadow-2xl md:my-8 md:h-[440px] border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a2c] via-[#132325] to-[#0C1617]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,138,81,0.15)_0%,transparent_70%)]" />
            <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-8 pt-12 md:pt-16 pb-8">
              {/* Breadcrumb */}
              <nav className="mb-6 flex items-center gap-2 text-xs font-display" aria-label="Breadcrumb">
                <Link
                  href="/explore"
                  className="flex items-center gap-1.5 text-white/60 hover:text-brass transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 12H5M12 5l-7 7 7 7" />
                  </svg>
                  <span className="font-semibold uppercase tracking-wider">All journeys</span>
                </Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 flex-shrink-0">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="font-medium text-white/90">{category}</span>
              </nav>

              <p className="subtitle-large mb-4 text-brass">Category</p>
              <h1 className="text-h2 mb-4 text-white">{category}</h1>
              <p className="max-w-2xl font-display text-lg leading-relaxed text-white/80">
                {categoryPackages.length} journey{categoryPackages.length === 1 ? "" : "s"} in this category.
                Dates and pricing are confirmed by direct enquiry.
              </p>

              {/* Category Stats */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-sm font-display text-white/60">
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {categoryPackages.length} itinerar{categoryPackages.length === 1 ? "y" : "ies"}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  Small groups & private tours
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brass">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Tailor-made available
                </span>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <Suspense fallback={<p className="py-20 font-display text-white/70">Loading journeys…</p>}>
          <SearchAndFilters packages={categoryPackages} />
        </Suspense>
      </Container>
    </PageShell>
  );
}