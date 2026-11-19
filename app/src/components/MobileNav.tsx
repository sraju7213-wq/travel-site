"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";
import { getRecentSlugs, pushRecent, getPins } from "@/lib/menuStorage";
import { CONTACT, NAV_GROUPS, type NavLink } from "@/lib/navigation";
import { getAllPackages, getPackageCardImage } from "@/data/catalogue";
import { cleanDuration } from "@/lib/packageDisplay";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Every journey, so the quick-jump box can find a package by name or code. */
const PACKAGE_LINKS: NavLink[] = getAllPackages().map((pkg) => ({
  label: pkg.title,
  href: `/packages/${pkg.slug}`,
  description: `${pkg.brochure_code} · ${cleanDuration(pkg.duration)}`,
  image: getPackageCardImage(pkg.slug),
}));

type Entry = NavLink & { group: string };

/**
 * MobileNav
 * ---------
 * The full-screen navigation drawer used below the `lg` breakpoint.
 *
 * It replaces the old bare link list with:
 *   - a quick-jump search that covers destinations, journey categories,
 *     experiences and all 27 brochure packages,
 *   - collapsible groups so the drawer stays scannable on a phone,
 *   - recently viewed and pinned shortcuts,
 *   - a persistent "Plan your trip" call to action with the real contact
 *     details.
 *
 * The drawer is a modal dialog: Escape closes it, focus is trapped inside,
 * focus returns to the menu button, and the page behind it cannot scroll.
 */
export default function MobileNav({ open, onClose }: MobileNavProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [recentSlugs, setRecentSlugs] = useState<string[]>([]);
  const [pins, setPins] = useState<string[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useBodyOverflowLock(open);

  // Destinations and Experiences are desktop-only mega-menus; on mobile we
  // surface direct page links instead, so they are excluded from the drawer.
  const mobileGroups = useMemo(
    () => NAV_GROUPS.filter((g) => g.id !== "destinations" && g.id !== "experiences"),
    [],
  );

  /** Company links are surfaced as their own rows (not behind a collapsible)
   *  so each option is directly reachable — see "separate its options". */
  const companyGroup = useMemo(
    () => NAV_GROUPS.find((g) => g.id === "company"),
    [],
  );

  const allEntries = useMemo<Entry[]>(
    () => [
      ...mobileGroups.flatMap((group) =>
        group.links.map((link) => ({ ...link, group: group.label })),
      ),
      ...PACKAGE_LINKS.map((link) => ({ ...link, group: "Journeys" })),
    ],
    [mobileGroups],
  );

  const entriesByHref = useMemo(
    () => new Map(allEntries.map((entry) => [entry.href, entry])),
    [allEntries],
  );

  useEffect(() => {
    const t = window.setTimeout(() => {
      setMounted(true);
      setRecentSlugs(getRecentSlugs());
      setPins(getPins());
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const onStorage = () => {
      setRecentSlugs(getRecentSlugs());
      setPins(getPins());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Focus management: move into the drawer, trap Tab, restore on close.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Swipe right-to-left to dismiss.
  useEffect(() => {
    if (!open) return;
    const onTouchStart = (event: TouchEvent) => {
      touchStartX.current = event.touches[0].clientX;
      touchStartY.current = event.touches[0].clientY;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const deltaX = event.touches[0].clientX - touchStartX.current;
      const deltaY = event.touches[0].clientY - touchStartY.current;
      if (deltaX > 80 && Math.abs(deltaY) < 50) onClose();
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    };
  }, [open, onClose]);

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleLinkClick = useCallback(
    (href: string) => {
      pushRecent(href);
      setRecentSlugs(getRecentSlugs());
      onClose();
    },
    [onClose],
  );

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q) return [];
    return allEntries.filter(
      (entry) =>
        entry.label.toLowerCase().includes(q) ||
        (entry.description ?? "").toLowerCase().includes(q),
    );
  }, [allEntries, q]);

  const visibleGroups = useMemo(
    () =>
      q
        ? mobileGroups.map((group) => ({
            ...group,
            links: group.links.filter(
              (link) =>
                link.label.toLowerCase().includes(q) ||
                (link.description ?? "").toLowerCase().includes(q),
            ),
          })).filter((group) => group.links.length > 0)
        : mobileGroups,
    [q, mobileGroups],
  );

  const recentItems = useMemo(
    () =>
      mounted
        ? recentSlugs
            .map((slug) => entriesByHref.get(slug))
            .filter((entry): entry is Entry => Boolean(entry))
        : [],
    [mounted, recentSlugs, entriesByHref],
  );

  const pinnedItems = useMemo(
    () =>
      mounted
        ? pins.map((slug) => entriesByHref.get(slug)).filter((entry): entry is Entry => Boolean(entry))
        : [],
    [mounted, pins, entriesByHref],
  );

  return (
    <>
      {/* Backdrop — tap to dismiss. Visible as a dimmed sheet on tablets; on
          phones the full-screen panel covers it. */}
      <div
        className="fixed inset-0 z-[59] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        className="fixed inset-0 z-[60] flex flex-col bg-[#0C1617] text-white lg:hidden md:left-auto md:w-[440px] md:max-w-[85vw] md:top-0 md:bottom-0 md:rounded-l-2xl md:shadow-2xl md:animate-slide-in-right"
      >
      {/* Drawer header */}
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#0C1617]/95 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <Link
            href="/"
            onClick={onClose}
            className="shrink-0 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
            aria-label="India Nepal Travel Center — home"
          >
            <Image src="/logo.png" alt="India Nepal Travel Center" width={108} height={36} className="h-8 w-auto" priority />
          </Link>

          <Link
            href="/enquiry"
            onClick={onClose}
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center border border-[var(--color-wild-orange)] px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-wild-orange)] transition-colors hover:bg-[var(--color-wild-orange)] hover:text-[#0C1617] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
          >
            Enquire
          </Link>
        </div>
      </div>

      {/* Quick jump */}
      <div className="px-4 pt-4">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search journeys, places…"
            aria-label="Search journeys, destinations and experiences"
            className="w-full rounded-lg border border-white/20 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder:text-white/50 focus:border-[var(--color-wild-orange)] focus:outline-none focus:ring-1 focus:ring-[var(--color-wild-orange)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-40 pt-4">
        {mounted && !q && (recentItems.length > 0 || pinnedItems.length > 0) && (
          <div className="mb-6 space-y-4">
            {pinnedItems.length > 0 && (
              <div>
                <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-wild-orange)]">
                  Pinned
                </p>
                <div className="flex flex-wrap gap-2">
                  {pinnedItems.map((entry) => (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => handleLinkClick(entry.href)}
                      className="inline-flex min-h-[36px] items-center rounded-full border border-[var(--color-wild-orange)]/40 bg-[var(--color-wild-orange)]/10 px-3 py-1.5 text-xs text-white transition-colors hover:bg-[var(--color-wild-orange)]/20"
                    >
                      {entry.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {recentItems.length > 0 && (
              <div>
                <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                  Recently viewed
                </p>
                <div className="flex flex-wrap gap-2">
                  {recentItems.map((entry) => (
                    <Link
                      key={entry.href}
                      href={entry.href}
                      onClick={() => handleLinkClick(entry.href)}
                      className="inline-flex min-h-[36px] items-center rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/85 transition-colors hover:border-white/30 hover:text-white"
                    >
                      {entry.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {q ? (
          <div>
            <p className="mb-3 px-1 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
              {results.length} match{results.length === 1 ? "" : "es"}
            </p>
            {results.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="font-serif text-lg text-white/80">No matches</p>
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mt-3 min-h-[44px] rounded-lg px-4 py-2 text-sm text-[var(--color-wild-orange)] transition-colors hover:text-white"
                >
                  Reset search
                </button>
              </div>
            ) : (
              <ul className="space-y-2">
                {results.map((entry) => (
                  <li key={entry.href + entry.label}>
                    <Link
                      href={entry.href}
                      onClick={() => handleLinkClick(entry.href)}
                      className="flex min-h-[56px] items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors hover:border-[var(--color-wild-orange)]/50 hover:bg-white/[0.08]"
                    >
                      {entry.image ? (
                        <Image
                          src={entry.image}
                          alt=""
                          width={48}
                          height={36}
                          className="h-12 w-16 shrink-0 rounded-lg object-cover"
                        />
                      ) : null}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-accent text-xs font-semibold uppercase tracking-[0.14em] text-white">
                          {entry.label}
                        </span>
                        <span className="mt-0.5 block truncate font-sans text-[11px] text-white/65">
                          {entry.description ?? entry.group}
                        </span>
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
                        aria-hidden="true"
                        className="shrink-0 text-white/50"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <nav aria-label="Mobile navigation">
            <ul className="space-y-2">
              {visibleGroups
                .filter((group) => group.id !== "company")
                .map((group) => {
                const isOpen = expanded.has(group.id);
                return (
                  <li key={group.id}>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                      <h2>
                        <button
                          type="button"
                          onClick={() => toggle(group.id)}
                          aria-expanded={isOpen}
                          aria-controls={`mobile-group-${group.id}`}
                          className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-wild-orange)]"
                        >
                          <span className="font-accent text-xs font-semibold uppercase tracking-[0.2em] text-white">
                            {group.label}
                          </span>
                          <span className="flex items-center gap-3">
                            <span className="hidden font-sans text-[10px] uppercase tracking-[0.18em] text-white/60 sm:inline">
                              {group.note}
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
                              aria-hidden="true"
                              className={`shrink-0 text-white/60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </span>
                        </button>
                      </h2>

                      <div
                        id={`mobile-group-${group.id}`}
                        role="region"
                        aria-label={`${group.label} submenu`}
                        className={`overflow-hidden transition-all duration-300 ease-out ${
                          isOpen ? "max-h-[60rem] opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <ul className="space-y-0.5 border-t border-white/10 px-2 pb-3 pt-2">
                          {group.links.map((link) => (
                            <li key={link.href + link.label}>
                              <Link
                                href={link.href}
                                onClick={() => handleLinkClick(link.href)}
                                className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-sans text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                              >
                                <span className="min-w-0">
                                  <span className="block truncate">{link.label}</span>
                                  {link.description ? (
                                    <span className="mt-0.5 block truncate font-sans text-[11px] text-white/60">
                                      {link.description}
                                    </span>
                                  ) : null}
                                </span>
                                {link.image ? (
                                  <Image
                                    src={link.image}
                                    alt=""
                                    width={40}
                                    height={30}
                                    className="h-8 w-10 shrink-0 rounded object-cover"
                                  />
                                ) : null}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {companyGroup && companyGroup.links.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 px-1 font-sans text-[10px] font-semibold uppercase tracking-[0.25em] text-white/60">
                  Company
                </p>
                <ul className="space-y-0.5">
                  {companyGroup.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className="flex min-h-[48px] items-center justify-between gap-3 rounded-lg px-3 py-2.5 font-sans text-sm text-white/85 transition-colors hover:bg-white/5 hover:text-white"
                      >
                        <span className="min-w-0">
                          <span className="block truncate">{link.label}</span>
                          {link.description ? (
                            <span className="mt-0.5 block truncate font-sans text-[11px] text-white/60">
                              {link.description}
                            </span>
                          ) : null}
                        </span>
                        {link.image ? (
                          <Image
                            src={link.image}
                            alt=""
                            width={40}
                            height={30}
                            className="h-8 w-10 shrink-0 rounded object-cover"
                          />
                        ) : null}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 space-y-3">
              <Link
                href="/enquiry"
                onClick={onClose}
                className="inline-flex min-h-[52px] w-full items-center justify-center rounded-lg bg-[var(--color-wild-orange)] px-6 font-accent text-xs font-semibold uppercase tracking-[0.2em] text-[#0C1617] transition-colors hover:bg-[var(--color-wild-orange-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
              >
                Plan your trip
              </Link>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <p className="font-serif text-base font-light text-white">Speak with a specialist</p>
                <p className="mt-0.5 font-sans text-[10px] uppercase tracking-[0.2em] text-white/60">
                  Booking desk · Asia / Australia
                </p>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  <a
                    href={CONTACT.phoneMobileHref}
                    className="font-sans text-sm text-[var(--color-wild-orange)] underline-offset-4 hover:text-white hover:underline"
                  >
                    {CONTACT.phoneMobile}
                  </a>
                  <a
                    href={CONTACT.phoneLandlineHref}
                    className="font-sans text-sm text-[var(--color-wild-orange)] underline-offset-4 hover:text-white hover:underline"
                  >
                    {CONTACT.phoneLandline}
                  </a>
                </div>
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
    </>
  );
}
