"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_CATEGORIES, DESTINATIONS, EXPERIENCES } from "@/data/siteContent";
import { getRecentSlugs, pushRecent, getPins, togglePin, isPinned } from "@/lib/menuStorage";

interface NavItem {
  label: string;
  href: string;
  image?: string;
  group?: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  icon?: React.ReactNode;
}

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

// Extended nav categories with icons
const MOBILE_NAV_CATEGORIES: NavGroup[] = [
  {
    label: "Destinations",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    items: [
      { label: "All destinations", href: "/explore", group: "Destinations" },
      ...DESTINATIONS.map((d) => ({ label: d.name, href: d.href, image: d.image, group: "Destinations" })),
    ],
  },
  {
    label: "Journeys",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    items: [
      { label: "All journeys", href: "/explore", group: "Journeys" },
      { label: "Stopovers", href: "/explore?category=Stopovers", group: "Journeys" },
      { label: "Images of India", href: "/explore?category=Images%20of%20India", group: "Journeys" },
      { label: "India tours", href: "/explore?category=India%20Tours", group: "Journeys" },
      { label: "Himalayan expeditions", href: "/explore?category=Himalayan%20Expeditions", group: "Journeys" },
      { label: "Mini trek in Kashmir", href: "/explore?category=Mini%20Trek%20in%20Kashmir", group: "Journeys" },
      { label: "Nepal adventure", href: "/explore?category=Nepal%20Adventure", group: "Journeys" },
    ],
  },
  {
    label: "Experiences",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    items: EXPERIENCES.map((e) => ({ label: e.title, href: e.href, image: e.image, group: "Experiences" })),
  },
  {
    label: "Company",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    items: [
      { label: "About us", href: "/about", group: "Company" },
      { label: "Kashmir houseboats", href: "/houseboats", image: "/images/destinations/kashmir-shikara.jpg", group: "Company" },
      { label: "Plan your trip", href: "/enquiry", group: "Company" },
      { label: "Contact", href: "/contact", group: "Company" },
    ],
  },
];

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    setMounted(true);
    setRecentSlugs(getRecentSlugs());
    setPins(getPins());
  }, []);

  useEffect(() => {
    if (open) {
      setIsOpen(true);
    } else {
      const t = setTimeout(() => setIsOpen(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

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
    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;
      if (deltaX > 80 && Math.abs(deltaY) < 50) {
        close();
      }
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [open, close]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  const toggle = (index: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleLinkClick = (href: string) => {
    pushRecent(href);
    setRecentSlugs(getRecentSlugs());
    close();
  };

  const handlePinToggle = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = togglePin(slug);
    setPins(next);
  };

  if (!isOpen) return null;

  const allEntries = MOBILE_NAV_CATEGORIES.flatMap((g) => g.items);
  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? MOBILE_NAV_CATEGORIES.map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
      })).filter((g) => g.items.length > 0)
    : MOBILE_NAV_CATEGORIES;

  const filteredFlat = q ? allEntries.filter((it) => it.label.toLowerCase().includes(q)) : [];

  const resolveItem = (slug: string) => allEntries.find((it) => it.href === slug);
  const recentItems = mounted ? recentSlugs.map(resolveItem).filter((x): x is NavItem => Boolean(x)) : [];
  const pinnedItems = mounted ? pins.map(resolveItem).filter((x): x is NavItem => Boolean(x)) : [];

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      className="fixed inset-0 z-[60] flex flex-col bg-wild-black text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Main navigation"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        style={{ opacity: isOpen ? 1 : 0 }}
        onClick={close}
        aria-hidden="true"
      />

      <div className="relative border-b border-white/10 bg-wild-black/95 px-5 py-4 sticky top-0 z-20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="group circular-btn flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:rotate-90">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="justify-self-center flex-shrink-0">
            <Link href="/" onClick={close} className="block" aria-label="Home">
              <img src="/logo.png" alt="" className="h-9 w-auto" />
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/enquiry" onClick={close} className="btn-tertiary px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Enquire
            </Link>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2 relative">
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Quick jump…"
            aria-label="Search menu"
            className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-display text-white placeholder:text-white/40 focus:border-wild-orange focus:outline-none focus:ring-1 focus:ring-wild-orange transition-all duration-200 pr-12"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-wild-orange transition-colors">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-10">
        {mounted && (recentItems.length > 0 || pinnedItems.length > 0) && (
          <div className="mb-6 space-y-3 animate-fade-in">
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

        {q ? (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs font-display uppercase tracking-widest text-white/50 px-1">
              {filteredFlat.length} match{filteredFlat.length === 1 ? "" : "es"}
            </p>
            {filteredFlat.length === 0 ? (
              <div className="py-8 text-center px-4">
                <p className="text-white/60 font-display">No matches</p>
                <button type="button" onClick={() => setQuery("")} className="mt-3 text-xs text-wild-orange hover:text-white transition-colors">
                  Reset search
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-1">
                {filteredFlat.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => handleLinkClick(item.href)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-wild-darker/50 hover:border-wild-orange/50 hover:bg-white/5 transition-all duration-200 group"
                  >
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.label}
                        width={56}
                        height={42}
                        className="h-14 w-14 rounded-lg object-cover flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-display text-sm font-medium text-white truncate">{item.label}</p>
                      {item.group && <p className="text-[0.65rem] font-display uppercase tracking-[0.2em] text-wild-orange/80">{item.group}</p>}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-white/40 group-hover:text-wild-orange transition-colors">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <nav className="space-y-1 animate-fade-in" aria-label="Mobile navigation">
            {filteredGroups.map((group, groupIdx) => (
              <div key={group.label} className="border border-white/10 rounded-xl overflow-hidden bg-wild-darker/30">
                <button
                  type="button"
                  onClick={() => toggle(groupIdx)}
                  className="w-full flex items-center justify-between px-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2 focus-visible:ring-offset-wild-black"
                  aria-expanded={expanded.has(groupIdx)}
                >
                  <span className="font-display text-sm font-medium uppercase tracking-[2px] text-white flex items-center gap-3">
                    {group.icon && (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 group-hover:text-white transition-colors">
                        {group.icon}
                      </span>
                    )}
                    {group.label}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`flex-shrink-0 text-white/40 transition-transform duration-200 ${expanded.has(groupIdx) ? "rotate-180" : ""}`}
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                <div
                  className={`menu-accordion overflow-hidden transition-all duration-300 ease-out ${expanded.has(groupIdx) ? "menu-accordion-expanded" : "menu-accordion-collapsed"}`}
                  role="region"
                  aria-label={`${group.label} submenu`}
                >
                  <div className="px-4 pb-4 pt-2 space-y-1 border-t border-white/5">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => handleLinkClick(item.href)}
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-display text-white/70 hover:text-white hover:bg-white/5 transition-all duration-150 group"
                      >
                        <span>{item.label}</span>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.label}
                            width={32}
                            height={24}
                            className="h-6 w-8 rounded object-cover flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2"
                          />
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-white/10 space-y-3 animate-fade-in">
              <Link
                href="/enquiry"
                onClick={close}
                className="btn-primary w-full justify-center py-4 text-sm"
              >
                Plan Your Trip
              </Link>
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-wild-darker/50">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-wild-orange/20 text-wild-orange">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-serif text-base font-light text-white">Speak with a specialist</p>
                  <p className="text-[0.7rem] font-display uppercase tracking-[0.2em] text-white/50">Mon–Sat, 9am–7pm IST</p>
                </div>
                <a href="tel:+911942456789" className="text-sm font-display text-wild-orange hover:text-white transition-colors">
                  +91 194 245 6789
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}