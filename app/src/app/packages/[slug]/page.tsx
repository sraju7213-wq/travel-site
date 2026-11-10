import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import EnquireCta from "@/components/package/EnquireCta";
import EnquiryModalProvider from "@/components/package/EnquiryModal";
import PackageSidebar from "@/components/package/PackageSidebar";
import PackageWorkspace from "@/components/package/PackageWorkspace";
import PageShell from "@/components/PageShell";
import { BRAND } from "@/data/brandConfig";
import { getAllPackages, getPackageBySlug, getPackageGallery } from "@/data/catalogue";

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export const instant = false;

export async function generateStaticParams() {
  return getAllPackages().map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({ params }: PackagePageProps) {
  const { slug } = await params;
  const pkg = getPackageBySlug(slug);
  if (!pkg) {
    return { title: `Journey not found — ${BRAND.name}` };
  }
  return {
    title: `${pkg.title} — ${BRAND.name}`,
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

  const gallery = getPackageGallery(pkg);
  const destinations = pkg.region.filter((r) => r !== "India" && r !== "Nepal");

  return (
    <EnquiryModalProvider
      packageInfo={{
        slug: pkg.slug,
        title: pkg.title,
        code: pkg.brochure_code,
        duration: pkg.duration,
      }}
    >
      <PageShell>
        {/* Compact hero banner */}
        <section className="relative border-b border-white/10 bg-gradient-to-b from-[#132325] to-[#0C1617] pt-6 pb-7">
          <Container wide>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
              <nav aria-label="Breadcrumb" className="flex items-center gap-2">
                <Link href="/" className="transition-colors hover:text-brass">
                  Home
                </Link>
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
                <Link
                  href={`/explore/${encodeURIComponent(pkg.category)}`}
                  className="text-brass-soft transition-colors hover:text-brass"
                >
                  {pkg.category}
                </Link>
                <span aria-hidden="true" className="text-white/25">
                  /
                </span>
                <span className="font-medium text-white/90">{pkg.title}</span>
              </nav>

              <div className="flex items-center gap-3">
                <span className="rounded-full border border-brass/30 bg-brass/10 px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-brass">
                  Brochure Code: {pkg.brochure_code}
                </span>
                <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] text-white/70">
                  Small Group (Max 15) or Solo
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-brass">
                  {pkg.category} · {pkg.difficulty ?? "Curated Expedition"}
                </p>
                <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  {pkg.title}
                </h1>
                <p className="mt-2 max-w-3xl font-display text-sm leading-relaxed text-white/60 sm:text-base">
                  {pkg.summary}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <div className="rounded-lg border border-white/10 bg-[#132325] px-4 py-2.5 text-center">
                  <div className="font-display text-[10px] uppercase tracking-wider text-white/45">
                    Duration
                  </div>
                  <div className="font-display text-sm font-semibold text-white">{pkg.duration}</div>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#132325] px-4 py-2.5 text-center">
                  <div className="font-display text-[10px] uppercase tracking-wider text-white/45">
                    Route
                  </div>
                  <div className="font-display text-sm font-semibold text-white">
                    {destinations.length} Destination{destinations.length === 1 ? "" : "s"}
                  </div>
                </div>
                <EnquireCta label="Enquire Now" withArrow />
              </div>
            </div>
          </Container>
        </section>

        {/* Interactive workspace + sticky sidebar */}
        <Container wide className="py-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <section className="lg:col-span-8">
              <PackageWorkspace pkg={pkg} gallery={gallery} />
            </section>

            <aside className="lg:sticky lg:top-24 lg:col-span-4">
              <PackageSidebar pkg={pkg} related={related} />
            </aside>
          </div>
        </Container>
      </PageShell>
    </EnquiryModalProvider>
  );
}
