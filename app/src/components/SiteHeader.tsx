"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import ScrollProgressBar from "./ui/ScrollProgressBar";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Single unified trigger ref for keyboard accessibility & focus return
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const prevOverflowRef = useRef<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const locked = menuOpen || mobileOpen;
    if (locked) {
      prevOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = prevOverflowRef.current;
    }
    return () => {
      document.body.style.overflow = prevOverflowRef.current;
    };
  }, [menuOpen, mobileOpen]);

  // Return focus to menu trigger when either drawer or modal closes
  const wasOpenRef = useRef(false);
  useEffect(() => {
    const isNowOpen = menuOpen || mobileOpen;
    if (wasOpenRef.current && !isNowOpen) {
      menuTriggerRef.current?.focus();
    }
    wasOpenRef.current = isNowOpen;
  }, [menuOpen, mobileOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Responsive toggle: mobile drawer on phone/tablet (<768px), mega menu on desktop (>=768px)
  const handleToggleMenu = useCallback(() => {
    if (menuOpen || mobileOpen) {
      setMenuOpen(false);
      setMobileOpen(false);
      return;
    }

    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobileOpen(true);
    } else {
      setMenuOpen(true);
    }
  }, [menuOpen, mobileOpen]);

  const solid = scrolled || menuOpen;
  const isAnyMenuOpen = menuOpen || mobileOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-md transition-all duration-300 ${
          solid ? "shadow-lg shadow-black/50" : ""
        }`}
        aria-label="Site header"
      >
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 md:h-[88px] md:px-8">
          {/* Left Column — Single unified, accessible Menu control (WCAG 44x44px touch target) */}
          <div className="flex items-center justify-self-start">
            <button
              ref={menuTriggerRef}
              type="button"
              onClick={handleToggleMenu}
              aria-expanded={isAnyMenuOpen}
              aria-controls={mobileOpen ? "mobile-menu" : "mega-menu"}
              aria-label={isAnyMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="group flex min-h-[44px] min-w-[44px] items-center gap-2.5 sm:gap-3 text-white transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-white group-hover:scale-105">
                <span aria-hidden="true" className="relative inline-flex h-3.5 w-4 flex-col justify-between">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-[1.5px] w-full bg-current transition-all duration-200 ${
                        isAnyMenuOpen && i === 1 ? "opacity-0" : ""
                      } ${isAnyMenuOpen && i === 0 ? "translate-y-[6px] rotate-45" : ""} ${
                        isAnyMenuOpen && i === 2 ? "-translate-y-[6px] -rotate-45" : ""
                      }`}
                    />
                  ))}
                </span>
              </div>
              <span className="hidden text-xs font-accent font-semibold uppercase tracking-[0.25em] md:inline group-hover:text-brass transition-colors">
                {isAnyMenuOpen ? "Close" : "Menu"}
              </span>
            </button>
          </div>

          {/* Centre Column — Centered Brand Logo */}
          <div className="justify-self-center">
            <BrandMark />
          </div>

          {/* Right Column — Search + Prominent Enquire Action (NO redundant second hamburger) */}
          <div className="flex items-center justify-self-end gap-2 sm:gap-3 md:gap-4">
            <Link
              href="/explore"
              aria-label="Search journeys"
              title="Search journeys"
              className="inline-flex min-h-[44px] min-w-[44px] h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass cursor-pointer"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] fill-none stroke-current stroke-[2]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6" strokeLinecap="round" />
              </svg>
            </Link>

            {/* Prominent Enquire Action (Visible and prominent across all screen sizes) */}
            <Link
              href="/enquiry"
              className="group relative inline-flex min-h-[44px] max-sm:min-h-[36px] max-sm:h-[36px] items-center justify-center gap-2 max-sm:gap-1 overflow-hidden rounded-full border border-brass/60 bg-brass/10 px-4 max-sm:px-2.5 sm:px-6 py-2 max-sm:py-1.5 text-[10px] max-sm:text-[9px] sm:text-xs font-accent font-semibold uppercase tracking-[0.16em] max-sm:tracking-[0.05em] sm:tracking-[0.22em] text-brass max-sm:text-white max-sm:border-white/40 max-sm:bg-white/10 backdrop-blur-sm transition-all duration-300 ease-out hover:border-brass hover:bg-brass hover:text-forest max-sm:hover:border-white/60 max-sm:hover:bg-white/20 max-sm:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-95 cursor-pointer shrink-0"
            >
              <span className="relative z-10 max-sm:hidden">Enquire now</span>
              <span className="relative z-10 hidden max-sm:inline">Enquire</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="relative z-10 h-3.5 w-3.5 fill-none stroke-current stroke-[2] transition-transform duration-300 ease-out group-hover:translate-x-0.5 max-sm:hidden"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
        <ScrollProgressBar />
      </header>

      <MegaMenu open={menuOpen} onClose={closeMenu} />
      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
