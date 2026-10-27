"use client";

import Image from "next/image";
import Link from "next/link";
import { DESTINATIONS, NAV_CATEGORIES } from "@/data/siteContent";

interface MegaMenuProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Desktop mega menu — a full-width black overlay below the header, with the primary
 * categories on the left and a destination board with imagery on the right.
 */
export default function MegaMenu({ open, onClose }: MegaMenuProps) {
  if (!open) return null;

  return (
    <div
      id="mega-menu"
      className="fixed inset-x-0 top-[76px] bottom-0 z-40 overflow-y-auto bg-wild-black text-wild-white md:top-[92px]"
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-10 md:px-12 lg:grid-cols-[288px_1fr] lg:py-14">
        <nav aria-label="Primary">
          <ul className="space-y-1">
            {NAV_CATEGORIES.map((group) => (
              <li key={group.label} className="border-b border-white/10">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-xs font-display font-medium uppercase tracking-[2.4px] text-wild-sand transition-colors hover:text-wild-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange">
                    {group.label}
                    <span
                      aria-hidden="true"
                      className="text-base transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <ul className="pb-4">
                    {group.items.map((item) => (
                      <li key={`${group.label}-${item.label}`}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="block py-1.5 text-sm font-display text-white/70 transition-colors hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
            <li className="pt-6">
              <Link href="/enquiry" onClick={onClose} className="btn-primary">
                Enquire now <span aria-hidden="true">→</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="subtitle-large mb-2 text-white/60">Destinations</h2>
          <p className="mb-8 max-w-2xl text-sm font-display text-white/60">
            Eight regions across India and Nepal, each with its own journeys, guides and
            seasons.
          </p>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.map((d) => (
              <li key={d.name}>
                <Link
                  href={d.href}
                  onClick={onClose}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-image border border-white/10 bg-wild-darker">
                    <Image
                      src={d.image}
                      alt={d.tagline}
                      fill
                      sizes="(min-width: 1024px) 280px, (min-width: 640px) 45vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/10"
                    />
                  </span>
                  <span className="mt-3 block text-sm font-display font-semibold uppercase tracking-[0.15em] text-wild-white transition-colors group-hover:text-wild-orange">
                    {d.name}
                  </span>
                  <span className="mt-1 block text-xs font-display text-wild-sand">{d.tagline}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
