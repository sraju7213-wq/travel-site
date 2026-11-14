import Link from "next/link";
import Image from "next/image";
import type { PackageViewModel } from "@/types/travel";

interface PosterRailProps {
  packages: PackageViewModel[];
  eyebrow: string;
  heading: string;
  intro?: string;
}

function cleanDuration(duration: string): string {
  return duration.split(";")[0].replace(/\(as printed\)/i, "").trim();
}

function placeLine(pkg: PackageViewModel): string {
  const stops = pkg.region.filter((r) => r !== "India" && r !== "Nepal");
  return stops.length > 0
    ? `${stops.slice(0, 2).join(", ")}${stops.length > 2 ? ` +${stops.length - 2}` : ""}`
    : pkg.primaryRegion;
}

function verdict(pkg: PackageViewModel): { label: string; tone: string } | null {
  const raw = pkg.difficulty?.toLowerCase() ?? "";
  if (!raw) return null;
  if (raw.includes("easy")) return { label: "Easy going", tone: "go" };
  if (raw.includes("moderate")) return { label: "Moderate", tone: "timepass" };
  if (raw.includes("demanding") || raw.includes("strenuous")) {
    return { label: "Demanding", tone: "skip" };
  }
  return { label: pkg.difficulty?.split("(")[0].trim() ?? "Open level", tone: "muted" };
}

/**
 * PosterRail
 * ----------
 * A grid of tall poster cards, matching the reelipse.com rail: image on top,
 * title and a meta row (places · duration · verdict pill) underneath.
 */
export default function PosterRail({
  packages,
  eyebrow,
  heading,
  intro,
}: PosterRailProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12" aria-labelledby={`rail-${eyebrow.replace(/\s+/g, "-").toLowerCase()}`}>
      <h2
        id={`rail-${eyebrow.replace(/\s+/g, "-").toLowerCase()}`}
        className="jy-section-title"
      >
        {heading}
      </h2>
      {intro && <p className="mt-4 max-w-2xl text-lg text-white/70">{intro}</p>}
      <div className="jy-rail mt-10">
        {packages.map((pkg) => {
          const badge = verdict(pkg);
          return (
            <article key={pkg.id} className="jy-rail-card group">
              <Link href={`/packages/${pkg.slug}`} aria-label={pkg.title}>
                <div className="jy-rail-poster" data-tilt>
                  <Image
                    src={`/images/packages/${pkg.slug}.jpg`}
                    alt={pkg.title}
                    fill
                    sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
                    className="object-cover"
                  />
                  <span className="jy-rail-glare" aria-hidden="true" />
                </div>
                <h3 className="jy-rail-title">{pkg.title}</h3>
                <div className="jy-rail-meta">
                  <span className="font-mono text-xs text-white/55">
                    {placeLine(pkg)} · {cleanDuration(pkg.duration)}
                  </span>
                  {badge && (
                    <span className={`jy-pill jy-pill--${badge.tone}`}>{badge.label}</span>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
