"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { PILLARS } from "@/data/siteContent";

export default function PillarsTabs() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectTab = (index: number, focus = false) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = PILLARS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    selectTab(next, true);
  };

  return (
    <section className="section-darker border-t border-white/10 py-20 md:py-28" id="why-us">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-brass">Why travel with us</p>
          <h2 className="text-h2 text-white">How we travel</h2>
        </div>

        {/* Tab pills */}
        <div
          role="tablist"
          aria-label="Why travel with us"
          onKeyDown={onKeyDown}
          className="mb-12 flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-6"
        >
          {PILLARS.map((p, i) => (
            <button
              key={p.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`pillar-tab-${p.key}`}
              aria-selected={active === i}
              aria-controls={`pillar-panel-${p.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => selectTab(i)}
              className={`rounded-button px-5 py-2.5 text-xs font-display font-semibold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                active === i
                  ? "bg-brass text-white shadow-[0_8px_20px_-4px_rgba(255,110,0,0.4)] scale-105"
                  : "bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Panels — only the active panel is rendered, so its image is the only one requested */}
        <div role="tabpanel" id={`pillar-panel-${PILLARS[active].key}`} aria-labelledby={`pillar-tab-${PILLARS[active].key}`}>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="group relative aspect-[4/3] overflow-hidden rounded-[1rem] border border-white/10 bg-forest shadow-2xl transition-all duration-500">
              <Image
                src={PILLARS[active].image}
                alt={PILLARS[active].title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
            </div>
            <div>
              <h3 className="text-h3 mb-5 text-white">{PILLARS[active].title}</h3>
              <p className="mb-8 font-display text-lg leading-relaxed text-white/80">
                {PILLARS[active].body}
              </p>
              <Link href={PILLARS[active].href} className="btn-tertiary">
                {PILLARS[active].linkLabel} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
