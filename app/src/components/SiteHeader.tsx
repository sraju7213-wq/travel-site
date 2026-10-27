"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandMark from "./BrandMark";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, mobileOpen]);

  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-wild-border-light transition-colors duration-300 ${
          solid ? "bg-wild-black" : "bg-wild-black/40 backdrop-blur-md"
        }`}
        aria-label="Site header"
      >
        <div className="mx-auto grid h-[76px] max-w-[1600px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:h-[92px] md:px-8">
          {/* Left — menu trigger */}
          <div className="flex items-center justify-self-start">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
              className="flex items-center gap-3 text-wild-white transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2 focus-visible:ring-offset-wild-black"
            >
              <span aria-hidden="true" className="relative inline-flex h-5 w-6 flex-col justify-between">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`h-0.5 w-full bg-current transition-all duration-200 ${
                      menuOpen && i === 1 ? "opacity-0" : ""
                    } ${menuOpen && i === 0 ? "translate-y-[9px] rotate-45" : ""} ${
                      menuOpen && i === 2 ? "-translate-y-[9px] -rotate-45" : ""
                    }`}
                  />
                ))}
              </span>
              <span className="hidden text-xs font-display font-medium uppercase tracking-[2.4px] md:inline">
                Menu
              </span>
            </button>
          </div>

          {/* Centre — logo */}
          <div className="justify-self-center">
            <BrandMark />
          </div>

          {/* Right — search + enquiry */}
          <div className="flex items-center justify-self-end gap-2 md:gap-4">
            <Link
              href="/explore"
              aria-label="Search journeys"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-wild-white transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.8]"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.6-3.6" strokeLinecap="round" />
              </svg>
            </Link>
            <Link href="/enquiry" className="btn-primary hidden px-5 py-2.5 text-xs sm:inline-flex">
              Enquire now
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-wild-white transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange md:hidden"
            >
              <span className="sr-only">Open menu</span>
              <span aria-hidden="true" className="relative inline-flex h-5 w-6 flex-col justify-between">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-0.5 w-full bg-current" />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MegaMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
