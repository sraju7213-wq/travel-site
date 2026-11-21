"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { PackageViewModel } from "@/types/travel";
import { getPackageCardImage } from "@/data/catalogue";
import { cleanDuration, placeLine } from "@/lib/packageDisplay";

interface SeasonRailProps {
  packages: PackageViewModel[];
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

/**
 * SeasonRail
 * ----------
 * An editorial, snap-scrolling showcase for the journeys travelling right
 * now. Cards carry their details on the poster so they read at a glance, and
 * the arrow controls step one card at a time on larger screens.
 */
export default function SeasonRail({ packages }: SeasonRailProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const step = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>(".jy-spot-card");
    const distance = card ? card.offsetWidth + 20 : 320;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="jy-showcase" aria-labelledby="season-h">
      <div className="jy-head">
        <div className="jy-head-main">
          <span className="jy-kicker">
            <span className="jy-kicker-line" aria-hidden="true" />
            Handpicked for the season
          </span>
          <h2 id="season-h" className="jy-head-title">
            In season now
          </h2>
        </div>
        <div className="jy-head-side">
          <p className="jy-head-intro">
            The journeys our travellers are booking right now — ready when you are.
          </p>
          <Link href="/journeys#catalogue" className="jy-head-link">
            View all journeys <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>

      <div className="jy-spot">
        <div
          ref={trackRef}
          className="jy-spot-track"
          role="region"
          aria-label="Journeys in season now — scroll to browse"
          tabIndex={0}
        >
          {packages.map((pkg, index) => (
            <article className="jy-spot-card" key={pkg.id}>
              <Link
                href={`/packages/${pkg.slug}`}
                className="jy-spot-link"
                aria-label={`${pkg.title} — view journey`}
              >
                <div className="jy-spot-media" data-tilt>
                  <Image
                    src={getPackageCardImage(pkg.slug)}
                    alt={pkg.title}
                    fill
                    sizes="(min-width: 1024px) 330px, (min-width: 640px) 300px, 264px"
                    quality={75}
                    className="jy-spot-img"
                  />
                  <span className="jy-spot-shade" aria-hidden="true" />
                  <span className="jy-spot-glare" aria-hidden="true" />
                  <span className="jy-spot-rank" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="jy-spot-duration">{cleanDuration(pkg.duration)}</span>
                  <div className="jy-spot-info">
                    <div className="min-w-0">
                      <h3 className="jy-spot-name">{pkg.title}</h3>
                      <p className="jy-spot-place">{placeLine(pkg)}</p>
                    </div>
                    <span className="jy-spot-go" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="jy-spot-nav">
          <button
            type="button"
            className="jy-spot-arrow"
            onClick={() => step(-1)}
            aria-label="Previous journeys"
          >
            <Chevron direction="left" />
          </button>
          <button
            type="button"
            className="jy-spot-arrow"
            onClick={() => step(1)}
            aria-label="Next journeys"
          >
            <Chevron direction="right" />
          </button>
        </div>
      </div>
    </section>
  );
}
