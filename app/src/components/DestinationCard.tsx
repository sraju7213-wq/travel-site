"use client";

import Image from "next/image";
import Link from "next/link";
import type { PackageViewModel } from "@/types/travel";
import { getPackageCardImage } from "@/data/catalogue";

interface DestinationCardProps {
  /** Package data driving the card content */
  pkg: PackageViewModel;
  /** Optional zero-based destination index shown top-right (e.g. 01, 02) */
  index?: number;
  /** Compact variant used in sidebars/related journeys */
  compact?: boolean;
  /** Additional Tailwind classes */
  className?: string;
}

export default function DestinationCard({
  pkg,
  index,
  compact = false,
  className,
}: DestinationCardProps) {
  const cardImage = getPackageCardImage(pkg.slug);

  // Show the places a journey actually goes, rather than the country heading.
  const stops = pkg.region.filter((r) => r !== "India" && r !== "Nepal");
  const placeLine =
    stops.length > 0
      ? `${stops.slice(0, 2).join(", ")}${stops.length > 2 ? ` +${stops.length - 2}` : ""}`
      : pkg.primaryRegion;

  // Clean duration display
  return (
    <article className={className}>
      <Link
        href={`/packages/${pkg.slug}`}
        className="group h-full overflow-hidden rounded-[24px] border border-white/10 bg-[#0C1617] transition-all duration-500 hover:border-[var(--color-wild-orange)]/60 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] will-change-transform"
      >
        {/* ── Image Frame ── */}
        <div
          className={`relative overflow-hidden rounded-[20px] ${compact ? "aspect-[16/10]" : "aspect-[4/3]"}`}
          suppressHydrationWarning
        >
          <Image
            src={cardImage}
            alt={pkg.title}
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            quality={75}
            className="object-cover object-[center_center] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            priority={compact === false}
          />

          {/* ── Layered overlay system for guaranteed text readability ── */}
          {/* Subtle overall tint across the whole image */}
          <div aria-hidden="true" className="absolute inset-0 bg-black/15" />
          {/* Stronger gradient concentrated toward the bottom where text sits */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 40% to-black/70"
          />
        </div>

        {/* ── Content Body ── */}
        <div className={`pt-5 ${compact ? "p-5" : "p-6"} relative z-10`}>
          {/* Glass style layer behind text for guaranteed readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-white/[6] backdrop-blur-md rounded-[20px] -inset-px pointer-events-none"
          />
          {/* Top row: category label + optional destination index */}
          <div className="flex items-center justify-between gap-3 mb-4">
            {index !== undefined && (
              <span className="shrink-0 font-serif text-[12px] font-light text-white/60">
                0{index + 1}
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm ${
                compact ? "text-[9px] px-2.5 py-0.5" : ""
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange)]" aria-hidden="true" />
              {placeLine}
            </span>
          </div>

          {/* Title — elegant serif typography */}
          <h3
            className={`font-serif font-light leading-[1.15] text-white tracking-tight line-clamp-2 transition-colors duration-300 group-hover:text-[var(--color-wild-orange)] ${compact ? "text-xl line-clamp-1" : "text-2xl sm:text-3xl"}`}
          >
            {pkg.title}
          </h3>

          {/* Bottom row: exploration indicator */}
          <div className={`mt-6 ${compact ? "mt-4" : ""} flex items-center gap-2`}>
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-wild-orange)] group-hover:underline transition-all">
              Explore journey
            </span>
            <svg
              className="h-4 w-4 shrink-0 text-[var(--color-wild-orange)] transition-transform duration-300 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
