"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PILLARS } from "@/data/siteContent";

/**
 * Tabbed pillars — the reference site's "Why travel with Wilderness?" module, with tab
 * pills that cross-fade an image/video block and its copy.
 */
export default function PillarsTabs() {
  const [active, setActive] = useState(0);
  const pillar = PILLARS[active];

  return (
    <section className="section-darker border-t border-white/10 py-20 md:py-28" id="why-us">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-wild-orange">Travel with purpose</p>
          <h2 className="text-h2 text-wild-white">Why travel with us?</h2>
        </div>

        {/* Tab pills */}
        <div
          role="tablist"
          aria-label="Why travel with us"
          className="mb-12 flex flex-wrap items-center justify-center gap-x-1 gap-y-2 border-b border-white/15 pb-4"
        >
          {PILLARS.map((p, i) => (
            <button
              key={p.key}
              role="tab"
              type="button"
              id={`pillar-tab-${p.key}`}
              aria-selected={active === i}
              aria-controls={`pillar-panel-${p.key}`}
              onClick={() => setActive(i)}
              className={`border-b-2 px-4 py-3 text-xs font-display font-semibold uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                active === i
                  ? "border-wild-orange text-wild-orange"
                  : "border-transparent text-white/60 hover:text-wild-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Panels — absolutely stacked so they cross-fade */}
        <div className="relative">
          {PILLARS.map((p, i) => (
            <div
              key={p.key}
              role="tabpanel"
              id={`pillar-panel-${p.key}`}
              aria-labelledby={`pillar-tab-${p.key}`}
              hidden={active !== i}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                active === i ? "opacity-100" : "pointer-events-none opacity-0"
              } transition-opacity duration-500`}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-image bg-wild-dark">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  priority={i === 0}
                />
                <div aria-hidden="true" className="absolute inset-0 bg-black/20" />
              </div>
              <div>
                <h3 className="text-h3 mb-5 text-wild-white">{p.title}</h3>
                <p className="mb-8 font-display text-lg leading-relaxed text-white/75">{p.body}</p>
                <Link href={p.href} className="btn-tertiary">
                  {p.linkLabel} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <p className="sr-only" aria-live="polite">
          {pillar.title}
        </p>
      </div>
    </section>
  );
}
