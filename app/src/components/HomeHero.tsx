import Image from "next/image";
import Link from "next/link";

/**
 * Full-bleed hero — the reference site's signature: a wide landscape photograph, a radial
 * vignette, a wide-tracked display title and a circular affordance.
 */
export default function HomeHero() {
  return (
    <section
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-wild-black"
      aria-label="India and Nepal — specialist travel since 1927"
    >
      <Image
        src="/images/hero/hero-pangong.jpg"
        alt="Snow-capped Himalayan ranges above a high-altitude lake"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.55)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/50"
      />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <p className="mb-6 text-[0.7rem] font-display uppercase tracking-[0.35em] text-white/70">
          27.7172&deg; N, 85.3240&deg; E
        </p>
        <p className="subtitle-large mb-4 text-white/70">Welcome to</p>
        <h1 className="hero-title mb-7 text-white">India &amp; Nepal</h1>
        <p className="mb-10 max-w-2xl text-base font-display leading-relaxed text-white/90 md:text-lg">
          Since 1927 we have arranged travel across India and Nepal for travellers, families and
          groups — tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries
          and Kashmir houseboats.
        </p>
        <Link
          href="#discover"
          className="group flex h-[106px] w-[106px] flex-col items-center justify-center rounded-full border-2 border-white/50 text-white transition-colors hover:border-wild-orange hover:bg-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <span className="text-[0.6rem] font-display uppercase tracking-[0.2em]">Discover</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mt-1 h-5 w-5 fill-none stroke-current stroke-[1.8]"
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
