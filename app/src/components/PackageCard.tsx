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
      className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#132325] transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_-15px_rgba(0,0,0,0.6)] hover:border-brass/50 focus-within:border-brass focus-within:ring-2 focus-within:ring-brass/30"
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
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />

        {/* Floating Badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <span className="rounded-pill bg-black/70 backdrop-blur-md px-3 py-1 text-[0.65rem] font-display font-semibold uppercase tracking-wider text-brass border border-white/10 shadow-sm">
            {pkg.category}
          </span>
          <span className="rounded-pill bg-black/70 backdrop-blur-md px-3 py-1 text-[0.65rem] font-display font-medium text-white/90 border border-white/10 shadow-sm">
            {pkg.duration}
          </span>
        </div>

        <div className="absolute inset-x-4 bottom-3 text-white">
          <span className="text-[0.65rem] font-display uppercase tracking-widest text-white/70 block">
            {pkg.region.join(" · ")}
          </span>
        </div>
      </Link>

      {/* Content Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-2 mb-2 text-xs font-display text-white/60">
          <span className="rounded-button border border-white/10 bg-white/5 px-2 py-0.5 text-[0.7rem] font-semibold uppercase text-white/70">
            Code: {pkg.brochure_code}
          </span>
          <span className="text-[0.7rem] text-white/60">
            Guaranteed Departure
          </span>
        </div>

        <Link href={`/packages/${pkg.slug}`} className="block mb-3">
          <h3 className="font-serif text-xl font-bold leading-snug text-white transition-colors group-hover:text-brass">
            {pkg.title}
          </h3>
        </Link>

        <p className="line-clamp-2 font-display text-xs md:text-sm leading-relaxed text-white/75 mb-4">
          {pkg.summary}
        </p>

        {/* Highlight Bullets Preview */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div className="mb-5 space-y-1.5 border-t border-white/10 pt-3.5">
            {pkg.highlights.slice(0, 2).map((h, i) => (
              <p key={i} className="text-[0.75rem] font-display text-white/70 flex items-start gap-2 line-clamp-1">
                <span className="text-brass shrink-0 mt-0.5 font-bold">✓</span>
                <span className="truncate">{h}</span>
              </p>
            ))}
          </div>
        )}

        {/* Action Row */}
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <Link
            href={`/enquiry?package=${pkg.slug}`}
            className="text-xs font-display font-semibold uppercase tracking-wider text-white/60 hover:text-brass transition-colors"
          >
            Quick Enquire
          </Link>
          <Link
            href={`/packages/${pkg.slug}`}
            className="btn-tertiary text-xs px-4 py-1.5 group-hover:bg-brass group-hover:text-white group-hover:border-brass transition-all"
          >
            View Itinerary &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
