import Image from "next/image";
import Link from "next/link";

/** Two-image editorial block on the deep teal panel, mirroring the reference's impact module. */
export default function ImpactSection() {
  return (
    <section className="section-dark py-20 md:py-28" id="impact">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[3/4] overflow-hidden rounded-image bg-wild-darker">
              <Image
                src="/images/destinations/nepal-trek.jpg"
                alt="Trekkers crossing a high Himalayan snowfield"
                fill
                sizes="(min-width: 1024px) 22vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-8 aspect-[3/4] overflow-hidden rounded-image bg-wild-darker">
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
            <p className="subtitle-large mb-5 text-wild-orange">Our travel ethos</p>
            <h2 className="text-h2 mb-6 text-wild-white">
              Our journeys change lives — not only yours
            </h2>
            <p className="mb-5 font-display text-lg leading-relaxed text-white/80">
              The value of your journey stays inside the places you visit. We hire locally, run
              escorted student tours, and arrange special-interest programmes with schools and
              community groups across India and Nepal.
            </p>
            <p className="mb-8 font-display text-lg leading-relaxed text-white/80">
              Every itinerary is drawn from our brochure catalogue and shaped around your dates,
              party size and interests — and every booking is confirmed with you directly before
              anything is committed.
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
