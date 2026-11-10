"use client";

import Link from "next/link";
import { useState } from "react";
import { FOOTER_COLUMNS } from "@/data/siteContent";
import { BRAND } from "@/data/brandConfig";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  const [openColumn, setOpenColumn] = useState<number | null>(null);

  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0C1617] text-white">
      {/* Accent rule */}
      <div
        aria-hidden="true"
        className="h-px w-full bg-gradient-to-r from-transparent via-wild-orange/60 to-transparent"
      />

      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2.4fr] lg:gap-14">
          {/* Brand column */}
          <div className="max-w-sm">
            <BrandMark className="mb-6" />
            <p className="text-xs md:text-sm font-sans font-light leading-relaxed text-white/70">
              {BRAND.name} presents bespoke expeditions across India and Nepal, operated in association with{" "}
              {BRAND.operatorName} (Baktoo family heritage since 1927).
            </p>

            <div className="mt-6 flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-wild-orange hover:text-wild-orange">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-wild-orange hover:text-wild-orange">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {FOOTER_COLUMNS.map((col, i) => {
              const isOpen = openColumn === i;
              const panelId = `footer-${i}`;
              return (
                <div key={col.title}>
                  <h2>
                    <button
                      type="button"
                      onClick={() => setOpenColumn(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="flex w-full items-center justify-between border-b border-white/10 pb-3 text-left text-[11px] font-accent font-semibold uppercase tracking-[0.24em] text-white/90 lg:hidden"
                    >
                      {col.title}
                      <span
                        aria-hidden="true"
                        className={`text-base text-wild-orange transition-transform duration-200 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>
                    <span className="hidden border-b border-white/10 pb-3 text-[11px] font-accent font-semibold uppercase tracking-[0.24em] text-white/90 lg:block">
                      {col.title}
                    </span>
                  </h2>
                  <ul
                    id={panelId}
                    className={`mt-4 space-y-2 overflow-hidden transition-all duration-300 ease-in-out lg:mt-4 ${
                      isOpen ? "block" : "hidden"
                    } lg:block`}
                  >
                    {col.links.map((l) => (
                      <li key={`${col.title}-${l.label}`}>
                        <Link
                          href={l.href}
                          className="inline-flex min-h-[40px] items-center text-sm font-sans text-white/60 transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange lg:min-h-0"
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


      </div>
    </footer>
  );
}