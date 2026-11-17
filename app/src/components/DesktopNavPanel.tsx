"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { NavGroup } from "@/lib/navigation";

interface DesktopNavPanelProps {
  group: NavGroup;
  onClose: () => void;
}

/**
 * DesktopNavPanel
 * ---------------
 * The dropdown that opens beneath the header when a grouped item (Journeys,
 * Destinations, Experiences) is activated.
 *
 * It is a plain, non-modal panel: the page behind it stays reachable, so it is
 * announced as a `region` rather than a dialog, and focus is not trapped. The
 * panel is rendered only while open, which keeps the accessibility tree clean.
 */
export default function DesktopNavPanel({ group, onClose }: DesktopNavPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Move focus into the panel when it opens from the keyboard.
  useEffect(() => {
    const trigger = document.querySelector<HTMLButtonElement>(
      `[data-nav-trigger="${group.id}"]`,
    );
    if (trigger && trigger === document.activeElement) {
      firstLinkRef.current?.focus();
    }
  }, [group.id]);

  const hasImages = group.links.some((link) => link.image);

  return (
    <div
      ref={panelRef}
      id={`nav-panel-${group.id}`}
      role="group"
      aria-label={`${group.label} menu`}
      className="absolute inset-x-0 top-full hidden border-b border-white/10 bg-[#0C1617]/98 shadow-[0_28px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur-xl lg:block"
    >
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="mb-6 flex items-baseline justify-between gap-6 border-b border-white/10 pb-4">
          <h2 className="font-accent text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-wild-orange)]">
            {group.label}
          </h2>
          <p className="font-sans text-xs text-white/60">{group.note}</p>
        </div>

        <ul
          className={
            hasImages
              ? "grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-3 lg:grid-cols-4"
              : "grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-3 lg:grid-cols-4"
          }
        >
          {group.links.map((link, index) => (
            <li key={link.href + link.label}>
              <Link
                ref={index === 0 ? firstLinkRef : undefined}
                href={link.href}
                onClick={onClose}
                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)]"
              >
                {link.image ? (
                  <span className="relative mt-0.5 block h-11 w-14 shrink-0 overflow-hidden rounded">
                    <Image
                      src={link.image}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                ) : null}
                <span className="min-w-0">
                  <span className="block font-accent text-[11px] font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors group-hover:text-[var(--color-wild-orange)]">
                    {link.label}
                  </span>
                  {link.description ? (
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-white/65">
                      {link.description}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
