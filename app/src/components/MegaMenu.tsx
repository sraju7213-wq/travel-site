"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import { DESTINATIONS, EXPERIENCES } from "@/data/siteContent";

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

type MenuTab = "destinations" | "journeys" | "experiences" | "houseboats" | "about" | "contact";

const MENU_TABS: { key: MenuTab; label: string; badge: string }[] = [
  { key: "destinations", label: "Destinations", badge: "8 Regions" },
  { key: "journeys", label: "Journeys & Tours", badge: "27 Packages" },
  { key: "experiences", label: "Experiences", badge: "Curated" },
  { key: "houseboats", label: "Kashmir Houseboats", badge: "Signature" },
  { key: "about", label: "About Our Heritage", badge: "Est. 1927" },
  { key: "contact", label: "Plan Your Trip", badge: "Enquire" },
];

const JOURNEY_CATEGORIES = [
  {
    name: "Stopovers",
    count: "6 packages",
    blurb: "Delhi, Bombay, Leh, and Kathmandu cultural city stopovers.",
    image: "/images/destinations/delhi-monument.jpg",
    href: "/explore?category=Stopovers",
  },
  {
    name: "Images of India",
    count: "7 packages",
    blurb: "Golden Triangle, Goa, Kerala backwaters, and Kashmir circuits.",
    image: "/images/destinations/jodhpur-fort.jpg",
    href: "/explore?category=Images%20of%20India",
  },
  {
    name: "India Tours",
    count: "3 packages",
    blurb: "Comprehensive North and South India highlight circuits.",
    image: "/images/destinations/kerala-backwaters.jpg",
    href: "/explore?category=India%20Tours",
  },
  {
    name: "Himalayan Expeditions",
    count: "3 packages",
    blurb: "High-altitude trekking in Markha Valley and Zanskar.",
    image: "/images/destinations/markha-valley.jpg",
    href: "/explore?category=Himalayan%20Expeditions",
  },
  {
    name: "Mini Trek in Kashmir",
    count: "3 packages",
    blurb: "Alpine lake trails, pine meadows, and Gulmarg skiing.",
    image: "/images/destinations/kashmir-shikara.jpg",
    href: "/explore?category=Mini%20Trek%20in%20Kashmir",
  },
  {
    name: "Nepal Adventure",
    count: "5 packages",
    blurb: "Himalayan combination treks, Trisuli rafting, and wildlife.",
    image: "/images/destinations/nepal-trek.jpg",
    href: "/explore?category=Nepal%20Adventure",
  },
];

export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [activeTab, setActiveTab] = useState<MenuTab>("destinations");

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
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

  return (
    <div
      id="mega-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white overflow-y-auto animate-fade-in"
    >
      {/* 1. Header Bar matching Wilderness Destinations */}
      <div className="border-b border-white/10 bg-black/95 px-6 md:px-12 py-5 sticky top-0 z-20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          {/* Close button with circular outline */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="group flex items-center gap-3 text-white transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass cursor-pointer"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-white">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="stroke-current stroke-2">
                <path d="M1 1l12 12M13 1L1 13" strokeLinecap="round" />
              </svg>
            </span>
            <span className="hidden text-xs font-display font-medium uppercase tracking-[2.4px] md:inline">
              Close
            </span>
          </button>

          {/* Centered Brand Mark */}
          <div className="justify-self-center">
            <BrandMark />
          </div>

          {/* Right — Enquire CTA */}
          <div className="flex items-center gap-4">
            <Link
              href="/enquiry"
              onClick={onClose}
              className="btn-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Enquire now
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Luxury Editorial Showcase Grid */}
      <div className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Primary Category List */}
          <nav className="lg:col-span-4 lg:border-r lg:border-white/10 lg:pr-8" aria-label="Mega menu categories">
            <p className="text-[0.7rem] font-display uppercase tracking-[0.3em] text-white/40 mb-3">
              Explore Our Subcontinent
            </p>
            <ul className="space-y-1">
              {MENU_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <li key={tab.key}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      onMouseEnter={() => setActiveTab(tab.key)}
                      className={`w-full group flex items-center justify-between py-4 border-b border-white/10 text-left transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "text-brass border-brass pl-2 font-semibold"
                          : "text-white/60 hover:text-white hover:pl-1 font-medium"
                      }`}
                    >
                      <span className="text-sm lg:text-base font-display uppercase tracking-[2.4px]">
                        {tab.label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[0.65rem] font-display uppercase tracking-widest text-white/40 group-hover:text-white/70">
                          {tab.badge}
                        </span>
                        <span
                          className={`text-sm transition-transform duration-200 ${
                            isActive ? "translate-x-1 text-brass font-bold" : "text-white/20 group-hover:text-white"
                          }`}
                        >
                          &rarr;
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Concierge Highlight Box */}
            <div className="mt-8 rounded-[1rem] border border-white/10 bg-forest/40 p-6 hidden lg:block">
              <p className="text-xs font-display uppercase tracking-[0.2em] text-brass mb-2">
                Specialist Travel Since 1927
              </p>
              <p className="text-xs font-display text-white/80 leading-relaxed mb-4">
                Tailor-made itineraries and small-group journeys up to 15 travellers. Guaranteed departures across India &amp; Nepal.
              </p>
              <Link
                href="/enquiry"
                onClick={onClose}
                className="btn-tertiary w-full justify-center text-xs py-2"
              >
                Plan a custom journey &rarr;
              </Link>
            </div>
          </nav>

          {/* Right Column: Dynamic Visual Showcase */}
          <div className="lg:col-span-8">
            {/* DESTINATIONS TAB SHOWCASE */}
            {activeTab === "destinations" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">
                      Eight Iconic Regions
                    </p>
                    <h2 className="font-serif text-2xl text-white mt-1">Destinations We Operate In</h2>
                  </div>
                  <Link
                    href="/explore"
                    onClick={onClose}
                    className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-brass transition-colors"
                  >
                    View all regions &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {DESTINATIONS.slice(0, 6).map((dest) => (
                    <Link
                      key={dest.name}
                      href={dest.href}
                      onClick={onClose}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl"
                    >
                      <Image
                        src={dest.image}
                        alt={dest.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
                      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-start">
                        <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-brass mb-1 drop-shadow-md">
                          {dest.tagline}
                        </span>
                        <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-white drop-shadow-lg">
                          {dest.name}
                        </h3>
                        <span className="mt-auto text-xs font-display text-white/80 group-hover:text-brass flex items-center gap-1 transition-colors drop-shadow-md">
                          Explore region &rarr;
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* JOURNEYS TAB SHOWCASE */}
            {activeTab === "journeys" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">
                      Brochure Catalogue
                    </p>
                    <h2 className="font-serif text-2xl text-white mt-1">27 Curated Itineraries</h2>
                  </div>
                  <Link
                    href="/explore"
                    onClick={onClose}
                    className="text-xs font-display uppercase tracking-widest text-brass hover:text-white transition-colors"
                  >
                    View all 27 tours &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {JOURNEY_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      onClick={onClose}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-colors group-hover:from-black/95" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-1">
                          {cat.count}
                        </span>
                        <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                          {cat.name}
                        </h3>
                        <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">
                          {cat.blurb}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* EXPERIENCES TAB SHOWCASE */}
            {activeTab === "experiences" && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">
                      Signature Adventures
                    </p>
                    <h2 className="font-serif text-2xl text-white mt-1">Experience Real, Raw Nature</h2>
                  </div>
                  <Link
                    href="/explore"
                    onClick={onClose}
                    className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-brass transition-colors"
                  >
                    All activities &rarr;
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {EXPERIENCES.map((exp) => (
                    <Link
                      key={exp.title}
                      href={exp.href}
                      onClick={onClose}
                      className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl"
                    >
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-colors group-hover:from-black/95" />
                      <div className="absolute inset-0 p-5 flex flex-col justify-end">
                        <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-1">
                          {exp.locations}
                        </span>
                        <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">
                          {exp.title}
                        </h3>
                        <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">
                          {exp.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* KASHMIR HOUSEBOATS SHOWCASE */}
            {activeTab === "houseboats" && (
              <div className="space-y-6 animate-fade-in">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[1rem] border border-white/15 bg-charcoal shadow-2xl">
                  <Image
                    src="/images/destinations/kashmir-shikara.jpg"
                    alt="Kashmir Houseboats on Dal Lake"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-xl">
                    <span className="text-xs font-display uppercase tracking-[0.3em] text-brass mb-2">
                      Exclusive Accommodation
                    </span>
                    <h2 className="font-serif text-3xl font-bold text-white mb-3">
                      Kashmir Houseboat Stays on Dal Lake
                    </h2>
                    <p className="font-display text-sm leading-relaxed text-white/80 mb-6">
                      Cedarwood carved interiors, tranquil lake waters, and personal shikara transfers. Operating since 1927 in Srinagar, Kashmir.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href="/houseboats"
                        onClick={onClose}
                        className="btn-primary text-xs px-5 py-2.5"
                      >
                        Explore houseboats &rarr;
                      </Link>
                      <Link
                        href="/enquiry"
                        onClick={onClose}
                        className="btn-ghost-dark text-xs px-5 py-2.5"
                      >
                        Enquire now &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ABOUT TAB SHOWCASE */}
            {activeTab === "about" && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] border border-white/15 bg-charcoal shadow-2xl">
                    <Image
                      src="/images/destinations/ladakh-monastery.jpg"
                      alt="Ladakh monastery heritage"
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-xs font-display uppercase tracking-[0.25em] text-brass mb-1">
                        Est. 1927
                      </span>
                      <h3 className="font-serif text-2xl font-bold text-white">The Baktoo Family Heritage</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="font-serif text-3xl text-white">Nearly a century of subcontinent exploration</h2>
                    <p className="font-display text-sm leading-relaxed text-white/80">
                      With regional headquarters in Delhi, Kashmir and Ladakh, we have organized guaranteed departure safaris, treks, and cultural circuits for travellers worldwide.
                    </p>
                    <ul className="space-y-2 text-xs font-display text-white/70">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                        Guaranteed departures for solo travellers or groups up to 15
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                        Escorted special-interest and student expeditions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                        Hand-selected heritage hotels and private houseboats
                      </li>
                    </ul>
                    <div className="pt-2">
                      <Link
                        href="/about"
                        onClick={onClose}
                        className="btn-primary text-xs px-5 py-2.5"
                      >
                        Read our story &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CONTACT TAB SHOWCASE */}
            {activeTab === "contact" && (
              <div className="space-y-6 animate-fade-in">
                <div className="rounded-[1rem] border border-white/15 bg-forest/50 p-8">
                  <span className="text-xs font-display uppercase tracking-[0.25em] text-brass mb-2 block">
                    Travel Designer Concierge
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white mb-4">
                    Plan Your Tailor-Made Subcontinent Journey
                  </h2>
                  <p className="font-display text-base leading-relaxed text-white/80 max-w-xl mb-6">
                    Tell us your preferred travel dates, party size, and travel pace. Our destination specialists will shape an itinerary drawn from our brochure catalogue.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link
                      href="/enquiry"
                      onClick={onClose}
                      className="btn-primary"
                    >
                      Start your enquiry &rarr;
                    </Link>
                    <Link
                      href="/contact"
                      onClick={onClose}
                      className="btn-ghost-dark"
                    >
                      Contact information
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Luxury Bottom Bar inside Mega Menu */}
      <div className="border-t border-white/10 bg-black/90 py-6 px-6 md:px-12 mt-auto">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-display text-white/50 tracking-wider uppercase">
          <p>India Nepal Travel Organisation &mdash; Specialist Travel Since 1927</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/explore" onClick={onClose} className="hover:text-brass transition-colors">
              All 27 Tours
            </Link>
            <Link href="/houseboats" onClick={onClose} className="hover:text-brass transition-colors">
              Houseboats
            </Link>
            <Link href="/about" onClick={onClose} className="hover:text-brass transition-colors">
              About Us
            </Link>
            <Link href="/contact" onClick={onClose} className="hover:text-brass transition-colors">
              Contact
            </Link>
            <Link href="/enquiry" onClick={onClose} className="text-brass hover:text-white transition-colors font-semibold">
              Plan A Trip &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
