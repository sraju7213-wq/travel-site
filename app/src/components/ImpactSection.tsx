import Image from "next/image";
import Link from "next/link";

/** Editorial block on the deep forest panel. */
export default function ImpactSection() {
  return (
    <section className="section-dark py-12 md:py-16" id="impact">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] max-h-[320px] overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/destinations/nepal-trek.jpg"
                alt="Trekkers crossing a high Himalayan snowfield"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-4 aspect-[4/5] max-h-[320px] overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/destinations/nepal-collage.jpg"
                alt="A montage of Nepalese temples, prayer flags and mountain landscapes"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>

          <div>
            <p className="subtitle-large mb-4 text-brass font-accent">Curated Regional Programmes</p>
            <h2 className="text-h2 mb-5 text-white font-serif font-light">
              Special-Interest &amp; Student Expeditions
            </h2>
            <p className="font-serif italic font-light text-xl md:text-2xl leading-relaxed text-brass-soft/90 mb-4">
              &ldquo;Escorted specialist journeys for clubs, botanical groups, yoga retreats, and academic institutions across India and Nepal.&rdquo;
            </p>
            <p className="mb-8 font-sans font-light text-base leading-relaxed text-white/75">
              All special-interest programmes are escorted by qualified team leaders. Every itinerary is drawn directly from our brochure archives and shaped with meticulous care around your travel season, party size and regional interests.
            </p>
            <Link href="/about" className="btn-ghost-dark">
              Read about us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

