"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PackageViewModel } from "@/types/travel";

interface PackageCardProps {
  pkg: PackageViewModel;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "challenging":
      case "strenuous":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-white/10 text-white/60 border-white/20";
    }
  };

  return (
    <article className="group relative">
      <Link
        href={`/packages/${pkg.slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C1617]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Wrapper */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-[#132325]" suppressHydrationWarning>
          {!imageError ? (
            <Image
              src={`/images/packages/${pkg.slug}.jpg`}
              alt={pkg.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a2a2c] to-[#132325]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white/20">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-accent font-semibold uppercase tracking-[0.15em] text-brass border border-brass/30">
              {pkg.category}
            </span>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-display font-semibold text-white/90 border border-white/20">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              {pkg.duration.split(" ")[0]} nights
            </span>
          </div>

          {/* Difficulty Badge */}
          {pkg.difficulty && (
            <div className="absolute bottom-3 left-3 z-10">
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-display font-semibold uppercase tracking-[0.1em] border ${getDifficultyColor(pkg.difficulty)} backdrop-blur-sm`}>
                {pkg.difficulty}
              </span>
            </div>
          )}

          {/* Brochure Code Badge */}
          <div className="absolute bottom-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 text-[10px] font-display font-semibold text-white/70 border border-white/20">
              {pkg.brochure_code}
            </span>
          </div>

          {/* Gradient Overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            aria-hidden="true"
          />

          {/* Hover Action Indicator */}
          <div
            className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
            aria-hidden="true"
          >
            <div className="transform group-hover:translate-y-0 translate-y-4 transition-transform duration-500">
              <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brass text-white shadow-[0_8px_30px_-8px_rgba(177,138,81,0.5)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <p className="mt-2 text-center text-sm font-display font-semibold uppercase tracking-wider text-white drop-shadow-lg">
                View journey
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-4 animate-fade-in-up">
          <h3 className="line-clamp-1 font-serif text-lg md:text-xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-brass">
            {pkg.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-white/60">
            {pkg.summary}
          </p>

          {/* Highlights Preview */}
          {pkg.highlights && pkg.highlights.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {pkg.highlights.slice(0, 3).map((highlight, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-display text-white/50 border border-white/10 hover:border-brass/30 hover:text-white/70 hover:bg-white/10 transition-all"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {highlight.length > 30 ? highlight.slice(0, 30) + "…" : highlight}
                </span>
              ))}
              {pkg.highlights.length > 3 && (
                <span className="inline-flex items-center justify-center rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-display font-semibold text-white/40 border border-white/10">
                  +{pkg.highlights.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 text-[10px] font-display font-medium uppercase tracking-[0.1em] text-white/50">
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/40">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {pkg.primaryRegion}
              </span>
              {pkg.secondaryRegions.length > 0 && (
                <span className="flex items-center gap-1 text-white/30">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  +{pkg.secondaryRegions.length}
                </span>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-accent uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 group-hover:text-brass">
              View journey
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}