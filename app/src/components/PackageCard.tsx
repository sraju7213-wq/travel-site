"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PackageViewModel } from "@/types/travel";
import { getPackageCardImage } from "@/data/catalogue";

interface PackageCardProps {
  pkg: PackageViewModel;
  compact?: boolean;
}

export default function PackageCard({ pkg, compact = false }: PackageCardProps) {
  const [imageError, setImageError] = useState(false);

  // Use the per-package Pexels image mapping for destination-accurate cards.
  const cardImage = getPackageCardImage(pkg.slug);

  // Show the places a journey actually goes, rather than the country heading.
  const stops = pkg.region.filter((r) => r !== "India" && r !== "Nepal");
  const placeLine =
    stops.length > 0
      ? `${stops.slice(0, 2).join(", ")}${stops.length > 2 ? ` +${stops.length - 2}` : ""}`
      : pkg.primaryRegion;

  // Clean duration display
  const cleanDuration = pkg.duration.includes(";")
    ? pkg.duration.split(";")[0].replace(/\(as printed\)/i, "").trim()
    : pkg.duration.replace(/\(as printed\)/i, "").replace(/per contents.*/i, "").trim();

  // Clean difficulty grade
  const cleanDifficulty = pkg.difficulty ? pkg.difficulty.split("(")[0].trim() : null;

  return (
    <article className="group h-full min-w-0" data-package-card>
      <Link
        href={`/packages/${pkg.slug}`}
        className="group/card flex h-full flex-row overflow-hidden min-w-0 border border-white/10 bg-[#0C1617] transition-all duration-300 hover:border-[var(--color-wild-orange)]/60 hover:bg-white/[0.02] hover:shadow-[0_12px_32px_-10px_rgba(212,147,104,0.22)] active:scale-[0.985] active:border-brass/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] will-change-transform sm:flex-col"
      >
        {/* Image Frame — poster on ≥sm, compact thumbnail rail on mobile */}
        <div
          className="relative aspect-square w-24 shrink-0 self-center overflow-hidden bg-black/40 sm:aspect-[16/10] sm:h-auto sm:w-full sm:self-stretch"
          suppressHydrationWarning
        >
          {!imageError ? (
            <Image
              src={cardImage}
              alt={pkg.title}
              fill
              sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              quality={90}
              className="object-cover transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.06]"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a2a2c] to-[#132325]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent transition-opacity duration-500 group-hover/card:opacity-0"
          />

          {/* Interactive Light sweep traveling across card frame */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-[850ms] ease-out group-hover/card:translate-x-full"
          />

          {/* Minimalist Corner Tag — Modelled directly on HouseboatCollection card */}
          <span className="absolute left-4 top-4 hidden border border-white/25 bg-black/60 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm sm:block">
            {pkg.category}
          </span>

          {/* Brochure Code (Bottom Right) */}
          {pkg.brochure_code && (
            <span className="absolute right-4 bottom-3 hidden border border-white/15 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/60 backdrop-blur-sm sm:block">
              Code {pkg.brochure_code}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className={`flex min-w-0 flex-1 flex-col ${compact ? "p-4 sm:p-5" : "p-4 sm:p-6"}`}>
          {/* Subtitle / Operating Region & Clean Duration */}
          <div className="flex items-center justify-between gap-2">
            <p className="font-sans text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--color-wild-orange)] truncate">
              {placeLine}
            </p>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-white/50">
              {cleanDuration}
            </span>
          </div>

          {/* Title */}
          <h3 className={`mt-1.5 font-serif font-light leading-snug text-white transition-colors duration-300 group-hover:text-[var(--color-wild-orange)] ${compact ? "text-lg line-clamp-1 sm:text-xl" : "text-base line-clamp-2 sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl"}`}>
            {pkg.title}
          </h3>
          {/* Summary */}
          <p className={`mt-1.5 flex-1 font-sans font-light leading-relaxed text-white/60 line-clamp-2 ${compact ? "text-sm sm:line-clamp-2" : "text-xs sm:text-xs lg:text-sm"}`}>
            {pkg.summary}
          </p>

          {/* Footer Action matching Houseboat cards with Circular Arrow button */}
          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5 sm:mt-4 sm:pt-3">
            <div className="group/link inline-flex items-center gap-2 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors group-hover:text-[var(--color-wild-orange)] sm:gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-none border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover:bg-[var(--color-wild-orange)] group-hover:text-white sm:h-8 sm:w-8">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="hidden lg:inline">View itinerary</span>
            </div>

            {cleanDifficulty && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                {cleanDifficulty}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
