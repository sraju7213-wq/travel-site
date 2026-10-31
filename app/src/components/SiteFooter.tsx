"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_COLUMNS } from "@/data/siteContent";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  const [openColumn, setOpenColumn] = useState<number | null>(null);

  return (
    <footer className="mt-auto border-t border-white/10 bg-charcoal text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="max-w-sm">
            <BrandMark className="mb-6" />
            <p className="text-sm font-display leading-relaxed text-white/80">
              Specialist travel across India and Nepal — tailor-made tours, small-group journeys,
              Himalayan trekking, cultural itineraries and Kashmir houseboats. Since 1927.
            </p>
            <Link href="/enquiry" className="btn-primary mt-8">
              Enquire now <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FOOTER_COLUMNS.map((col, i) => {
              const isOpen = openColumn === i;
              const panelId = `footer-${i}`;
              return (
                <div key={col.title}>
                  <h2>
                    {/* Mobile disclosure control. On desktop the column title is
                        rendered as plain text below, so the heading is never empty. */}
                    <button
                      type="button"
                      onClick={() => setOpenColumn(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-left text-xs font-display font-semibold uppercase tracking-[0.2em] text-white lg:hidden"
                    >
                      {col.title}
                      <span
                        aria-hidden="true"
                        className={`text-base text-brass transition-transform duration-200 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <span className="hidden border-b border-white/10 pb-3 text-xs font-display font-semibold uppercase tracking-[0.2em] text-white lg:block">
                      {col.title}
                    </span>
                  </h2>
                  <ul
                    id={panelId}
                    hidden={!isOpen}
                    className="mt-4 space-y-2.5 overflow-hidden transition-all duration-300 ease-in-out lg:!block lg:max-h-none"
                  >
                    {col.links.map((l) => (
                      <li key={`${col.title}-${l.label}`}>
                        <Link
                          href={l.href}
                          className="inline-flex min-h-[44px] items-center text-sm font-display text-white/80 transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs font-display text-white/60 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 India Nepal Travel Organisation. All rights reserved. &middot; <Link href="/admin" className="text-white/40 hover:text-brass transition-colors">Admin Portal</Link></p>
          <p className="max-w-2xl md:text-right">
            Content sourced from the organisation brochure. Prices, availability and booking terms
            are confirmed by direct enquiry.
          </p>
        </div>
      </div>
    </footer>
  );
}
