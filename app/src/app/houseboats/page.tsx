import Link from "next/link";
import Image from "next/image";
import { getServiceBySlug } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { notFound } from "next/navigation";

interface HouseboatPageProps {
  params: Promise<Record<string, never>>;
}

export async function generateMetadata({ params }: HouseboatPageProps) {
  await params;
  const svc = getServiceBySlug("kashmir-houseboat-booking");
  if (!svc) {
    return { title: "Service not found — India Nepal Travel Organisation" };
  }
  return {
    title: `${svc.title} — India Nepal Travel Organisation`,
    description: svc.summary,
  };
}

export default async function HouseboatsPage({ params }: HouseboatPageProps) {
  await params;
  const svc = getServiceBySlug("kashmir-houseboat-booking");
  if (!svc) {
    notFound();
  }

  return (
    <PageShell>
      <Container>
        <nav className="px-4 mb-6 text-xs font-display font-medium uppercase tracking-wider text-wild-sand" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-2 list-none">
            <li>
              <Link href="/" className="nav-link hover:text-wild-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-charcoal">{svc.title}</li>
          </ol>
        </nav>

        <section className="px-4 py-16 md:px-8 lg:px-12">
          <div className="relative aspect-[16/9] overflow-hidden rounded-image border border-wild-border-light bg-wild-dark">
            <Image
              src="/images/destinations/kashmir-shikara.jpg"
              alt="A shikara boat carrying flowers across Dal Lake in Kashmir"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-6 uppercase">
                {svc.title}
              </h1>
              <p className="text-lg font-display text-charcoal leading-relaxed mb-8">
                {svc.summary}
              </p>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4">
                Options described
              </h2>
              <ul className="list-disc pl-6 space-y-3 text-charcoal-soft leading-relaxed font-display mb-10">
                {svc.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              <Link
                href="/enquiry"
                className="btn-tertiary"
              >
                Enquire about houseboats <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="rounded-image border border-wild-border-light bg-wild-dark p-8">
              <h2 className="text-xl font-serif font-bold text-wild-white mb-4">
                Booking notes
              </h2>
              <p className="text-sm font-display text-white/70 leading-relaxed">
                Houseboat inventory, classification, prices, terms, cancellation policy, contact
                details and current availability must be confirmed with the operator before
                booking. Enquire for current options.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
