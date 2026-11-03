"use client";

import Image from "next/image";
import Link from "next/link";
import type { PackageViewModel } from "@/types/travel";

interface PackageCardProps {
  pkg: PackageViewModel;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#132325] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_-15px_rgba(255,110,0,0.2)] hover:border-[var(--color-wild-orange,#ff6e00)]/60 focus-within:border-[var(--color-wild-orange,#ff6e00)] focus-within:ring-2 focus-within:ring-[var(--color-wild-orange,#ff6e00)]/30"
    >
      {/* Visual Image Header */}
      <Link
        href={`/packages/${pkg.slug}`}
        className="relative block aspect-[16/10] overflow-hidden bg-[#0C1617] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
      >
        <Image
          src={`/images/packages/${pkg.slug}.jpg`}
          alt={pkg.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-95" />

        {/* Shimmer sweep on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-full ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="rounded-pill bg-black/70 backdrop-blur-md px-3 py-1 text-[0.625rem] font-accent font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange,#ff6e00)] border border-white/10 shadow-sm">
            {pkg.category}
          </span>
          <span className="rounded-pill bg-black/70 backdrop-blur-md px-3 py-1 text-[0.625rem] font-mono text-white/90 border border-white/10 shadow-sm">
            {pkg.duration}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-3 text-white">
          <span className="text-[0.625rem] font-accent uppercase tracking-[0.25em] text-brass-soft block">
            {pkg.region.join(" · ")}
          </span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs text-white/60">
          <span className="rounded-button border border-white/10 bg-white/5 px-2 py-0.5 text-[0.65rem] font-mono uppercase tracking-wider text-white/70">
            Code: {pkg.brochure_code}
          </span>
          <span
            title="Departures operate without minimum passenger quotas (subject to seasonal weather and pass safety)"
            className="text-[0.65rem] font-accent tracking-wider uppercase text-brass-soft cursor-help"
          >
            Guaranteed Run*
          </span>
        </div>

        <Link href={`/packages/${pkg.slug}`} className="block mb-3">
          <h3 className="font-serif text-xl font-light leading-snug text-white transition-colors duration-300 group-hover:text-[var(--color-wild-orange,#ff6e00)]">
            {pkg.title}
          </h3>
        </Link>

        <p className="line-clamp-2 font-sans font-light text-xs leading-relaxed text-white/70 mb-4">
          {pkg.summary}
        </p>

        {/* Highlight Bullets Preview */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="mb-5 space-y-1.5 border-t border-white/10 pt-3.5">
            {pkg.highlights.slice(0, 2).map((h, i) => (
              <p key={i} className="text-[0.72rem] font-sans font-light text-white/70 flex items-start gap-2 line-clamp-1">
                <span className="text-[var(--color-wild-orange,#ff6e00)] shrink-0 mt-0.5 font-bold">✓</span>
                <span className="truncate">{h}</span>
              </p>
            ))}
          </div>
        )}

        {/* Action Row */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <Link
            href={`/enquiry?package=${pkg.slug}`}
            className="text-[11px] font-accent font-semibold uppercase tracking-[0.22em] text-white/60 hover:text-[var(--color-wild-orange,#ff6e00)] transition-colors"
          >
            Quick Enquire
          </Link>
          <Link
            href={`/packages/${pkg.slug}`}
            className="btn-tertiary text-xs px-4 py-1.5 group-hover:bg-[var(--color-wild-orange,#ff6e00)] group-hover:text-white group-hover:border-[var(--color-wild-orange,#ff6e00)] group-hover:shadow-[0_4px_16px_rgba(255,110,0,0.4)] transition-all duration-300"
          >
            View Itinerary &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
