import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import PageShell from "@/components/PageShell";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageHero from "@/components/ui/PageHero";
import { getPackagesByCategory } from "@/data/catalogue";

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
  const normalizedCategory = category.toLowerCase();
  const categoryHero = normalizedCategory.includes("nepal")
    ? { image: "/images/destinations/nepal-boudhanath-dusk.jpg", alt: "Boudhanath Stupa in Kathmandu at dusk" }
    : normalizedCategory.includes("kashmir") || normalizedCategory.includes("houseboat")
      ? { image: "/images/destinations/kashmir-shikara.jpg", alt: "Shikara boats on Dal Lake in Srinagar, Kashmir" }
      : normalizedCategory.includes("himalaya") || normalizedCategory.includes("trek") || normalizedCategory.includes("ladakh")
        ? { image: "/images/destinations/ladakh-key-monastery.jpg", alt: "A Buddhist monastery in the high Himalaya of Ladakh" }
        : normalizedCategory.includes("kerala") || normalizedCategory.includes("south india")
          ? { image: "/images/destinations/kerala-backwaters.jpg", alt: "A traditional houseboat on Kerala's palm-lined backwaters" }
          : normalizedCategory.includes("wildlife") || normalizedCategory.includes("safari")
            ? { image: "/images/destinations/rhino.jpg", alt: "Wildlife in the forested landscapes of India and Nepal" }
            : { image: "/images/destinations/taj-mahal.jpg", alt: "The Taj Mahal in Agra, India" };

  return (
    <PageShell mainClassName="">
      <PageHero
        align="left"
        image={categoryHero.image}
        imageAlt={categoryHero.alt}
        eyebrow="Journey collection"
        title={
          <>
            {category}
            <span className="block text-white/60">
              {categoryPackages.length} journey{categoryPackages.length === 1 ? "" : "s"}
            </span>
          </>
        }
        lead="Every itinerary below is transcribed from the printed brochure catalogue. Dates, routing and inclusions are confirmed directly with a travel designer — small private groups, or a single traveller."
        meta={[{ value: `${categoryPackages.length} routes`, label: "From the brochure" }]}
        primaryCta={{ label: "Enquire about these journeys", href: `/enquiry?category=${encodeURIComponent(category)}` }}
        secondaryCta={{ label: "All journeys", href: "/journeys" }}
        scrollCue
      />

      {/* Breadcrumb + collection facts */}
      <section className="section-discover border-b border-white/5 py-10 md:py-12">
        <Container wide>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.16em] text-white/50">
            <Link href="/journeys" className="transition-colors hover:text-brass">
              All journeys
            </Link>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="text-white/90">{category}</span>
          </nav>

          <dl className="mt-8 grid gap-x-10 gap-y-6 sm:grid-cols-3">
            <div className="border-t border-white/10 pt-4">
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                Itineraries
              </dt>
              <dd className="mt-2 font-serif text-3xl font-light text-white">{categoryPackages.length}</dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                Regions covered
              </dt>
              <dd className="mt-2 font-serif text-2xl font-light leading-tight text-white">
                {Array.from(new Set(categoryPackages.flatMap((p) => p.region))).filter((r) => r !== "India" && r !== "Nepal").length}
              </dd>
            </div>
            <div className="border-t border-white/10 pt-4">
              <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                Group size
              </dt>
              <dd className="mt-2 font-serif text-2xl font-light leading-tight text-white">
                Up to 15, or solo
              </dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Catalogue + filters */}
      <section className="section-journeys py-14 md:py-20">
        <Container wide>
          <div className="mb-10 max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Browse the collection
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              {category}
              <span className="block text-white/55">from the brochure catalogue</span>
            </h2>
          </div>

          <Suspense fallback={<p className="py-20 font-display text-white/70">Loading journeys…</p>}>
            <SearchAndFilters packages={categoryPackages} />
          </Suspense>
        </Container>
      </section>
    </PageShell>
  );
}
