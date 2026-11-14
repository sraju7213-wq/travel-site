import { notFound } from "next/navigation";
import Container from "@/components/Container";
import EnquiryModalProvider from "@/components/package/EnquiryModal";
import PackageHero from "@/components/package/PackageHero";
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
        {/* Animated Cinematic Hero with Ken Burns photography & staggered metadata */}
        <PackageHero pkg={pkg} />

        {/* Interactive workspace + sticky sidebar with smooth entrance */}
        <Container wide className="py-8 animate-fade-in-up stagger-5">
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
