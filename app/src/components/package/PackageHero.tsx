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

  // Use the shared per-package Pexels image mapping for destination-accurate hero photography.
  const heroSrc = getPackageCardImage(pkg.slug);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0C1617] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
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
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C1617] via-[#0C1617]/75 to-[#0C1617]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C1617]/85 via-transparent to-[#0C1617]/85" />
        <div
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 20%, rgba(177, 138, 81, 0.28), transparent 70%)",
          }}
        />
      </div>

      <Container wide className="relative z-10">
        {/* Top Breadcrumb & Metadata row */}
        <div className="pkg-hero-rise pkg-hero-d1 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link href="/" className="inline-flex min-h-[44px] items-center transition-colors hover:text-brass">
              Home
            </Link>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <Link
              href="/journeys#catalogue"
              className="inline-flex min-h-[44px] items-center text-brass-soft transition-colors hover:text-brass"
            >
              Journeys
            </Link>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <Link
              href={`/journeys?category=${encodeURIComponent(pkg.category)}#catalogue`}
              className="inline-flex min-h-[44px] items-center text-brass-soft transition-colors hover:text-brass"
            >
              {pkg.category}
            </Link>
            <span aria-hidden="true" className="text-white/30">
              /
            </span>
            <span className="inline-flex min-h-[44px] items-center font-medium text-white/90">
              <span className="truncate max-w-[160px] sm:max-w-none">{pkg.title}</span>
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wide text-brass shadow-[0_0_12px_rgba(177,138,81,0.2)]">
              <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse" />
              Brochure Code: {pkg.brochure_code}
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/70 backdrop-blur-sm">
              Small Group (Max 15) or Solo
            </span>
          </div>
        </div>

        {/* Hero Title & Information Grid */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="pkg-hero-rise pkg-hero-d2 mb-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-brass">
              {pkg.category} · {pkg.difficulty ?? "Curated Expedition"}
            </p>

            <h1 className="pkg-hero-rise pkg-hero-d3 font-serif text-3xl font-light tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl">
              {pkg.title}
            </h1>

            <p className="pkg-hero-rise pkg-hero-d4 mt-4 font-display text-sm leading-relaxed text-white/80 sm:text-base">
              {pkg.summary}
            </p>
          </div>

          {/* Quick Metrics Badges & CTA */}
          <div className="pkg-hero-rise pkg-hero-d5 flex shrink-0 flex-wrap items-center gap-3">
            <div className="rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="font-display text-[10px] font-medium uppercase tracking-wider text-white/60">
                Duration
              </div>
              <div className="mt-0.5 font-display text-sm font-semibold text-white">
                {pkg.duration}
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="font-display text-[10px] font-medium uppercase tracking-wider text-white/60">
                Route
              </div>
              <div className="mt-0.5 font-display text-sm font-semibold text-white">
                {destinations.length} Destination{destinations.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="scale-100 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
              <EnquireCta label="Enquire Now" withArrow />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
