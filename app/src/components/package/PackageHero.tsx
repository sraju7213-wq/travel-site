"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import EnquireCta from "@/components/package/EnquireCta";
import { getPackageCardImage } from "@/data/catalogue";
import type { PackageViewModel } from "@/types/travel";

interface PackageHeroProps {
  pkg: PackageViewModel;
}

/**
 * PackageHero
 * -----------
 * The cinematic hero for a single journey.
 *
 * The entrance is CSS-driven (`.pkg-hero-*` in globals.css) rather than a
 * React state flip, because a state flip means the whole hero — headline,
 * breadcrumb and CTA — stays at `opacity: 0` until JavaScript has run. On a
 * throttled phone or a background tab that can be a full second of blank
 * hero. CSS animations are driven by the browser itself and degrade to
 * "visible" when motion is reduced.
 */
export default function PackageHero({ pkg }: PackageHeroProps) {
  const destinations = pkg.region.filter((r) => r !== "India" && r !== "Nepal");

  // Use the shared per-package image mapping for the hero photograph.
  const heroSrc = getPackageCardImage(pkg.slug);

  return (
    <section
      data-theme-surface="dark"
      className="relative overflow-hidden border-b border-white/10 bg-forest pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-12 lg:pb-16"
    >
      {/* Background Photography with cinematic Ken Burns settle */}
      <div className="pkg-hero-photo absolute inset-0 pointer-events-none will-change-transform">
        <Image
          src={heroSrc}
          alt={pkg.title}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Layered cinematic atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1617] via-[#0C1617]/80 to-[#0C1617]/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1617]/90 via-[#0C1617]/30 to-[#0C1617]/90" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(177, 138, 81, 0.28), transparent 70%)",
          }}
        />
      </div>

      <Container wide className="relative z-10">
        {/* Top row: Breadcrumb + Code badge */}
        <div className="pkg-hero-rise pkg-hero-d1 mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] text-white/60 sm:text-xs">
            <Link href="/" className="inline-flex min-h-[36px] items-center transition-colors hover:text-brass">
              Home
            </Link>
            <span aria-hidden="true" className="text-white/25">/</span>
            <Link
              href="/journeys#catalogue"
              className="inline-flex min-h-[36px] items-center text-brass-soft transition-colors hover:text-brass"
            >
              Journeys
            </Link>
            <span aria-hidden="true" className="text-white/25">/</span>
            <Link
              href={`/journeys?category=${encodeURIComponent(pkg.category)}#catalogue`}
              className="hidden min-h-[36px] items-center text-brass-soft transition-colors hover:text-brass sm:inline-flex"
            >
              {pkg.category}
            </Link>
            <span aria-hidden="true" className="hidden text-white/25 sm:inline">/</span>
            <span className="inline-flex min-h-[36px] max-w-[140px] items-center truncate font-medium text-white/90 sm:max-w-none">
              {pkg.title}
            </span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-brass shadow-[0_0_12px_rgba(177,138,81,0.2)] sm:px-3 sm:text-[11px]">
            <span className="h-1 w-1 rounded-full bg-brass animate-pulse" />
            {pkg.brochure_code}
          </span>
        </div>

        {/* Hero Title & Information */}
        <div className="flex flex-col gap-5 sm:gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="pkg-hero-rise pkg-hero-d2 mb-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-brass sm:text-xs sm:tracking-[0.25em]">
              {pkg.category} · {pkg.difficulty ?? "Curated Expedition"}
            </p>

            <h1 className="pkg-hero-rise pkg-hero-d3 font-serif text-2xl font-light leading-tight tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-4xl lg:text-5xl">
              {pkg.title}
            </h1>

            <p className="pkg-hero-rise pkg-hero-d4 mt-2.5 font-display text-[13px] leading-relaxed text-white/80 sm:mt-3 sm:text-sm lg:text-base">
              {pkg.summary}
            </p>
          </div>

          {/* Bottom row: Metrics + CTA — full-width on mobile, inline on desktop */}
          <div className="pkg-hero-rise pkg-hero-d5 flex shrink-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
            {/* Duration + Route as compact pills on mobile, boxed on desktop */}
            <div className="flex gap-2.5 sm:contents">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 backdrop-blur-md sm:flex-none sm:flex-col sm:gap-0 sm:rounded-xl sm:px-5 sm:py-3 sm:text-center">
                <span className="font-display text-[9px] font-medium uppercase tracking-wider text-white/50 sm:text-[10px]">
                  Duration
                </span>
                <span className="font-display text-xs font-semibold text-white sm:mt-0.5 sm:text-sm">
                  {pkg.duration}
                </span>
              </div>

              <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/15 bg-black/40 px-3 py-2 backdrop-blur-md sm:flex-none sm:flex-col sm:gap-0 sm:rounded-xl sm:px-5 sm:py-3 sm:text-center">
                <span className="font-display text-[9px] font-medium uppercase tracking-wider text-white/50 sm:text-[10px]">
                  Route
                </span>
                <span className="font-display text-xs font-semibold text-white sm:mt-0.5 sm:text-sm">
                  {destinations.length} Destination{destinations.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            <EnquireCta label="Enquire Now" withArrow className="w-full sm:w-auto" />
          </div>
        </div>
      </Container>
    </section>
  );
}
