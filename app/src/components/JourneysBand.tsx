import Image from "next/image";
import Link from "next/link";

/** Full-bleed journeys band — a single wide image carrying the tailor-made proposition. */
export default function JourneysBand() {
  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-charcoal md:min-h-[640px]">
      <Image
        src="/images/destinations/indian-rhino-forest.jpg"
        alt="Indian rhinoceros grazing in a lush forest landscape"
        fill
        sizes="100vw"
        className="object-cover object-[center_65%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="subtitle-large mb-5 text-brass">Our custom-designed journeys</p>
          <h2 className="text-h2 mb-6 text-white">Tailor-made itineraries for every traveller</h2>
          <p className="mb-10 font-display text-lg leading-relaxed text-white/85">
            Unique scenery, wildlife and cultures are waiting to be discovered. Every journey here
            can be tailor-made to suit your dates, your party and your interests.
          </p>
          <Link href="/explore" className="btn-primary">
            Explore our journeys <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
