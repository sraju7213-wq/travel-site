"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_COLUMNS } from "@/data/siteContent";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  const [openColumn, setOpenColumn] = useState<number | null>(null);

  return (
    <footer className="mt-auto border-t border-wild-border-light bg-wild-black text-wild-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <div className="max-w-sm">
            <BrandMark className="mb-6" />
            <p className="text-sm font-display leading-relaxed text-white/70">
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
              return (
                <div key={col.title}>
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpenColumn(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`footer-${i}`}
                      className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-left text-xs font-display font-semibold uppercase tracking-[0.2em] text-wild-white lg:pointer-events-none"
                    >
                      {col.title}
                      <span
                        aria-hidden="true"
                        className={`text-base text-wild-orange transition-transform duration-200 lg:hidden ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h2>
                  <ul
                    id={`footer-${i}`}
                    className={`mt-4 space-y-2.5 overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96" : "max-h-96 lg:max-h-none"
                    } ${isOpen ? "" : "max-h-0 lg:max-h-none"}`}
                  >
                    {col.links.map((l) => (
                      <li key={`${col.title}-${l.label}`}>
                        <Link
                          href={l.href}
                          className="text-sm font-display text-white/70 transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
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

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs font-display text-white/50 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 India Nepal Travel Organisation. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            Content sourced from the organisation brochure. Prices, availability and booking terms
            are confirmed by direct enquiry.
          </p>
        </div>
      </div>
    </footer>
  );
}
