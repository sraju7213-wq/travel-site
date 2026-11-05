"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Single unified trigger ref for keyboard accessibility & focus return
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  useBodyOverflowLock(menuOpen || mobileOpen);

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
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) {
      setMobileOpen((v) => !v);
      setMenuOpen(false);
    } else {
      setMenuOpen((v) => !v);
      setMobileOpen(false);
    }
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          solid ? "bg-black/95 backdrop-blur-md border-b border-white/10" : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex h-16 md:h-20 items-center justify-between gap-4">
            <BrandMark className="h-8 w-auto" aria-hidden="true" />

            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              <Link
                href="/explore"
                className="text-sm font-accent uppercase tracking-[0.12em] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg"
              >
                Journeys
              </Link>
              <Link
                href="/houseboats"
                className="text-sm font-accent uppercase tracking-[0.12em] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg"
              >
                Houseboats
              </Link>
              <Link
                href="/about"
                className="text-sm font-accent uppercase tracking-[0.12em] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg"
              >
                Heritage
              </Link>
              <Link
                href="/contact"
                className="text-sm font-accent uppercase tracking-[0.12em] text-white/70 hover:text-white transition-colors px-3 py-2 rounded-lg"
              >
                Contact
              </Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button
                ref={menuTriggerRef}
                type="button"
                onClick={handleToggleMenu}
                aria-expanded={menuOpen}
                aria-controls="mega-menu"
                aria-haspopup="dialog"
                className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-accent uppercase tracking-[0.12em] text-white/80 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <span>Plan Your Trip</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-aria-expanded:rotate-180"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-haspopup="dialog"
                className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                aria-label="Open menu"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MegaMenu open={menuOpen} onClose={closeMenu} />
      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </>
  );
}