import Image from "next/image";
import Link from "next/link";

/** Full-bleed journeys band — a single wide image carrying the tailor-made proposition. */
export default function JourneysBand() {
  return (
    <section className="relative isolate flex min-h-[380px] items-center overflow-hidden bg-charcoal md:min-h-[440px]">
      <Image
        src="/images/destinations/indian-rhino-forest.jpg"
        alt="Indian rhinoceros grazing in a lush forest landscape"
        fill
        sizes="100vw"
        className="object-cover object-[center_65%]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4 py-12 md:px-8 md:py-16">
        <div className="max-w-2xl">
          <p className="subtitle-large mb-4 text-brass font-accent">Private &amp; Custom Expeditions</p>
          <h2 className="text-h2 mb-5 text-white font-serif font-light">Tailor-Made Itineraries For Every Traveller</h2>
          <p className="font-serif italic font-light text-xl md:text-2xl text-brass-soft/90 mb-4 leading-relaxed">
            &ldquo;Untamed scenery, ancient cultures and private wildlife explorations waiting to be uncovered.&rdquo;
          </p>
          <p className="mb-6 font-sans font-light text-xs sm:text-sm leading-relaxed text-white/80">
            Every journey can be custom-tailored to suit your dates, private party and personal pace across the subcontinent.
          </p>
          <Link href="/explore" className="btn-ghost-dark">
            Explore our journeys <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
