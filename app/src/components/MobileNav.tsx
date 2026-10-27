"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV_CATEGORIES } from "@/data/siteContent";
import BrandMark from "./BrandMark";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Mobile navigation — a full-height panel that slides in from the right, with the
 * primary categories as accordions.
 */
export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const close = () => {
    setExpanded(new Set());
    onClose();
  };

  if (!open) return null;

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  return (
    <div id="mobile-menu" className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Main navigation">
      <button
        type="button"
        aria-label="Close menu"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-wild-black/70"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-wild-darker text-wild-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-wild-border-light px-5 py-4">
          <BrandMark />
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-wild-white transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
          >
            <span className="sr-only">Close menu</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Primary">
          {NAV_CATEGORIES.map((group, gi) => (
            <section key={group.label} className="border-b border-wild-border-light">
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(gi)}
                  aria-expanded={expanded.has(gi)}
                  aria-controls={`mobile-group-${gi}`}
                  className="flex w-full items-center justify-between py-4 text-left text-xs font-display font-medium uppercase tracking-[2.4px] text-wild-sand transition-colors hover:text-wild-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                >
                  {group.label}
                  <span
                    aria-hidden="true"
                    className={`text-base transition-transform duration-200 ${
                      expanded.has(gi) ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </h2>
              <div
                id={`mobile-group-${gi}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expanded.has(gi) ? "max-h-[600px] pb-4" : "max-h-0"
                }`}
              >
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={`${group.label}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="block py-2 text-sm font-display text-white/80 transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </nav>

        <div className="border-t border-wild-border-light p-5">
          <Link href="/enquiry" onClick={close} className="btn-primary w-full">
            Enquire now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
