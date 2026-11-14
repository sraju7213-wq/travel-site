"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PackageViewModel } from "@/types/travel";

interface PackageCardProps {
  pkg: PackageViewModel;
  compact?: boolean;
}

export default function PackageCard({ pkg, compact = false }: PackageCardProps) {
  const [imageError, setImageError] = useState(false);

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
        className="group/card flex h-full flex-col overflow-hidden min-w-0 border border-white/10 bg-[#0C1617] transition-all duration-300 hover:border-[var(--color-wild-orange)]/60 hover:bg-white/[0.02] hover:shadow-[0_12px_32px_-10px_rgba(212,147,104,0.22)] active:scale-[0.985] active:border-brass/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] will-change-transform"
      >
        {/* Image Frame — Identical to Houseboat cards */}
        <div
          className={`relative overflow-hidden bg-black/40 ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}
          suppressHydrationWarning
        >
          {!imageError ? (
            <Image
              src={`/images/packages/${pkg.slug}.jpg`}
              alt={pkg.title}
              fill
              sizes="(min-width: 1280px) 500px, (min-width: 640px) 50vw, 100vw"
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
          <span className="absolute left-4 top-4 border border-white/25 bg-black/60 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-sm">
            {pkg.category}
          </span>

          {/* Brochure Code (Bottom Right) */}
          {pkg.brochure_code && (
            <span className="absolute right-4 bottom-3 border border-white/15 bg-black/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/60 backdrop-blur-sm">
              Code {pkg.brochure_code}
            </span>
          )}
        </div>

        {/* Content Body */}
        <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
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
          <h3 className={`mt-2 font-serif font-light leading-snug text-white transition-colors duration-300 group-hover:text-[var(--color-wild-orange)] ${compact ? "text-xl line-clamp-1" : "text-2xl line-clamp-2"}`}>
            {pkg.title}
          </h3>
          {/* Summary */}
          <p className={`mt-3 flex-1 font-sans text-sm font-light leading-relaxed text-white/60 ${compact ? "line-clamp-2" : "line-clamp-3"}`}>
            {pkg.summary}
          </p>

          {/* Footer Action matching Houseboat cards with Circular Arrow button */}
          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="group/link inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors group-hover:text-[var(--color-wild-orange)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-none border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover:bg-[var(--color-wild-orange)] group-hover:text-white">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>View itinerary</span>
            </div>

            {cleanDifficulty && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {cleanDifficulty}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
