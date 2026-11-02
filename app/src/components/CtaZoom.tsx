import Image from "next/image";
import Link from "next/link";

/** Full-height closing call to action over a landscape photograph, with a watermark monogram. */
export default function CtaZoom() {
  return (
    <section className="relative isolate flex min-h-[380px] items-center justify-center overflow-hidden bg-charcoal md:min-h-[440px]">
      <Image
        src="/images/destinations/kashmir-shikara.jpg"
        alt="A shikara boat carrying flowers across Dal Lake in Kashmir"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span className="watermark-outline select-none font-serif text-[28vw] font-bold leading-none tracking-[0.1em]">
          IN
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 text-center md:px-8 md:py-16">
        <p className="subtitle-large mb-4 text-brass-soft font-accent">Plan Your Expedition</p>
        <h2 className="text-h2 mb-5 text-white font-serif font-light">Enquire About a Tailor-Made Journey</h2>
        <p className="font-serif italic font-light text-xl md:text-2xl text-white/95 mb-3 leading-relaxed">
          &ldquo;Tell us your travel season, group size and preferred regions &mdash; we will curate your bespoke itinerary.&rdquo;
        </p>
        <p className="mb-6 font-sans font-light text-xs sm:text-sm leading-relaxed text-white/70">
          Direct regional arrangements across India and Nepal since 1927.
        </p>
        <Link href="/enquiry" className="btn-ghost-dark">
          Enquire now <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
