"use client";

import Image from "next/image";
import Link from "next/link";
import type { PackageViewModel } from "@/types/travel";

interface PackageCardProps {
  pkg: PackageViewModel;
}

export default function PackageCard({ pkg }: PackageCardProps) {
  return (
    <article>
      <Link
        href={`/packages/${pkg.slug}`}
        className="group block rounded-[1rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-4 focus-visible:ring-offset-[#0C1617]"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-[1rem] bg-[#132325]">
          <Image
            src={`/images/packages/${pkg.slug}.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        </div>

        <div className="mt-4">
          <p className="text-[10px] font-accent uppercase tracking-[0.2em] text-brass">
            {pkg.category}
          </p>
          <h3 className="mt-1.5 line-clamp-1 font-serif text-lg font-light leading-snug text-white transition-colors duration-300 group-hover:text-brass">
            {pkg.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/55">
            {pkg.summary}
          </p>
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-white/10 pt-3">
            <span className="truncate text-[10px] font-accent uppercase tracking-[0.16em] text-white/45">
              {pkg.duration} · {pkg.brochure_code}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 text-[10px] font-accent uppercase tracking-[0.16em] text-white/70 transition-colors duration-300 group-hover:text-brass">
              View journey
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
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
