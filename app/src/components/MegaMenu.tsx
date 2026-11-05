"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { DESTINATIONS, EXPERIENCES } from "@/data/siteContent";
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
  const [isOpen, setIsOpen] = useState(false);

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

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    } else {
      const t = setTimeout(() => setIsOpen(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 120);
    return () => clearTimeout(t);
  }, [query]);

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

  if (!isOpen) return null;

  const pinnedItems = pins.map(resolveItem).filter(Boolean) as SearchEntry[];
  const recentItems = recentSlugs.map(resolveItem).filter(Boolean) as SearchEntry[];

  const tabContent = {
    destinations: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Eight Iconic Regions</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">Destinations We Operate In</h2>
          </div>
          <Link href="/explore" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">View all regions →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {DESTINATIONS.slice(0, 6).map((dest) => {
            const pinned = mounted && isPinned(dest.href);
            return (
              <div key={dest.name} className="relative group">
                <Link
                  href={dest.href}
                  onClick={() => handleLinkClick(dest.href)}
                  className="card-elevated block aspect-[4/3] overflow-hidden"
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
                    <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-wild-orange mb-1 drop-shadow-md">{dest.tagline}</span>
                    <h3 className="font-serif text-lg md:text-xl font-light text-white mb-1">{dest.name}</h3>
                    <p className="text-[0.75rem] font-display text-white/70 line-clamp-2">{dest.blurb}</p>
                  </div>
                </Link>
                {pinned && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePinToggle(dest.href); }}
                    aria-label={`Unpin ${dest.name}`}
                    className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm text-white/80 hover:text-wild-orange hover:bg-white/10 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </>
    ),

    journeys: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Curated Itineraries</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">Journeys & Tours</h2>
          </div>
          <Link href="/explore" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">View all journeys →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {JOURNEY_CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              onClick={() => handleLinkClick(cat.href)}
              className="card-elevated group relative aspect-[4/3] overflow-hidden"
            >
              <Image src={cat.image} alt={cat.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-start">
                <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-wild-orange mb-1 drop-shadow-md">{cat.count}</span>
                <h3 className="font-serif text-lg md:text-xl font-light text-white mb-1">{cat.name}</h3>
                <p className="text-[0.75rem] font-display text-white/70 line-clamp-2">{cat.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </>
    ),

    experiences: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Curated Experiences</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">Immersive Moments</h2>
          </div>
          <Link href="/experiences" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">View all experiences →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
          {EXPERIENCES.map((exp) => (
            <Link
              key={exp.title}
              href={exp.href}
              onClick={() => handleLinkClick(exp.href)}
              className="card-elevated group relative aspect-[4/3] overflow-hidden"
            >
              <Image src={exp.image} alt={exp.title} fill sizes="(min-width: 1024px) 25vw, (min-width: 768px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-start">
                <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-wild-orange mb-1 drop-shadow-md">{exp.locations}</span>
                <h3 className="font-serif text-lg md:text-xl font-light text-white mb-1">{exp.title}</h3>
                <p className="text-[0.75rem] font-display text-white/70 line-clamp-2">{exp.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </>
    ),

    houseboats: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Signature Stays</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">Kashmir Houseboats</h2>
          </div>
          <Link href="/houseboats" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">View all houseboats →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-in">
          <Link
            href="/houseboats"
            onClick={onClose}
            className="card-elevated group relative aspect-[4/3] overflow-hidden"
          >
            <Image src="/images/destinations/kashmir-shikara.jpg" alt="Dal Lake Houseboats" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
            <div className="absolute inset-0 p-5 flex flex-col justify-start">
              <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-wild-orange mb-1 drop-shadow-md">Dal Lake, Srinagar</span>
              <h3 className="font-serif text-xl md:text-2xl font-light text-white mb-1">Heritage Houseboats</h3>
              <p className="text-[0.875rem] font-display text-white/70 leading-relaxed">Cedarwood carved interiors, private decks, and butler service on the historic Dal Lake.</p>
            </div>
          </Link>
          <Link
            href="/houseboats?type=premium"
            onClick={onClose}
            className="card-elevated group relative aspect-[4/3] overflow-hidden"
          >
            <Image src="/images/destinations/kashmir-houseboat-interior.jpg" alt="Premium Houseboat Interior" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/30 via-50% to-transparent transition-colors group-hover:from-black/90" />
            <div className="absolute inset-0 p-5 flex flex-col justify-start">
              <span className="text-[0.65rem] font-display font-medium uppercase tracking-[0.25em] text-wild-orange mb-1 drop-shadow-md">Nigeen Lake, Srinagar</span>
              <h3 className="font-serif text-xl md:text-2xl font-light text-white mb-1">Premium Houseboats</h3>
              <p className="text-[0.875rem] font-display text-white/70 leading-relaxed">Quieter waters, larger suites, and bespoke dining on the serene Nigeen Lake.</p>
            </div>
          </Link>
        </div>
      </>
    ),

    about: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Our Legacy</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">The Baktoo Family</h2>
          </div>
          <Link href="/about" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">Read full story →</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src="/images/destinations/baktoo-heritage.jpg" alt="Baktoo family heritage" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </div>
          <div className="space-y-6 pt-4 lg:pt-12">
            <p className="lead-editorial text-lg md:text-xl text-white/80 leading-relaxed">"For nearly a century, our family has pioneered journeys across the Indian subcontinent, combining deep local knowledge with uncompromising standards of comfort and authenticity."</p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Specialist travel since 1927</p>
                  <p className="text-sm font-display text-white/60">Nearly a century of pioneering journeys</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Small groups, maximum 15</p>
                  <p className="text-sm font-display text-white/60">Intimate experiences, personal attention</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Guaranteed departures</p>
                  <p className="text-sm font-display text-white/60">No minimum group quotas required</p>
                </div>
              </div>
            </div>
            <Link href="/enquiry" onClick={onClose} className="btn-tertiary inline-flex w-full justify-center py-3 mt-4">
              Plan a custom journey →
            </Link>
          </div>
        </div>
      </>
    ),

    contact: (
      <>
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange">Get In Touch</p>
            <h2 className="font-serif text-2xl md:text-3xl text-white mt-1 font-light tracking-tight">Plan Your Trip</h2>
          </div>
          <Link href="/enquiry" onClick={onClose} className="text-xs font-display uppercase tracking-widest text-white/70 hover:text-wild-orange transition-colors">Direct enquiry →</Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <p className="lead-editorial text-lg md:text-xl text-white/80 leading-relaxed">"Every journey begins with a conversation. Our travel designers craft each itinerary around your interests, pace, and preferred travel style."</p>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Email Us</p>
                  <p className="text-sm font-display text-white/60">journeys@ksworldadventure.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Call Us</p>
                  <p className="text-sm font-display text-white/60">+91 194 245 6789</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-wild-orange/50 hover:bg-white/10 transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="font-serif text-lg font-light text-white">Visit Our Office</p>
                  <p className="text-sm font-display text-white/60">Lal Chowk, Srinagar, Kashmir 190001</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image src="/images/destinations/contact-office.jpg" alt="Our Srinagar office" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>
      </>
    ),
  } as const;

  return (
    <div
      id="mega-menu"
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation menu"
      className="fixed inset-0 z-[60] flex flex-col bg-wild-black text-white overflow-y-auto"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative border-b border-white/10 bg-wild-black/95 px-6 md:px-12 py-5 sticky top-0 z-20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="group circular-btn flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-90">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
            <span className="hidden text-xs font-display font-medium uppercase tracking-[2.4px] md:inline">Close</span>
          </button>

          <div className="justify-self-center flex-shrink-0">
            <Link href="/" onClick={onClose} className="block" aria-label="Home">
              <img src="/logo.png" alt="" className="h-10 md:h-12 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative hidden md:block">
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Quick jump…"
                aria-label="Search menu"
                className="w-56 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-display text-white placeholder:text-white/40 focus:border-wild-orange focus:outline-none focus:ring-1 focus:ring-wild-orange transition-all duration-200"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-wild-orange transition-colors"
                >
                  ×
                </button>
              )}
            </div>
            <Link href="/enquiry" onClick={onClose} className="btn-tertiary px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] hidden sm:inline-flex">
              Enquire now
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden px-6 pt-4 relative">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick jump…"
            aria-label="Search menu"
            className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-display text-white placeholder:text-white/40 focus:border-wild-orange focus:outline-none focus:ring-1 focus:ring-wild-orange transition-all duration-200"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-wild-orange transition-colors">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 md:px-12 py-10 lg:py-14">
        {mounted && (recentItems.length > 0 || pinnedItems.length > 0) && (
          <div className="mb-8 space-y-4 animate-fade-in">
            {pinnedItems.length > 0 && (
              <div>
                <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange mb-2">Pinned</p>
                <div className="flex flex-wrap gap-2">
                  {pinnedItems.map((it) => (
                    <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-wild-orange/40 bg-wild-orange/10 px-3 py-1.5 text-xs font-display text-white hover:bg-wild-orange/20 transition-all duration-200">
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
                    <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-display text-white/80 hover:text-white hover:border-white/30 transition-all duration-200">
                      {it.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {debouncedQuery ? (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs font-display uppercase tracking-widest text-white/50">
              {filteredEntries.length} match{filteredEntries.length === 1 ? "" : "es"}
            </p>
            {filteredEntries.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-white/60 font-display">No matches</p>
                <button type="button" onClick={() => setQuery("")} className="mt-3 text-xs text-wild-orange hover:text-white transition-colors">
                  Reset search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-in">
                {filteredEntries.map((e) => (
                  <Link
                    key={e.href + e.label}
                    href={e.href}
                    onClick={() => handleLinkClick(e.href)}
                    className="card-elevated group relative aspect-[4/3] overflow-hidden"
                  >
                    {e.image && (
                      <Image src={e.image} alt={e.label} fill sizes="25vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                      <span className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-wild-orange mb-1">{e.group}</span>
                      <h3 className="font-serif text-lg font-bold uppercase tracking-wider text-white">{e.label}</h3>
                      {e.blurb && <p className="text-[0.75rem] font-display text-white/70 line-clamp-1 mt-1">{e.blurb}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start animate-fade-in">
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
                        className={`w-full group flex items-center justify-between py-3.5 border-b border-white/10 text-left transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                          isActive ? "text-wild-orange border-wild-orange pl-2 font-semibold" : "text-white/60 hover:text-white hover:pl-1 font-medium"
                        }`}
                      >
                        <span className="text-sm lg:text-base font-display uppercase tracking-[2.4px]">{tab.label}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-[0.65rem] font-display uppercase tracking-widest text-white/40 group-hover:text-white/70">{tab.badge}</span>
                          <span className={`text-sm transition-transform duration-200 ${isActive ? "translate-x-1 text-wild-orange font-bold" : "text-white/20 group-hover:text-white"}`}>→</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 rounded-2xl border border-white/10 bg-wild-dark/50 p-6 hidden lg:block">
                <p className="text-xs font-display uppercase tracking-[0.2em] text-wild-orange mb-2">Specialist Travel Since 1927</p>
                <p className="text-xs font-display text-white/80 leading-relaxed mb-4">
                  Tailor-made itineraries and small-group journeys up to 15 travellers, with departures operating without minimum group quotas (subject to seasonal weather safety).
                </p>
                <Link href="/enquiry" onClick={onClose} className="btn-tertiary w-full justify-center text-xs py-2">
                  Plan a custom journey →
                </Link>
              </div>
            </nav>

            <div className="lg:col-span-8" role="tabpanel" id={`panel-${displayTab}`} aria-labelledby={`tab-${displayTab}`}>
              <div key={displayTab} className="animate-fade-in space-y-6">
                {tabContent[displayTab]}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}