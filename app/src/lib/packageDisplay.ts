import type { PackageViewModel } from "@/types/travel";

/**
 * Presentational helpers for package cards. Shared by the journeys hero
 * orbit, the coverflow rails and the trending carousel so the same journey
 * reads identically everywhere.
 */

/** Clean duration for display — drops brochure caveats like "(as printed)". */
export function cleanDuration(duration: string): string {
  return duration
    .split(";")[0]
    .replace(/\(.*?\)/g, "")
    .replace(/\s+(per|based)\b.*/i, "")
    .trim();
}

/** The places a journey actually goes, rather than the country heading. */
export function placeLine(pkg: PackageViewModel): string {
  const stops = pkg.region.filter((r) => r !== "India" && r !== "Nepal");
  return stops.length > 0
    ? `${stops.slice(0, 2).join(", ")}${stops.length > 2 ? ` +${stops.length - 2}` : ""}`
    : pkg.primaryRegion;
}
