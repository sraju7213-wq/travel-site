import Link from "next/link";
import Image from "next/image";
import { getAllPackages, getPackageBySlug, getPackageGallery } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import PackageGrid from "@/components/PackageGrid";
import InteractiveItinerary from "@/components/InteractiveItinerary";
import PackageGallery from "@/components/PackageGallery";
import RouteMap from "@/components/RouteMap";
import InclusionsExclusions from "@/components/InclusionsExclusions";
import { notFound } from "next/navigation";
interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateMetadata({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    return { title: "Journey not found — India Nepal Travel Organisation" };
  }
  return {
    title: `${pkg.title} — India Nepal Travel Organisation`,
    description: pkg.summary,
    openGraph: {
      title: pkg.title,
      description: pkg.summary,
      type: "website",
    },
  };
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    notFound();
  }

  const related = getAllPackages()
    .filter((p) => p.id !== pkg.id)
    .map((p) => {
      const sameCategory = p.category === pkg.category;
      const sharedRegions = p.region.filter((r) => pkg.region.includes(r)).length;
      return { p, sameCategory, sharedRegions };
    })
    .filter((entry) => entry.sameCategory || entry.sharedRegions > 0)
    .sort((a, b) => {
      if (a.sameCategory !== b.sameCategory) return a.sameCategory ? -1 : 1;
      if (a.sharedRegions !== b.sharedRegions) return b.sharedRegions - a.sharedRegions;
      return a.p.title.localeCompare(b.p.title);
    })
    .slice(0, 3)
    .map((entry) => entry.p);
  const enquiryHref = `/enquiry?package=${pkg.slug}`;
  const gallery = getPackageGallery(pkg);
  return (
    <PageShell>
      {/* Breadcrumbs */}
      <div className="border-b border-border">
        <Container>
          <nav
            className="py-4 text-xs font-display font-medium uppercase tracking-wider text-charcoal-soft"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap gap-2 list-none">
              <li>
                <Link href="/" className="transition-colors hover:text-brass">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">&rsaquo;</li>
              <li>
                <Link
                  href={`/explore/${encodeURIComponent(pkg.category)}`}
                  className="transition-colors hover:text-brass"
                >
                  {pkg.category}
                </Link>
              </li>
              <li aria-hidden="true">&rsaquo;</li>
              <li className="text-charcoal-soft">{pkg.title}</li>
            </ol>
          </nav>
        </Container>
      </div>

      {/* Hero */}
      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-forest text-white md:min-h-[620px]">
        <Image
          src={`/images/packages/${pkg.slug}.jpg`}
          alt={pkg.title}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"
        />
        <div className="relative z-10 w-full px-4 pb-16 pt-32 md:px-8 md:pb-20">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-4xl">
              <span className="mb-4 inline-block font-display text-sm font-semibold uppercase tracking-wider text-brass">
                {pkg.category}
              </span>
              <h1 className="text-h2 mb-6 uppercase text-white">{pkg.title}</h1>
              <p className="mb-8 max-w-xl font-display text-lg leading-relaxed text-white/85">
                {pkg.summary}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-button border border-white/30 px-3 py-1.5 font-display text-xs font-medium uppercase text-white/90">
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center rounded-button border border-white/30 px-3 py-1.5 font-display text-xs font-medium uppercase text-white/90">
                  {pkg.brochure_code}
                </span>
                <Link href={enquiryHref} className="btn-primary">
                  Enquire about this journey <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package identity + overview */}
      <Container>
        <section className="py-16 md:py-20">
          {/* Key Facts Ribbon Bar */}
          <div className="mb-12 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-[1.25rem] border border-border/80 bg-white p-5 md:p-6 shadow-md">
            <div className="border-r border-border/80 pr-4">
              <p className="text-[0.65rem] font-display uppercase tracking-widest text-brass font-semibold">Region</p>
              <p className="font-serif text-base font-bold text-charcoal truncate mt-0.5">{pkg.region.join(", ")}</p>
            </div>
            <div className="sm:border-r border-border/80 pr-4">
              <p className="text-[0.65rem] font-display uppercase tracking-widest text-brass font-semibold">Duration</p>
              <p className="font-serif text-base font-bold text-charcoal mt-0.5">{pkg.duration}</p>
            </div>
            <div className="border-r border-border/80 pr-4">
              <p className="text-[0.65rem] font-display uppercase tracking-widest text-brass font-semibold">Group Departures</p>
              <p className="font-serif text-base font-bold text-charcoal mt-0.5">Up to 15 or Solo</p>
            </div>
            <div>
              <p className="text-[0.65rem] font-display uppercase tracking-widest text-brass font-semibold">Brochure Code</p>
              <p className="font-serif text-base font-bold text-charcoal mt-0.5">{pkg.brochure_code}</p>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-h3 mb-6 text-charcoal">Overview</h2>
              <p className="mb-8 font-display text-lg leading-relaxed text-charcoal-soft">
                {pkg.summary} Drawn directly from our historic brochure catalogue, every departure is confirmed by personal consultation.
              </p>

              {/* Interactive Visual Photography Gallery */}
              <PackageGallery images={gallery} title={pkg.title} />

              {pkg.highlights.length > 0 && (
                <div className="mb-12 rounded-[1.25rem] border border-border/80 bg-white p-8 shadow-sm">
                  <h3 className="mb-5 font-serif text-xl font-bold text-charcoal flex items-center gap-2">
                    <span className="text-brass">✦</span>
                    <span>Journey Highlights</span>
                  </h3>
                  <ul className="grid gap-3.5 sm:grid-cols-2 font-display text-sm leading-relaxed text-charcoal-soft">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass/10 text-brass text-xs font-bold mt-0.5">
                          ✓
                        </span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-[1rem] bg-forest p-8 shadow-2xl border border-white/10">
                <h3 className="mb-4 font-serif text-xl font-bold text-white">
                  Journey at a glance
                </h3>
                <dl className="space-y-4 font-display text-sm text-white/80">
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt>Category</dt>
                    <dd className="text-right">{pkg.category}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt>Duration</dt>
                    <dd className="text-right">{pkg.duration}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt>Brochure code</dt>
                    <dd className="text-right">{pkg.brochure_code}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                    <dt>Regions</dt>
                    <dd className="text-right">{pkg.region.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Brochure reference</dt>
                    <dd className="text-right">Page {pkg.source_page}</dd>
                  </div>
                </dl>
                <Link
                  href={enquiryHref}
                  className="btn-primary mt-8 flex w-full items-center justify-center gap-1.5"
                >
                  Enquire about this journey <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Route Map */}
        <RouteMap pkg={pkg} />

        {/* Interactive Day-by-day itinerary */}
        <InteractiveItinerary itinerary={pkg.itinerary} />
        <InclusionsExclusions inclusions={pkg.inclusions} exclusions={pkg.exclusions} />

        {/* Related packages */}
        {related.length > 0 && <PackageGrid packages={related} heading="Related journeys" />}
      </Container>
    </PageShell>
  );
}
