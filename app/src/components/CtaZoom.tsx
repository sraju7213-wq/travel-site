import Image from "next/image";
import Link from "next/link";

/** Full-height closing call to action over a landscape photograph, with a watermark monogram. */
export default function CtaZoom() {
  return (
    <section className="relative isolate flex min-h-[560px] items-center justify-center overflow-hidden bg-charcoal md:min-h-[720px]">
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

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-24 text-center md:px-8">
        <p className="subtitle-large mb-5 text-white/70">Plan your trip</p>
        <h2 className="text-h2 mb-6 text-white">Enquire about a journey</h2>
        <p className="mb-10 font-display text-lg leading-relaxed text-white/85">
          Tell us your dates, party size and interests and we will shape an itinerary around you
          from our brochure catalogue.
        </p>
        <Link href="/enquiry" className="btn-primary">
          Enquire now <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
