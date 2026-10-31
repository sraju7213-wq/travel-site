import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
  return (
    <section
      className="relative flex h-screen min-h-[640px] w-full items-center justify-center overflow-hidden bg-charcoal"
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
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.45)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
      />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <p className="mb-6 text-[0.7rem] font-display uppercase tracking-[0.35em] text-white/70">
          27.7172&deg; N, 85.3240&deg; E
        </p>
        <p className="subtitle-large mb-4 text-white/70">Specialist travel since 1927</p>
        <h1 className="hero-title mb-7 text-white">India &amp; Nepal</h1>
        <p className="mb-10 max-w-2xl text-base font-display leading-relaxed text-white/90 md:text-lg">
          Tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and
          Kashmir houseboats — arranged by a specialist operator for India and Nepal.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/explore" className="btn-primary">
            Explore journeys <span aria-hidden="true">→</span>
          </Link>
          <Link href="/enquiry" className="btn-ghost-dark">
            Plan your trip <span aria-hidden="true">→</span>
          </Link>
        </div>
        <Link
          href="#discover"
          aria-label="Discover more"
          className="mt-10 group flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-sm text-white transition-all duration-300 hover:border-brass hover:bg-brass hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer"
        >
          <span className="text-[0.625rem] font-display font-medium uppercase tracking-[0.16em] leading-none">
            Discover
          </span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="mt-1.5 h-3.5 w-3.5 fill-none stroke-current stroke-[2] transition-transform duration-300 group-hover:translate-y-1"
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
