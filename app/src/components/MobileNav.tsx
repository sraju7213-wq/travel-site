"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { NAV_CATEGORIES, DESTINATIONS } from "@/data/siteContent";
import Image from "next/image";
import BrandMark from "./BrandMark";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setExpanded(new Set());
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setExpanded(new Set());
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
    <div
      id="mobile-menu"
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      <button
        type="button"
        aria-label="Close menu"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-black/70 backdrop-blur-sm"
      />
      <div
        ref={panelRef}
        className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-black text-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <BrandMark />
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <span className="sr-only">Close menu</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.8]">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Primary">
          {/* Quick Destination Photo Chips */}
          <div className="mb-6">
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-3">
              Explore Destinations
            </p>
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
              {DESTINATIONS.slice(0, 5).map((dest) => (
                <Link
                  key={dest.name}
                  href={dest.href}
                  onClick={close}
                  className="group relative flex-shrink-0 w-28 h-20 rounded-[0.75rem] overflow-hidden border border-white/10"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <span className="absolute inset-x-2 bottom-1.5 text-[0.7rem] font-serif font-bold text-white text-center truncate">
                    {dest.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          {NAV_CATEGORIES.map((group, gi) => (
            <section key={group.label} className="border-b border-white/10">
              <h2>
                <button
                  type="button"
                  onClick={() => toggle(gi)}
                  aria-expanded={expanded.has(gi)}
                  aria-controls={`mobile-group-${gi}`}
                  className="flex min-h-[44px] w-full items-center justify-between py-4 text-left text-xs font-display font-medium uppercase tracking-[2.4px] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  {group.label}
                  <span
                    aria-hidden="true"
                    className={`text-base font-semibold text-brass transition-transform duration-200 ${
                      expanded.has(gi) ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </h2>
              <div
                id={`mobile-group-${gi}`}
                hidden={!expanded.has(gi)}
                className="overflow-hidden transition-all duration-300 ease-in-out pb-4"
              >
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={`${group.label}-${item.label}`}>
                      <Link
                        href={item.href}
                        onClick={close}
                        className="block min-h-[44px] py-2 text-sm font-display text-white/80 transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
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

        <div className="border-t border-white/10 p-5">
          <Link href="/enquiry" onClick={close} className="btn-primary w-full">
            Enquire now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
