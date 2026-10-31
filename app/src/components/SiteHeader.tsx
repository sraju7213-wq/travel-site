"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import MegaMenu from "./MegaMenu";
import MobileNav from "./MobileNav";

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
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

  const megaWasOpen = useRef(false);
  const mobileWasOpen = useRef(false);
  useEffect(() => {
    if (megaWasOpen.current && !menuOpen) megaTriggerRef.current?.focus();
    megaWasOpen.current = menuOpen;
  }, [menuOpen]);
  useEffect(() => {
    if (mobileWasOpen.current && !mobileOpen) mobileTriggerRef.current?.focus();
    mobileWasOpen.current = mobileOpen;
  }, [mobileOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const solid = scrolled || menuOpen;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300 ${
          solid
            ? "bg-black/95 backdrop-blur-md shadow-lg shadow-black/20"
            : "bg-black/40 backdrop-blur-md"
        }`}
        aria-label="Site header"
      >
        <div className="mx-auto grid h-[76px] max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 md:h-[92px] md:px-8">
          {/* Left — menu trigger */}
          <div className="flex items-center justify-self-start">
            <button
              ref={megaTriggerRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="group flex items-center gap-3 text-white transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-white">
                <span aria-hidden="true" className="relative inline-flex h-3 w-4 flex-col justify-between">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-[1.5px] w-full bg-current transition-all duration-200 ${
                        menuOpen && i === 1 ? "opacity-0" : ""
                      } ${menuOpen && i === 0 ? "translate-y-[5px] rotate-45" : ""} ${
                        menuOpen && i === 2 ? "-translate-y-[5px] -rotate-45" : ""
                      }`}
                    />
                  ))}
                </span>
              </div>
              <span className="hidden text-xs font-display font-medium uppercase tracking-[2.4px] md:inline group-hover:text-brass transition-colors">
                Menu
              </span>
            </button>
          </div>

          {/* Centre — logo */}
          <div className="justify-self-center">
            <BrandMark />
          </div>

          {/* Right — search + enquiry */}
          <div className="flex items-center justify-self-end gap-3 md:gap-4">
            <Link
              href="/explore"
              aria-label="Search journeys"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass cursor-pointer"
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
            <Link href="/enquiry" className="btn-primary hidden px-6 py-2.5 text-xs sm:inline-flex">
              Enquire now
            </Link>
            <button
              ref={mobileTriggerRef}
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              aria-label="Open mobile menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-white/5 text-white transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass md:hidden cursor-pointer"
            >
              <span aria-hidden="true" className="relative inline-flex h-3 w-4 flex-col justify-between">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-[1.5px] w-full bg-current" />
                ))}
              </span>
            </button>
          </div>
        </div>
      </header>

      <MegaMenu open={menuOpen} onClose={closeMenu} />
      <MobileNav open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
