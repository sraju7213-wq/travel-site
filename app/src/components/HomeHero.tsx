"use client";

import Link from "next/link";
import HeroVideoShuffler from "@/components/HeroVideoShuffler";

export default function HomeHero() {
  return (
    <section
      className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-charcoal"
      aria-label="India and Nepal — specialist travel since 1927"
    >
      {/* 5-Second Seamless Non-Repeating Shuffled Video Experience with Right-Side Place Details */}
      <HeroVideoShuffler />

      {/* Centered Composition: Title placed lower, sitting directly above the Discover Button */}
      <div className="relative z-20 w-full flex flex-col items-center justify-center text-center px-4 max-w-7xl mx-auto pt-14 pb-8">
        {/* Main Title with 'Welcome to' */}
        <div className="mb-7 sm:mb-9 text-center">
          <span className="font-serif italic font-light text-lg sm:text-2xl md:text-3xl text-brass-soft tracking-wide mb-1.5 block drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            Welcome to
          </span>
          <h1 className="hero-title text-white font-serif font-light drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            India &amp; Nepal
          </h1>
        </div>

        {/* Horizontal Line with Centered Discover Button directly beneath title */}
        <div className="w-full flex items-center justify-center px-2 sm:px-8 md:px-16">
          {/* Left Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-white/40" />

          {/* Centered Discover Button */}
          <Link
            href="#discover"
            aria-label="Discover more"
            className="group mx-3 sm:mx-6 flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 flex-col items-center justify-center rounded-full border border-white/60 bg-black/60 backdrop-blur-md text-white transition-all duration-300 hover:scale-110 hover:border-brass hover:bg-black/80 hover:shadow-[0_0_35px_rgba(255,110,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.6)]"
          >
            <span className="font-accent text-[0.65rem] sm:text-[0.7rem] font-semibold uppercase leading-none tracking-[0.26em] text-white/90 transition-colors group-hover:text-brass">
              Discover
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-1.5 h-4 w-4 fill-brass text-brass transition-transform duration-300 group-hover:translate-y-1"
            >
              <path d="M12 16l-5-6h10z" />
            </svg>
          </Link>

          {/* Right Line */}
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/20 to-white/40" />
        </div>
      </div>
    </section>
  );
}
