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
        <nav
          className="mb-6 text-xs font-display font-medium uppercase tracking-wider text-charcoal-soft"
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap gap-2 list-none">
            <li>
              <Link href="/" className="transition-colors hover:text-brass">
                Home
              </Link>
            </li>
            <li aria-hidden="true">&rsaquo;</li>
            <li className="text-charcoal">{svc.title}</li>
          </ol>
        </nav>

        <section className="py-10 md:py-14">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] border border-border shadow-2xl bg-forest">
            <Image
              src="/images/services/kashmir-houseboat.jpg"
              alt="Luxurious traditional Kashmir houseboat on Dal Lake against the Himalayan mountains"
              fill
              sizes="(min-width: 1280px) 1280px, 100vw"
              className="object-cover object-center"
              priority
            />
            <div aria-hidden="true" className="absolute inset-0 bg-black/25" />
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-2">
            <div>
              <p className="subtitle-large mb-4 text-brass">Booking service</p>
              <h1 className="text-h3 mb-6 uppercase text-charcoal">{svc.title}</h1>
              <p className="mb-10 font-display text-lg leading-relaxed text-charcoal-soft">
                {svc.summary}
              </p>

              <h2 className="text-h4 mb-5 font-serif font-bold text-charcoal">
                What the brochure describes
              </h2>
              <ul className="mb-10 space-y-3 font-display leading-relaxed text-charcoal-soft">
                {svc.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/enquiry" className="btn-primary">
                Enquire about houseboats <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1rem] border border-border bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="mb-4 font-serif text-xl font-bold text-charcoal">
                  Confirm before you book
                </h2>
                <p className="font-display leading-relaxed text-charcoal-soft">
                  Houseboat inventory, classification, prices, terms, cancellation policy, contact
                  details and current availability must be confirmed with the operator before
                  booking. Enquire for current options.
                </p>
                <p className="mt-4 font-display leading-relaxed text-charcoal-soft">
                  This page describes the booking service only. It is not a numbered tour package.
                </p>
              </div>

              <div className="rounded-[1rem] border border-white/10 bg-forest p-8 shadow-xl">
                <h2 className="mb-4 font-serif text-xl font-bold text-white">
                  Alongside the houseboats
                </h2>
                <p className="font-display leading-relaxed text-white/80">
                  The brochure also describes wood carving, carpet making and papier-mâché making,
                  and trips to the mountain resorts of Gulmarg and Pahalgam. These are arranged
                  separately from the houseboat stay — mention them in your enquiry.
                </p>
                <Link href="/explore" className="btn-tertiary mt-6">
                  Browse related journeys <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
