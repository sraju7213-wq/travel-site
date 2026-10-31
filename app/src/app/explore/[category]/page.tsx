import { Suspense } from "react";
import { getPackagesByCategory } from "@/data/catalogue";
import Link from "next/link";
import SearchAndFilters from "@/components/SearchAndFilters";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { Metadata } from "next";

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
      <Container>
        <nav
          className="flex items-center gap-3 border-b border-border py-4"
          aria-label="Breadcrumb"
        >
          <Link href="/explore" className="text-xs font-display font-semibold uppercase tracking-wider text-charcoal hover:text-brass transition-colors">
            &larr; All journeys
          </Link>
          <span className="font-display text-sm text-charcoal-soft">{category}</span>
        </nav>

        <section className="pb-4 pt-10">
          <p className="subtitle-large mb-5 text-brass">Category</p>
          <h1 className="text-h2 mb-5 uppercase text-charcoal">{category}</h1>
          <p className="max-w-2xl font-display text-lg leading-relaxed text-charcoal-soft">
            {categoryPackages.length} journey{categoryPackages.length === 1 ? "" : "s"} in this
            category. Dates and pricing are confirmed by direct enquiry.
          </p>
        </section>

        <Suspense fallback={<p className="py-20 font-display text-charcoal-soft">Loading journeys…</p>}>
          <SearchAndFilters packages={categoryPackages} />
        </Suspense>
      </Container>
    </PageShell>
  );
}
