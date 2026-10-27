import Link from "next/link";
import Image from "next/image";
import { getAllPackages, getPackageBySlug } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import PackageGrid from "@/components/PackageGrid";
import ItineraryTimeline from "@/components/ItineraryTimeline";
import InclusionsExclusions from "@/components/InclusionsExclusions";
import { notFound } from "next/navigation";
interface PackagePageProps {
  params: { slug: string };
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
    .filter(
      (p) =>
        p.id !== pkg.id &&
        (p.category === pkg.category || p.region.some((r) => pkg.region.includes(r))),
    )
    .slice(0, 3);

  return (
    <PageShell>
      {/* Breadcrumbs */}
      <div className="border-b border-border">
        <Container>
          <nav
            className="py-4 text-xs font-display font-medium uppercase tracking-wider text-wild-sand"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap gap-2 list-none">
              <li>
                <Link href="/" className="transition-colors hover:text-wild-orange">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">&rsaquo;</li>
              <li>
                <Link
                  href={`/explore/${encodeURIComponent(pkg.category)}`}
                  className="transition-colors hover:text-wild-orange"
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
      <section className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-wild-dark text-wild-white md:min-h-[620px]">
        <Image
          src={`/images/packages/${pkg.slug}.jpg`}
          alt={pkg.title}
          fill
          sizes="100vw"
          className="object-cover"
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
              <span className="mb-4 inline-block font-display text-sm font-semibold uppercase tracking-wider text-wild-orange">
                {pkg.category}
              </span>
              <h1 className="text-h2 mb-6 uppercase text-wild-white">{pkg.title}</h1>
              <p className="mb-8 max-w-xl font-display text-lg leading-relaxed text-white/85">
                {pkg.summary}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center rounded-button border border-white/30 px-3 py-1.5 font-display text-xs font-medium uppercase text-white/90">
                  {pkg.duration}
                </span>
                <span className="inline-flex items-center rounded-button border border-white/30 px-3 py-1.5 font-display text-xs font-medium uppercase text-white/90">
                  {pkg.brochure_code}
                </span>
                <Link href={"/enquiry?package=" + pkg.slug} className="btn-primary">
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
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-h3 mb-6 text-charcoal">Overview</h2>
              <p className="mb-8 font-display text-lg leading-relaxed text-charcoal-soft">
                {pkg.summary}
              </p>
              {pkg.highlights.length > 0 && (
                <div className="mb-12">
                  <h3 className="mb-4 font-serif text-xl font-bold text-charcoal">
                    Journey highlights
                  </h3>
                  <ul className="list-disc space-y-3 pl-6 font-display leading-relaxed text-charcoal-soft">
                    {pkg.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-image bg-wild-dark p-6">
                <h3 className="mb-4 font-serif text-xl font-bold text-wild-white">
                  Journey at a glance
                </h3>
                <dl className="space-y-4 font-display text-sm text-white/80">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <dt>Category</dt>
                    <dd>{pkg.category}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <dt>Duration</dt>
                    <dd>{pkg.duration}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Regions</dt>
                    <dd className="text-right">{pkg.region.join(", ")}</dd>
                  </div>
                </dl>
                <Link
                  href={"/enquiry?package=" + pkg.slug}
                  className="btn-tertiary mt-8 flex w-full items-center justify-center gap-1"
                >
                  Enquire about this journey <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Day-by-day itinerary */}
        <ItineraryTimeline itinerary={pkg.itinerary} />

        {/* Inclusions / exclusions */}
        <InclusionsExclusions inclusions={pkg.inclusions} exclusions={pkg.exclusions} />

        {/* Related packages */}
        {related.length > 0 && <PackageGrid packages={related} heading="Related journeys" />}
      </Container>
    </PageShell>
  );
}
