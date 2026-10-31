import Image from "next/image";
import Link from "next/link";

/** Editorial block on the deep forest panel. */
export default function ImpactSection() {
  return (
    <section className="section-dark py-20 md:py-28" id="impact">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/images/destinations/nepal-trek.jpg"
                alt="Trekkers crossing a high Himalayan snowfield"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
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
            <p className="subtitle-large mb-5 text-brass">Our programmes</p>
            <h2 className="text-h2 mb-6 text-white">
              Special-interest and student programmes
            </h2>
            <p className="mb-5 font-display text-lg leading-relaxed text-white/80">
              We arrange special-interest tours for clubs, schools, social and special-interest groups
              (Ayurveda, gardening, golf, business, textiles, fashion, yoga), and run escorted student
              tours for schools in both India and Nepal.
            </p>
            <p className="mb-8 font-display text-lg leading-relaxed text-white/80">
              All special-interest tours are escorted by a team leader from Australia who specialises
              in a particular area. Every itinerary is drawn from our brochure catalogue and shaped
              around your dates, party size and interests.
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

