"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BrandMark from "./BrandMark";
import { NAV_CATEGORIES, DESTINATIONS } from "@/data/siteContent";
import { getRecentSlugs, pushRecent, getPins, togglePin, isPinned } from "@/lib/menuStorage";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const close = useCallback(() => {
    setExpanded(new Set());
    setQuery("");
    onClose();
  }, [onClose]);

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

  // swipe to close
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const onStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartX.current = t.clientX;
      touchStartY.current = t.clientY;
    };
    const onMove = () => {
      // no-op; allow scroll
    };
    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX.current;
      const dy = t.clientY - touchStartY.current;
      if (dx > 60 && Math.abs(dx) > Math.abs(dy)) {
        close();
      }
      touchStartX.current = null;
      touchStartY.current = null;
    };
    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove", onMove, { passive: true });
    panel.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
    };
  }, [open, close]);


  useEffect(() => {
    const onStorage = () => {
      setRecentSlugs(getRecentSlugs());
      setPins(getPins());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

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

  if (!open) return null;

  const q = query.trim().toLowerCase();
  const filteredGroups = q
    ? NAV_CATEGORIES.map((g) => ({
        ...g,
        items: g.items.filter((it) => it.label.toLowerCase().includes(q)),
      })).filter((g) => g.items.length > 0)
    : NAV_CATEGORIES;

  const allEntries = NAV_CATEGORIES.flatMap((g) => g.items);
  const filteredFlat = q ? allEntries.filter((it) => it.label.toLowerCase().includes(q)) : [];

  const resolveItem = (slug: string) => {
    for (const g of NAV_CATEGORIES) {
      const found = g.items.find((it) => it.href === slug);
      if (found) return found;
    }
    const dest = DESTINATIONS.find((d) => d.href === slug);
    if (dest) return { label: dest.name, href: dest.href };
    return null;
  };
  const recentItems = mounted ? recentSlugs.map(resolveItem).filter((x): x is { label: string; href: string } => Boolean(x)) : [];
  const pinnedItems = mounted ? pins.map(resolveItem).filter((x): x is { label: string; href: string } => Boolean(x)) : [];

  return (
    <div id="mobile-menu" className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Main navigation">
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

        <div className="px-5 pt-4">
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

        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Primary">
          {/* Destination chips */}
          {!q && (
            <div className="mb-6">
              <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-3">Explore Destinations</p>
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
                {DESTINATIONS.slice(0, 5).map((dest) => (
                  <Link
                    key={dest.name}
                    href={dest.href}
                    onClick={() => handleLinkClick(dest.href)}
                    className="group relative flex-shrink-0 w-28 h-20 rounded-[0.75rem] overflow-hidden border border-white/10"
                  >
                    <Image src={dest.image} alt={dest.name} fill sizes="112px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <span className="absolute inset-x-2 bottom-1.5 text-[0.7rem] font-serif font-bold text-white text-center truncate">{dest.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent + Pinned compact */}
          {mounted && (recentItems.length > 0 || pinnedItems.length > 0) && !q && (
            <div className="mb-6 space-y-3">
              {pinnedItems.length > 0 && (
                <div>
                  <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-brass mb-2">Pinned</p>
                  <div className="flex flex-wrap gap-2">
                    {pinnedItems.map((it) => (
                      <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-brass/40 bg-brass/10 px-3 py-1.5 text-xs font-display text-white">
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
                      <Link key={it.href} href={it.href} onClick={() => handleLinkClick(it.href)} className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-display text-white/80">
                        {it.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {q && filteredFlat.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-white/60 font-display text-sm">No matches</p>
              <button type="button" onClick={() => setQuery("")} className="mt-3 text-xs text-brass hover:text-white">Reset search</button>
            </div>
          ) : (
            filteredGroups.map((group, gi) => {
              const isOpen = expanded.has(gi) || !!q;
              return (
                <section key={group.label} className="border-b border-white/10">
                  <h2>
                    <button
                      type="button"
                      onClick={() => toggle(gi)}
                      aria-expanded={isOpen}
                      aria-controls={`mobile-group-${gi}`}
                      className="flex min-h-[44px] w-full items-center justify-between py-4 text-left text-xs font-display font-medium uppercase tracking-[2.4px] text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                    >
                      {group.label}
                      <span aria-hidden="true" className={`text-base font-semibold text-brass transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span>
                    </button>
                  </h2>
                  <div
                    id={`mobile-group-${gi}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[40rem] opacity-100 pb-4" : "max-h-0 opacity-0"}`}
                    style={{ display: isOpen ? undefined : "none" }}
                  >
                    <ul className="space-y-1">
                      {group.items.map((item) => (
                        <li key={`${group.label}-${item.label}`}>
                          <Link
                            href={item.href}
                            onClick={() => handleLinkClick(item.href)}
                            className="block min-h-[44px] py-2 text-sm font-display text-white/80 transition-colors hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              );
            })
          )}

          {/* Pin toggle on destination chips? Add compact pin list for destinations */}
          {mounted && !q && (
            <div className="mt-6">
              <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-white/40 mb-2">Pin destinations</p>
              <div className="flex flex-wrap gap-2">
                {DESTINATIONS.slice(0, 6).map((d) => {
                  const pinned = isPinned(d.href);
                  return (
                    <button
                      key={d.name}
                      type="button"
                      onClick={() => {
                        togglePin(d.href);
                        setPins(getPins());
                      }}
                      className={`rounded-full border px-3 py-1.5 text-xs font-display transition-colors ${pinned ? "border-brass bg-brass/20 text-white" : "border-white/15 bg-white/5 text-white/70"}`}
                    >
                      {pinned ? "★ " : "☆ "}{d.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        <div className="border-t border-white/10 p-5">
          <Link href="/enquiry" onClick={close} className="btn-ghost-dark w-full">
            Enquire now <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
