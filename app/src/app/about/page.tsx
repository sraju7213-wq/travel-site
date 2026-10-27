import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";

export const metadata = {
  title: "About — India Nepal Travel Organisation",
  description:
    "About India Nepal Travel Organisation: specialist travel across India and Nepal, tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <Container>
        <section className="section-dark py-16 md:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="subtitle-large mb-5 text-wild-orange">Since 1927</p>
              <h1 className="text-h2 mb-6 text-wild-white">About us</h1>
              <p className="mb-5 font-display text-lg leading-relaxed text-white/80">
                India Nepal Travel Organisation arranges specialist travel across India and Nepal.
                Our programme includes tailor-made tours, small-group journeys, Himalayan trekking,
                cultural itineraries and Kashmir houseboats, drawn from our brochure catalogue.
              </p>
              <p className="mb-8 font-display text-lg leading-relaxed text-white/80">
                Every journey listed on this site is taken from our brochure. Prices, availability and
                booking terms are not published here — this is an enquiry-led site. Select a journey
                and we will respond with a personalised quote.
              </p>
              <Link href="/enquiry" className="btn-primary">
                Plan your trip <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-image border border-white/10">
              <Image
                src="/images/destinations/kashmir-shikara.jpg"
                alt="A shikara boat carrying flowers across Dal Lake in Kashmir"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                priority
              />
              <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        </section>

        {/* Founders */}
        <section className="bg-wild-white py-16 text-charcoal md:py-24">
          <div className="mx-auto max-w-[1400px]">
            <p className="subtitle-large mb-5 text-wild-orange">Founders and visionaries</p>
            <h2 className="text-h3 mb-10 max-w-2xl">
              A family business that put Kashmir on the tourism map
            </h2>

            <div className="grid gap-8 md:grid-cols-2">
              <article className="grid gap-6 rounded-[1rem] border border-border p-6 md:grid-cols-[160px_1fr] md:p-8">
                <div className="relative aspect-square overflow-hidden rounded-image bg-wild-cream">
                  <Image
                    src="/images/destinations/sultan-baktoo.jpg"
                    alt="Sultan Baktoo, founder of the organisation"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-wild-dark">Sultan Baktoo</h3>
                  <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                    The visionary who pioneered tour and travel in Kashmir, and the architect whose
                    work laid the foundation for the tours that followed.
                  </p>
                </div>
              </article>

              <article className="grid gap-6 rounded-[1rem] border border-border p-6 md:grid-cols-[160px_1fr] md:p-8">
                <div className="relative aspect-square overflow-hidden rounded-image bg-wild-cream">
                  <Image
                    src="/images/destinations/farook-baktoo.jpg"
                    alt="Farook Baktoo, who leads tours and treks in the Himalaya"
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="mb-2 font-serif text-xl font-bold text-wild-dark">Farook Baktoo</h3>
                  <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                    Two decades planning and promoting tourism to the sub-continent, and from a
                    pioneering Himalayan trekking family — leading tours across the Himalaya,
                    Karakoram, Zanskar and Ladakh.
                  </p>
                </div>
              </article>
            </div>

            <div className="mt-12 rounded-image border border-border bg-wild-cream p-6">
              <h2 className="mb-3 text-sm font-display font-semibold uppercase tracking-wider text-wild-orange">
                Important
              </h2>
              <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                Company history, team details and operating claims are sourced from our brochure and
                must be verified with the organisation before publication. We do not publish invented
                statistics, awards, testimonials or contact details.
              </p>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
