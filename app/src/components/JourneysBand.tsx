import Image from "next/image";
import Link from "next/link";

/** Full-bleed journeys band — a single wide image carrying the tailor-made proposition. */
export default function JourneysBand() {
  return (
    <section className="relative isolate flex min-h-[520px] items-center overflow-hidden bg-wild-black md:min-h-[640px]">
      <Image
        src="/images/destinations/himalaya-horses.jpg"
        alt="Horses grazing in a Himalayan mountain valley"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-20 md:px-8 md:py-28">
        <div className="max-w-2xl">
          <p className="subtitle-large mb-5 text-wild-orange">Our custom-designed journeys</p>
          <h2 className="text-h2 mb-6 text-white">Tailor-made itineraries for every traveller</h2>
          <p className="mb-10 font-display text-lg leading-relaxed text-white/85">
            Unique scenery, wildlife and cultures are waiting to be discovered. Every journey here is
            intended to inspire, and can be tailor-made to suit your dates, your party and your
            interests. It is time to let your travel dreams run wild.
          </p>
          <Link href="/explore" className="btn-primary">
            Explore our journeys <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
