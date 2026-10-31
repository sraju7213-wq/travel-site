"use client";

import Image from "next/image";
import Link from "next/link";

interface HomeHeroProps {
  onOpenTheater?: () => void;
}

const CLOUDFLARE_STREAM_ID = "eed4e42ee04b928636db671c94812677";
const CUSTOMER_SUBDOMAIN = "customer-27c2ml6fadzjjsib.cloudflarestream.com";

export default function HomeHero({ onOpenTheater }: HomeHeroProps) {
  const bgEmbedUrl = `https://${CUSTOMER_SUBDOMAIN}/${CLOUDFLARE_STREAM_ID}/iframe?autoplay=true&loop=true&muted=true&controls=false&preload=auto`;

  return (
    <section
      className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-hidden bg-charcoal"
      aria-label="India and Nepal — specialist travel since 1927"
    >
      {/* Underlying Instant Poster Layer */}
      <Image
        src="/images/hero/hero-pangong.jpg"
        alt="Snow-capped Himalayan ranges above a high-altitude lake"
        fill
        priority
        sizes="100vw"
        className="object-cover filter brightness-[0.75]"
      />

      {/* Cloudflare Stream Smart Embed Ambient Video Layer (Zero Downloads) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <iframe
          src={bgEmbedUrl}
          title="Hero Ambient Video Stream"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          className="absolute left-1/2 top-1/2 min-h-full min-w-full w-[177.77vh] h-[56.25vw] -translate-x-1/2 -translate-y-1/2 border-0 filter brightness-[0.7] contrast-[1.08] transition-opacity duration-1000"
        />
      </div>

      {/* Radial and Linear Filmic Gradients */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40"
      />

      <div className="relative z-20 mx-auto flex max-w-5xl flex-col items-center px-4 pt-16 text-center">
        {/* Wilderness-style Live Coordinate Beacon */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-brass opacity-60 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-brass" />
          </span>
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-white/90">
            27.7172&deg; N, 85.3240&deg; E &bull; THE EXPEDITION IN MOTION
          </p>
        </div>

        <p className="subtitle-large mb-4 text-white/80">Specialist travel since 1927</p>
        <h1 className="hero-title mb-7 text-white">India &amp; Nepal</h1>
        <p className="mb-10 max-w-2xl font-display text-base leading-relaxed text-white/90 md:text-lg">
          Tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and
          Kashmir houseboats &mdash; arranged by a specialist operator for India and Nepal.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/explore" className="btn-primary">
            Explore journeys <span aria-hidden="true">&rarr;</span>
          </Link>
          <Link href="/enquiry" className="btn-ghost-dark">
            Plan your trip <span aria-hidden="true">&rarr;</span>
          </Link>
          {onOpenTheater && (
            <button
              type="button"
              onClick={onOpenTheater}
              aria-label="Watch expedition film in 1080p cinema theater"
              className="group inline-flex items-center justify-center gap-2 rounded-button border border-white/30 bg-black/40 px-6 py-3 font-display text-sm font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white active:scale-95 cursor-pointer shadow-lg"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current text-brass transition-colors group-hover:text-white"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>Watch Film (1080p)</span>
            </button>
          )}
        </div>

        <Link
          href="#discover"
          aria-label="Discover more"
          className="group mt-10 flex h-20 w-20 flex-col items-center justify-center rounded-full border border-white/40 bg-black/20 backdrop-blur-sm text-white transition-all duration-300 hover:scale-105 hover:border-brass hover:bg-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer"
        >
          <span className="font-display text-[0.625rem] font-medium uppercase leading-none tracking-[0.16em]">
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
