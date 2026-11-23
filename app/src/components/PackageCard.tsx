"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { PackageViewModel } from "@/types/travel";
import { getAllPackages, getPackageCardImage } from "@/data/catalogue";

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

  // Related thumbnails shown beneath the hover face's details.
  const others = getAllPackages().filter((item) => item.slug !== pkg.slug);
  const galleryImages = [
    cardImage,
    ...[...others.filter((item) => item.category === pkg.category), ...others]
      .slice(0, 3)
      .map((item) => getPackageCardImage(item.slug)),
  ];

  return (
    <article className="pkg-flip group h-full min-w-0" data-package-card>
      <div className="pkg-flip__inner">
        {/* Front — the full catalogue card */}
        <div className="pkg-flip__face pkg-flip__face--front">
          <Link
            href={`/packages/${pkg.slug}`}
            className="group/card relative flex h-full min-w-0 flex-row overflow-hidden rounded-xl border border-white/10 bg-[#0C1617] shadow-[0_8px_30px_-14px_rgba(0,0,0,0.7)] transition-all duration-500 hover:-translate-y-1 hover:border-brass/50 hover:shadow-[0_18px_45px_-14px_rgba(212,147,104,0.28)] active:scale-[0.985] active:border-brass/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass min-w-0 will-change-transform sm:flex-col"
          >
            {/* Image Frame — poster on ≥sm, compact thumbnail on mobile */}
            <div
              className="relative aspect-square w-28 shrink-0 overflow-hidden bg-black/40 sm:aspect-[16/11] sm:w-full"
              suppressHydrationWarning
            >
              {!imageError ? (
                <Image
                  src={cardImage}
                  alt={pkg.title}
                  fill
                  sizes="(min-width: 1280px) 320px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  quality={90}
                  className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-[1.06]"
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

              {/* Soft gradient so overlaid badges stay legible */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-black/25 transition-opacity duration-500"
              />

              {/* Category badge — top left */}
              <span className="absolute left-2.5 top-2.5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md sm:left-3 sm:top-3 sm:text-[9px] sm:tracking-[0.2em]">
                {pkg.category}
              </span>

              {/* Duration pill — bottom left */}
              <span className="absolute bottom-2.5 left-2.5 rounded-full bg-brass px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-wide text-[#0C1617] shadow-lg sm:bottom-3 sm:left-3">
                {cleanDuration}
              </span>

              {/* Brochure code — bottom right */}
              {pkg.brochure_code && (
                <span className="pkg-flip__front-extra absolute bottom-3 right-3 hidden font-mono text-[9px] uppercase tracking-wider text-white/70 sm:block">
                  {pkg.brochure_code}
                </span>
              )}

              {/* Light sweep on hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[850ms] ease-out group-hover/card:translate-x-full"
              />
            </div>

            {/* Content Body */}
            <div className={`pkg-flip__front-extra flex min-w-0 flex-1 flex-col p-3.5 sm:p-5 ${compact ? "" : ""}`}>
              {/* Region line */}
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 shrink-0 rounded-full bg-brass" />
                <p className="truncate font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-brass-soft sm:text-[10px] sm:tracking-[0.22em]">
                  {placeLine}
                </p>
              </div>

              {/* Title */}
              <h3 className="mt-1.5 font-serif text-base font-light leading-snug text-white line-clamp-2 transition-colors duration-300 group-hover/card:text-brass sm:text-lg">
                {pkg.title}
              </h3>

              {/* Summary */}
              <p className="mt-1.5 font-sans text-[11px] font-light leading-relaxed text-white/55 line-clamp-2 sm:text-xs">
                {pkg.summary}
              </p>

              {/* Footer — difficulty tag + pill CTA */}
              <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4">
                {cleanDifficulty ? (
                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-white/60">
                    {cleanDifficulty}
                  </span>
                ) : (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40">
                    {pkg.category}
                  </span>
                )}

                <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/50 px-3 py-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-brass transition-all duration-300 group-hover/card:border-brass group-hover/card:bg-brass group-hover/card:text-[#0C1617]">
                  View
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Back — all itinerary details over a rotating brass glow */}
        <Link
          href={`/packages/${pkg.slug}`}
          aria-hidden="true"
          tabIndex={-1}
          className="pkg-flip__face pkg-flip__face--back"
        >
          <span className="pkg-flip__orb pkg-flip__orb--a" aria-hidden="true" />
          <span className="pkg-flip__orb pkg-flip__orb--b" aria-hidden="true" />
          <span className="pkg-flip__orb pkg-flip__orb--c" aria-hidden="true" />
          <span className="pkg-flip__back-panel">
            <span className="pkg-flip__back-content">
              <span className="pkg-flip__back-badge">{pkg.category}</span>
              <span className="pkg-flip__back-title">{pkg.title}</span>
              <span className="pkg-flip__back-meta">{cleanDuration} · {placeLine}</span>
              {pkg.brochure_code && (
                <span className="pkg-flip__back-meta">Code {pkg.brochure_code}</span>
              )}
              {cleanDifficulty && (
                <span className="pkg-flip__back-meta">{cleanDifficulty}</span>
              )}
              <span className="pkg-flip__back-summary">{pkg.summary}</span>
              <span className="pkg-flip__back-cta">
                View itinerary
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
            <span className="pkg-flip__gallery-strip" aria-hidden="true">
              {galleryImages.map((src, index) => (
                <span className="pkg-flip__gallery-shot" key={`${src}-${index}`}>
                  <Image src={src} alt="" fill sizes="160px" loading="lazy" />
                </span>
              ))}
            </span>
          </span>
        </Link>
      </div>
    </article>
  );
}
