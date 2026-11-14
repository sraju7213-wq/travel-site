"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import EnquireCta from "@/components/package/EnquireCta";
import type { PackageViewModel } from "@/types/travel";

interface PackageHeroProps {
  pkg: PackageViewModel;
}

export default function PackageHero({ pkg }: PackageHeroProps) {
  const [mounted, setMounted] = useState(false);
  const destinations = pkg.region.filter((r) => r !== "India" && r !== "Nepal");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#0C1617] pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-20">
      {/* Background Photography with cinematic Ken Burns settle */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-[1300ms] ease-out will-change-transform ${
          mounted ? "opacity-35 scale-100" : "opacity-0 scale-105"
        }`}
      >
        <Image
          src={`/images/packages/${pkg.slug}.jpg`}
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
        <div
          className={`mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50 transition-all duration-700 ease-out delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/" className="transition-colors hover:text-brass">
              Home
            </Link>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <Link
              href="/journeys#catalogue"
              className="text-brass-soft transition-colors hover:text-brass"
            >
              Journeys
            </Link>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <Link
              href={`/journeys?category=${encodeURIComponent(pkg.category)}#catalogue`}
              className="text-brass-soft transition-colors hover:text-brass"
            >
              {pkg.category}
            </Link>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="font-medium text-white/90 truncate max-w-[200px] sm:max-w-none">
              {pkg.title}
            </span>
          </nav>

          <div className="flex items-center gap-2.5">
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
            <p
              className={`mb-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-brass transition-all duration-700 ease-out delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {pkg.category} · {pkg.difficulty ?? "Curated Expedition"}
            </p>

            <h1
              className={`font-serif text-3xl font-light tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] sm:text-5xl lg:text-6xl transition-all duration-700 ease-out delay-300 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {pkg.title}
            </h1>

            <p
              className={`mt-4 font-display text-sm leading-relaxed text-white/75 sm:text-base transition-all duration-700 ease-out delay-400 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {pkg.summary}
            </p>
          </div>

          {/* Quick Metrics Badges & CTA */}
          <div
            className={`flex shrink-0 flex-wrap items-center gap-3 transition-all duration-700 ease-out delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="font-display text-[10px] font-medium uppercase tracking-wider text-white/45">
                Duration
              </div>
              <div className="mt-0.5 font-display text-sm font-semibold text-white">
                {pkg.duration}
              </div>
            </div>

            <div className="rounded-xl border border-white/15 bg-black/40 px-5 py-3 text-center backdrop-blur-md shadow-lg">
              <div className="font-display text-[10px] font-medium uppercase tracking-wider text-white/45">
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
