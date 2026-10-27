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
      className="group relative flex flex-col overflow-hidden rounded-image border border-wild-border-light bg-ivory-soft transition-colors hover:border-wild-orange hover:bg-wild-cream focus-within:border-wild-orange"
    >
      <Link
        href={`/packages/${pkg.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-wild-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
      >
        <Image
          src={`/images/packages/${pkg.slug}.jpg`}
          alt={pkg.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span aria-hidden="true" className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-1.5">
          <Link
            href={`/explore/${encodeURIComponent(pkg.category)}`}
            className="inline-flex items-center gap-1 rounded-button border border-wild-border-light px-2 py-0.5 text-[0.75rem] font-display font-medium uppercase text-wild-sand transition-colors hover:border-wild-orange hover:text-wild-orange"
          >
            {pkg.category}
          </Link>
          <span className="rounded-button border border-wild-border-light px-2 py-0.5 text-[0.75rem] font-display font-medium uppercase text-wild-sand">
            {pkg.brochure_code}
          </span>
        </div>

        <Link href={`/packages/${pkg.slug}`} className="block">
          <h3 className="font-serif text-lg font-bold leading-snug text-charcoal transition-colors group-hover:text-wild-orange">
            {pkg.title}
          </h3>
          <p className="line-clamp-2 font-display text-sm leading-relaxed text-charcoal-soft">
            {pkg.summary}
          </p>
        </Link>

        <div className="mt-auto flex items-center justify-between border-t border-wild-border-light pt-4">
          <span className="font-display text-sm font-medium text-charcoal">{pkg.duration}</span>
          <Link href={`/packages/${pkg.slug}`} className="btn-tertiary">
            View itinerary <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
