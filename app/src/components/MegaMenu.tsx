"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import { DESTINATIONS, EXPERIENCES } from "@/data/siteContent";
import { BRAND } from "@/data/brandConfig";
import { getRecentSlugs, pushRecent, getPins, togglePin, isPinned } from "@/lib/menuStorage";

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
  { name: "Stopovers", count: "6 packages", blurb: "Delhi, Bombay, Leh, and Kathmandu cultural city stopovers.", image: "/images/destinations/delhi-monument.jpg", href: "/explore?category=Stopovers" },
  { name: "Images of India", count: "7 packages", blurb: "Golden Triangle, Goa, Kerala backwaters, and Kashmir circuits.", image: "/images/destinations/jodhpur-fort.jpg", href: "/explore?category=Images%20of%20India" },
  { name: "India Tours", count: "3 packages", blurb: "Comprehensive North and South India highlight circuits.", image: "/images/destinations/kerala-backwaters.jpg", href: "/explore?category=India%20Tours" },
  { name: "Himalayan Expeditions", count: "3 packages", blurb: "High-altitude trekking in Markha Valley and Zanskar.", image: "/images/destinations/markha-valley.jpg", href: "/explore?category=Himalayan%20Expeditions" },
  { name: "Mini Trek in Kashmir", count: "3 packages", blurb: "Alpine lake trails, pine meadows, and Gulmarg skiing.", image: "/images/destinations/kashmir-shikara.jpg", href: "/explore?category=Mini%20Trek%20in%20Kashmir" },
  { name: "Nepal Adventure", count: "5 packages", blurb: "Himalayan combination treks, Trisuli rafting, and wildlife.", image: "/images/destinations/nepal-trek.jpg", href: "/explore?category=Nepal%20Adventure" },
];

interface SearchEntry {
  label: string;
  href: string;
  image?: string;
  blurb?: string;
  group: string;
  tab: MenuTab;
}

export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const tabListRef = useRef<HTMLUListElement>(null);
  const [activeTab, setActiveTab] = useState<MenuTab>("destinations");
  const [hoveredTab, setHoveredTab] = useState<MenuTab | null>(null);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [pins, setPins] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      setRecentSlugs(getRecentSlugs());
      setPins(getPins());
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 120);
    return () => clearTimeout(t);
  }, [query]);

  // storage event sync
  useEffect(() => {
    const onStorage = () => {
      setRecentSlugs(getRecentSlugs());
      setPins(getPins());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input:not([disabled])',
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

  const handleTabKeyDown = (e: React.KeyboardEvent, idx: number) => {
    const tabs = MENU_TABS;
    let nextIdx = idx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      nextIdx = (idx + 1) % tabs.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      nextIdx = (idx - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIdx = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIdx = tabs.length - 1;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveTab(tabs[idx].key);
      return;
    } else {
      return;
    }
    setActiveTab(tabs[nextIdx].key);
    const btn = tabListRef.current?.querySelectorAll<HTMLButtonElement>("[data-tab-btn]")[nextIdx];
    btn?.focus();
  };

  const searchEntries = useMemo<SearchEntry[]>(() => {
    const entries: SearchEntry[] = [];
    DESTINATIONS.forEach((d) => entries.push({ label: d.name, href: d.href, image: d.image, blurb: d.blurb, group: "Destinations", tab: "destinations" }));
    JOURNEY_CATEGORIES.forEach((c) => entries.push({ label: c.name, href: c.href, image: c.image, blurb: c.blurb, group: "Journeys", tab: "journeys" }));
    EXPERIENCES.forEach((e) => entries.push({ label: e.title, href: e.href, image: e.image, blurb: e.description, group: "Experiences", tab: "experiences" }));
    entries.push({ label: "Kashmir Houseboats", href: "/houseboats", image: "/images/destinations/kashmir-shikara.jpg", blurb: "Cedarwood carved interiors on Dal Lake.", group: "Houseboats", tab: "houseboats" });
    entries.push({ label: "About our heritage", href: "/about", blurb: "The Baktoo family since 1927.", group: "Company", tab: "about" });
    entries.push({ label: "Plan your trip", href: "/enquiry", blurb: "Enquire with a travel designer.", group: "Company", tab: "contact" });
    entries.push({ label: "All journeys", href: "/explore", blurb: "Browse the full catalogue.", group: "Journeys", tab: "journeys" });
    return entries;
  }, []);

  const filteredEntries = useMemo(() => {
    if (!debouncedQuery) return [];
    return searchEntries.filter((e) => (e.label + " " + (e.blurb || "")).toLowerCase().includes(debouncedQuery));
  }, [searchEntries, debouncedQuery]);

  const displayTab = hoveredTab ?? activeTab;

  const resolveItem = (slug: string) => searchEntries.find((e) => e.href === slug);

  const handlePinToggle = (slug: string) => {
    const next = togglePin(slug);
    setPins(next);
  };

  const handleLinkClick = (href: string) => {
    pushRecent(href);
    setRecentSlugs(getRecentSlugs());
    onClose();
  };

  if (!open) return null;

  const pinnedItems = pins.map(resolveItem).filter(Boolean) as SearchEntry[];
  const recentItems = recentSlugs.map(resolveItem).filter(Boolean) as SearchEntry[];

  return (
    <div
      id="mega-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white overflow-y-auto animate-fade-in"
    >
      {/* Header Bar */}
      <div className="border-b border-white/10 bg-black/95 px-6 md:px-12 py-5 sticky top-0 z-20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
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
            <span className="hidden text-xs font-display font-medium uppercase tracking-[2.4px] md:inline">Close</span>
          </button>

          <div className="justify-self-center">
            <BrandMark />
          </div>

          <div className="flex items-center gap-4">
            {/* Inline search */}
            <div className="relative hidden md:block">
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Quick jump…"
                aria-label="Search menu"
                className="w-56 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-display text-white placeholder:text-white/40 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-brass"
                >
                  ×
                </button>
              )}
            </div>
            <Link href="/enquiry" onClick={onClose} className="btn-ghost-dark px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em]">
              Enquire now
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile search (top) */}
      <div className="md:hidden px-6 pt-4">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick jump…"
            aria-label="Search menu"
            className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-display text-white placeholder:text-white/40 focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-brass">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-10 lg:py-14">
        {/* Recent + Pinned strips */}
        {mounted && (recentItems.length > 0 || pinnedItems.length > 0) && (
          <div className="mb-8 space-y-4">
            {pinnedItems.length > 0 && (
              <div>
                <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-2">Pinned</p>
                <div className="flex flex-wrap gap-2">
                  {pinnedItems.map((it) => (
                    <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs font-display text-white hover:bg-brass/20">
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {recentItems.length > 0 && (
              <div>
                <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-white/40 mb-2">Recently viewed</p>
                <div className="flex flex-wrap gap-2">
                  {recentItems.map((it) => (
                    <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-display text-white/80 hover:text-white hover:border-white/30">
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {debouncedQuery ? (
          <div className="space-y-4">
            <p className="text-xs font-display uppercase tracking-widest text-white/50">
              {filteredEntries.length} match{filteredEntries.length === 1 ? "" : "es"}
            </p>
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-white/60 font-display">No matches</p>
                <button type="button" onClick={() => setQuery("")} className="mt-3 text-xs text-brass hover:text-white">
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEntries.map((e) => (
                  <Link
                    key={e.href + e.label}
                    href={e.href}
                    onClick={() => handleLinkClick(e.href)}
                    className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50"
                  >
                    {e.image && (
                      <Image src={e.image} alt={e.label} fill sizes="25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-1">{e.group}</span>
                      <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">{e.label}</h3>
                      {e.blurb && <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">{e.blurb}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            {/* Left Column: Category List */}
            <nav className="lg:col-span-4 lg:border-r lg:border-white/10 lg:pr-8" aria-label="Mega menu categories">
              <p className="text-[0.7rem] font-display uppercase tracking-[0.3em] text-white/40 mb-3">Explore Our Subcontinent</p>
              <ul ref={tabListRef} className="space-y-1" role="tablist" aria-orientation="vertical">
                {MENU_TABS.map((tab, idx) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <li key={tab.key} role="presentation">
                      <button
                        type="button"
                        data-tab-btn
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`panel-${tab.key}`}
                        id={`tab-${tab.key}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => setActiveTab(tab.key)}
                        onMouseEnter={() => setHoveredTab(tab.key)}
                        onMouseLeave={() => setHoveredTab(null)}
                        onFocus={() => setHoveredTab(tab.key)}
                        onBlur={() => setHoveredTab(null)}
                        onKeyDown={(e) => handleTabKeyDown(e, idx)}
                        className={`w-full group flex items-center justify-between py-4 border-b border-white/10 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                          isActive ? "text-brass border-brass pl-2 font-semibold" : "text-white/60 hover:text-white hover:pl-1 font-medium"
                        }`}
                      >
                        <span className="text-sm lg:text-base font-display uppercase tracking-[2.4px]">{tab.label}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-[0.65rem] font-display uppercase tracking-widest text-white/40 group-hover:text-white/70">{tab.badge}</span>
                          <span className={`text-sm transition-transform duration-200 ${isActive ? "translate-x-1 text-brass font-bold" : "text-white/20 group-hover:text-white"}`}>→</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 rounded-[1rem] border border-white/10 bg-forest/40 p-6 hidden lg:block">
                <p className="text-xs font-display uppercase tracking-[0.2em] text-brass mb-2">Specialist Travel Since 1927</p>
                <p className="text-xs font-display text-white/80 leading-relaxed mb-4">
                  Tailor-made itineraries and small-group journeys up to 15 travellers, with departures operating without minimum group quotas (subject to seasonal weather safety).
                </p>
                <Link href="/enquiry" onClick={onClose} className="btn-tertiary w-full justify-center text-xs py-2">
                  Plan a custom journey →
                </Link>
              </div>
            </nav>

            {/* Right Column: showcase for displayTab */}
            <div className="lg:col-span-8" role="tabpanel" id={`panel-${displayTab}`} aria-labelledby={`tab-${displayTab}`}>
              <div key={displayTab} className="animate-fade-in space-y-6">
                {displayTab === "destinations" && (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">Eight Iconic Regions</p>
                        <h2 className="font-serif text-2xl text-white mt-1">Destinations We Operate In</h2>
                      </div>
                      <Link href="/explore" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-brass transition-colors">View all regions →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {DESTINATIONS.slice(0, 6).map((dest) => {
                        const pinned = mounted && isPinned(dest.href);
                        return (
                          <div key={dest.name} className="relative group">
                            <Link
                              href={dest.href}
                              onClick={() => handleLinkClick(dest.href)}
                              className="block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl"
                            >
                              <Image src={dest.image} alt={dest.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
                              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-start">
                                <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-brass mb-1 drop-shadow-md">{dest.tagline}</span>
                                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase tracking-wider text-white drop-shadow-lg">{dest.name}</h3>
                                <span className="mt-auto text-xs font-display text-white/80 group-hover:text-brass flex items-center gap-1 transition-colors drop-shadow-md">Explore region →</span>
                              </div>
                            </Link>
                            <button
                              type="button"
                              onClick={() => handlePinToggle(dest.href)}
                              aria-label={pinned ? "Unpin destination" : "Pin destination"}
                              className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white/70 backdrop-blur hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                            >
                              {pinned ? "★" : "☆"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {displayTab === "journeys" && (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">Brochure Catalogue</p>
                        <h2 className="font-serif text-2xl text-white mt-1">27 Curated Itineraries</h2>
                      </div>
                      <Link href="/explore" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-brass hover:text-white transition-colors">View all 27 tours →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {JOURNEY_CATEGORIES.map((cat) => (
                        <Link key={cat.name} href={cat.href} onClick={() => handleLinkClick(cat.href)} className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl">
                          <Image src={cat.image} alt={cat.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-colors group-hover:from-black/95" />
                          <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-1">{cat.count}</span>
                            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">{cat.name}</h3>
                            <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">{cat.blurb}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {displayTab === "experiences" && (
                  <>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <p className="text-xs font-display uppercase tracking-[0.25em] text-brass">Signature Adventures</p>
                        <h2 className="font-serif text-2xl text-white mt-1">Experience Real, Raw Nature</h2>
                      </div>
                      <Link href="/explore" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-brass transition-colors">All activities →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {EXPERIENCES.map((exp) => (
                        <Link key={exp.title} href={exp.href} onClick={() => handleLinkClick(exp.href)} className="group relative block aspect-[4/3] overflow-hidden rounded-[0.875rem] border border-white/10 bg-charcoal shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-brass/50 hover:shadow-2xl">
                          <Image src={exp.image} alt={exp.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 transition-colors group-hover:from-black/95" />
                          <div className="absolute inset-0 p-5 flex flex-col justify-end">
                            <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-1">{exp.locations}</span>
                            <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">{exp.title}</h3>
                            <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">{exp.description}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}

                {displayTab === "houseboats" && (
                  <div className="space-y-6">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[1rem] border border-white/15 bg-charcoal shadow-2xl">
                      <Image src="/images/destinations/kashmir-shikara.jpg" alt="Kashmir Houseboats on Dal Lake" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                      <div className="absolute inset-0 p-8 flex flex-col justify-end max-w-xl">
                        <span className="text-xs font-display uppercase tracking-[0.3em] text-brass mb-2">Exclusive Accommodation</span>
                        <h2 className="font-serif text-3xl font-bold text-white mb-3">Kashmir Houseboat Stays on Dal Lake</h2>
                        <p className="font-display text-sm leading-relaxed text-white/80 mb-6">Cedarwood carved interiors, tranquil lake waters, and personal shikara transfers. Operating since 1927 in Srinagar, Kashmir.</p>
                        <div className="flex flex-wrap gap-4">
                          <Link href="/houseboats" onClick={() => handleLinkClick("/houseboats")} className="btn-ghost-dark text-xs px-5 py-2.5">Explore houseboats →</Link>
                          <Link href="/enquiry" onClick={onClose} className="btn-ghost-dark text-xs px-5 py-2.5">Enquire now →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {displayTab === "about" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] border border-white/15 bg-charcoal shadow-2xl">
                        <Image src="/images/destinations/ladakh-monastery.jpg" alt="Ladakh monastery heritage" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <span className="text-xs font-display uppercase tracking-[0.25em] text-brass mb-1">Est. 1927</span>
                          <h3 className="font-serif text-2xl font-bold text-white">The Baktoo Family Heritage</h3>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h2 className="font-serif text-3xl text-white">Nearly a century of subcontinent exploration</h2>
                        <p className="font-display text-sm leading-relaxed text-white/80">
                          Descended from the Baktoo family&apos;s pioneering operations across Kashmir, Ladakh and Northern India since 1927, offering private departures and small-group expeditions.
                        </p>
                        <ul className="space-y-2 text-xs font-display text-white/70">
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brass" />No minimum passenger quotas for departures (weather/pass permitting)</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brass" />Escorted special-interest and student expeditions</li>
                          <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-brass" />Hand-selected heritage hotels and private houseboats</li>
                        </ul>
                        <div className="pt-2">
                          <Link href="/about" onClick={() => handleLinkClick("/about")} className="btn-ghost-dark text-xs px-5 py-2.5">Read our story →</Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {displayTab === "contact" && (
                  <div className="space-y-6">
                    <div className="rounded-[1rem] border border-white/15 bg-forest/50 p-8">
                      <span className="text-xs font-display uppercase tracking-[0.25em] text-brass mb-2 block">Travel Designer Concierge</span>
                      <h2 className="font-serif text-3xl font-bold text-white mb-4">Plan Your Tailor-Made Subcontinent Journey</h2>
                      <p className="font-display text-base leading-relaxed text-white/80 max-w-xl mb-6">
                        Tell us your preferred travel dates, party size, and travel pace. Our destination specialists will shape an itinerary drawn from our brochure catalogue.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <Link href="/enquiry" onClick={onClose} className="btn-ghost-dark">Start your enquiry →</Link>
                        <Link href="/contact" onClick={() => handleLinkClick("/contact")} className="btn-ghost-dark">Contact information</Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-black/90 py-6 px-6 md:px-12 mt-auto">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-display text-white/50 tracking-wider uppercase">
          <p>{BRAND.name} • {BRAND.operatorName} — Specialist Travel Since 1927</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/explore" onClick={onClose} className="hover:text-brass transition-colors">All 27 Tours</Link>
            <Link href="/houseboats" onClick={onClose} className="hover:text-brass transition-colors">Houseboats</Link>
            <Link href="/about" onClick={onClose} className="hover:text-brass transition-colors">About Us</Link>
            <Link href="/contact" onClick={onClose} className="hover:text-brass transition-colors">Contact</Link>
            <Link href="/enquiry" onClick={onClose} className="text-brass hover:text-white transition-colors font-semibold">Plan A Trip →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
