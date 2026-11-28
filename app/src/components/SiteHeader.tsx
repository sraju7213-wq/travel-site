"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandMark from "./BrandMark";
import DesktopNavPanel from "./DesktopNavPanel";
import { HEADER_LINKS, NAV_GROUPS, type HeaderLink, type NavGroup, type NavLink } from "@/lib/navigation";
import { useCms } from "@/components/cms/CmsProvider";
import { safeCmsHref } from "@/lib/safeCmsHref";

// The drawer is a large client component (quick-jump index of every journey,
// shortcuts, gestures). Loading it on first open keeps it out of the initial
// bundle — the single biggest mobile navigation win on a site with 27 packages.
const MobileNav = dynamic(() => import("./MobileNav"), { ssr: false });

/**
 * SiteHeader
 * ----------
 * One header for every breakpoint.
 *
 * Desktop (lg and up) gets the primary links plus a hover/click dropdown panel
 * for the grouped sections. Below `lg` the header collapses to the brand mark
 * and a single menu button that opens the full-screen drawer.
 *
 * The drawer is only mounted while it is open, so no off-canvas markup is left
 * in the accessibility tree when the menu is closed.
 */
export default function SiteHeader() {
  const { settings, theme } = useCms();
  const cmsHeaderLinks = (settings.navigation.headerLinks ?? []).filter((link) => link.visible !== false);
  const headerLinks: HeaderLink[] = cmsHeaderLinks.length ? cmsHeaderLinks.map((link) => ({ ...link, label: link.label ?? "", href: link.href ?? "/" })) : HEADER_LINKS;
  const cmsGroups = (settings.navigation.groups ?? []).filter((group) => group.visible !== false).map((group): NavGroup => ({ id: group.id, label: group.label, note: group.note ?? "", links: group.links.filter((link) => link.visible !== false).map((link): NavLink => ({ ...link, label: link.label ?? "", href: link.href ?? "/" })) }));
  const navGroups: NavGroup[] = cmsGroups.length ? cmsGroups : NAV_GROUPS;
  const headerCta = settings.navigation.headerCta?.label ? settings.navigation.headerCta : { label: "Enquire", href: "/enquiry" };
  const sticky = settings.navigation.headerSticky !== false && theme.headerAppearance?.sticky !== false;
  const transparent = settings.navigation.headerTransparent !== false && theme.headerAppearance?.transparent !== false;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [pinnedGroup, setPinnedGroup] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpenGroup(null);
      setPinnedGroup(false);
    }, 150);
  }, [clearCloseTimer]);

  const solid = scrolled || mobileOpen || openGroup !== null || !transparent;

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
    };
    // Coalesce scroll events to one state check per frame so mobile scrolling
    // never queues a render for every native scroll tick.
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Close the dropdown when the viewport drops to the mobile layout.
  useEffect(() => {
    if (!openGroup) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (!mq.matches) {
        clearCloseTimer();
        setOpenGroup(null);
        setPinnedGroup(false);
      }
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [openGroup, clearCloseTimer]);

  // Close the dropdown on an outside click or Escape.
  useEffect(() => {
    if (!openGroup) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        clearCloseTimer();
        setOpenGroup(null);
        setPinnedGroup(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setOpenGroup(null);
        setPinnedGroup(false);
        headerRef.current?.querySelector<HTMLButtonElement>(`[data-nav-trigger="${openGroup}"]`)?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openGroup, clearCloseTimer]);

  const closeMobile = useCallback(() => {
    setMobileOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`${sticky ? "fixed" : "relative"} top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          solid
            ? "border-b border-white/10 bg-[var(--cms-header-background,#0C1617)]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--cms-header-background,#0C1617)]/80"
            : "bg-transparent"
        }`}
        role="banner"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 lg:h-20">
            <BrandMark />

            {/* Desktop navigation */}
            <nav className="hidden lg:flex lg:items-center lg:gap-0.5" aria-label="Main navigation">
              {headerLinks.map((link) => {
                const group = link.group
                  ? navGroups.find((g) => g.id === link.group)
                  : undefined;

                if (!group) {
                  return (
                    <Link
                      key={link.href + link.label}
                      href={safeCmsHref(link.href)}
                      className="rounded-lg px-3 py-2.5 font-accent text-[11px] font-medium uppercase tracking-[0.18em] text-white/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
                    >
                      {link.label}
                    </Link>
                  );
                }

                const isOpen = openGroup === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    data-nav-trigger={group.id}
                    aria-expanded={isOpen}
                    aria-controls={`nav-panel-${group.id}`}
                    onClick={() => {
                      clearCloseTimer();
                      if (isOpen) {
                        if (pinnedGroup) {
                          setOpenGroup(null);
                          setPinnedGroup(false);
                        } else {
                          setPinnedGroup(true);
                        }
                      } else {
                        setOpenGroup(group.id);
                        setPinnedGroup(true);
                      }
                    }}
                    onMouseEnter={() => {
                      clearCloseTimer();
                      if (pinnedGroup && openGroup === group.id) {
                        return;
                      }
                      setOpenGroup(group.id);
                      setPinnedGroup(false);
                    }}
                    onMouseLeave={() => {
                      if (!pinnedGroup) scheduleClose();
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 font-accent text-[11px] font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] ${
                      isOpen ? "text-white" : "text-white/75 hover:text-white"
                    }`}
                  >
                    {group.label}
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                );
              })}

              <Link
                href={safeCmsHref(headerCta.href, "/enquiry")}
                className="enquire-fill ml-3 inline-flex min-h-[44px] items-center justify-center px-5 py-2.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1617]"
              >
                <span>{headerCta.label}</span>
              </Link>
            </nav>

            {/* Mobile actions */}
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                href={safeCmsHref(headerCta.href, "/enquiry")}
                className="enquire-fill inline-flex min-h-[48px] items-center justify-center px-3.5 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brass)] sm:px-4"
              >
                <span>{headerCta.label}</span>
              </Link>

              <button
                ref={menuButtonRef}
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
              >
                {mobileOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop dropdown panel */}
        {openGroup && (
          <DesktopNavPanel
            group={navGroups.find((g) => g.id === openGroup)!}
            onClose={() => {
              clearCloseTimer();
              setOpenGroup(null);
              setPinnedGroup(false);
            }}
            onMouseEnter={clearCloseTimer}
            onMouseLeave={() => {
              if (!pinnedGroup) scheduleClose();
            }}
          />
        )}
      </header>

      {/* Mobile drawer — mounted only while open */}
      {mobileOpen && <MobileNav open={mobileOpen} onClose={closeMobile} />}
    </>
  );
}
