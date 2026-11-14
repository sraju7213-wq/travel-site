import { getAllPackages } from "./catalogue";
import type { PackageViewModel } from "@/types/travel";

/**
 * Marquee journeys orbiting the /journeys hero ring.
 *
 * Curated for visual variety across the six brochure categories — every card
 * links straight to its itinerary page. Keep ids in brochure order within
 * each category so the ring mixes regions as it spins.
 */
export const HERO_JOURNEY_IDS = [
  // Kashmir & Himalaya
  "kashmir-package-7-day",
  "markha-valley",
  "kashmir-zanskar-ladakh-trek",
  "vale-of-kashmir-trek",
  "kashmir-ski",
  "kashmir-mini-adventure",
  // Nepal
  "nepal-wildlife-safari",
  "trisuli-rafting",
  "nepal-mini-trek-7-day",
  "himalayan-combination-nepal",
  // India highlights
  "golden-triangle",
  "heritage-tour-india",
  "glimpses-of-kerala",
  "india-nepal-combination",
  // Stopovers
  "discover-ladakh",
  "kathmandu-pokhara",
] as const;

/**
 * Resolve the marquee ids against the live catalogue. Unknown ids are
 * dropped, so editing the list never breaks the build.
 */
export function getHeroJourneys(): PackageViewModel[] {
  const byId = new Map(getAllPackages().map((pkg) => [pkg.id, pkg]));
  return HERO_JOURNEY_IDS.map((id) => byId.get(id)).filter(
    (pkg): pkg is PackageViewModel => Boolean(pkg),
  );
}
