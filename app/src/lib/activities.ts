/**
 * Activity tagging.
 *
 * The brochure catalogue has no explicit "activity" field, so the tags below are
 * *derived* from text that is already in the record — the package category, the
 * title, the summary and the printed highlights. Nothing is invented: if the
 * brochure never mentions rafting, the package is not tagged as rafting.
 *
 * This is what makes the `?activity=` navigation links (trekking, rafting,
 * wildlife, culture, skiing, houseboats, city stopovers) resolve to a real,
 * filtered result set instead of silently showing every package.
 */

import type { PackageViewModel } from "@/types/travel";

export interface ActivityTag {
  /** Query-string value used in `/journeys?activity=…`. */
  key: string;
  /** Human label for menus and filter chips. */
  label: string;
}

export const ACTIVITY_TAGS: ActivityTag[] = [
  { key: "trekking", label: "Himalayan trekking" },
  { key: "rafting", label: "River rafting" },
  { key: "wildlife", label: "Wildlife & safaris" },
  { key: "culture", label: "Culture & heritage" },
  { key: "skiing", label: "Skiing" },
  { key: "houseboat/backwaters", label: "Houseboats & backwaters" },
  { key: "city stopover", label: "City stopovers" },
];

/** Text that would wrongly match a keyword (e.g. "rafter" inside "rafters"). */
function haystack(pkg: PackageViewModel): string {
  return [
    pkg.title,
    pkg.category,
    pkg.summary,
    ...pkg.highlights,
    ...pkg.region,
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * Keyword rules per activity. Kept deliberately narrow — an over-broad rule
 * would tag a package with an activity the brochure never describes.
 */
const RULES: Record<string, RegExp[]> = {
  trekking: [
    /\btrek\b/,
    /\btrekking\b/,
    /\btrail\b/,
    /\bglacier\b/,
    /\bhigh pass/,
    /\bvalley trek/,
    /\bsummit\b/,
    /\bcamp\b/,
  ],
  rafting: [/\brafting\b/, /\brafts?\b/, /\btrisuli\b/, /\briver\b/],
  wildlife: [/\bwildlife\b/, /\bsafari\b/, /\brhino\b/, /\bjungle\b/, /\bchitwan\b/, /\bnational park\b/, /\belephant\b/],
  culture: [
    /\bheritage\b/,
    /\bmonument/,
    /\btemple/,
    /\bfort\b/,
    /\bpalace\b/,
    /\bghats?\b/,
    /\bmonaster/,
    /\bgompa/,
    /\bmarket\b/,
    /\bfestival\b/,
    /\bcultur/,
  ],
  skiing: [/\bski\b/, /\bskiing\b/, /\bsnowboard\b/, /\bgulmarg\b/],
  "houseboat/backwaters": [/\bhouseboat/, /\bbackwater/, /\bshikara\b/, /\bdaal?\s?lake\b/, /\bchopan\b/, /\bkettuvallam\b/],
  "city stopover": [/\bstopover\b/, /\bcity break\b/, /\bdelhi\b/, /\bbombay\b/, /\bmumbai\b/, /\bkathmandu\b/, /\bpokhara\b/],
};

/**
 * Categories whose printed purpose is unambiguous, so the derived tags can be
 * trusted without keyword evidence.
 */
const CATEGORY_TAGS: Record<string, string[]> = {
  "Himalayan Expeditions": ["trekking"],
  "Mini Trek in Kashmir": ["trekking"],
};

/**
 * Returns the activity tags for a package, derived from brochure text.
 */
export function getPackageActivities(pkg: PackageViewModel): string[] {
  const text = haystack(pkg);
  const tags = new Set<string>(CATEGORY_TAGS[pkg.category] ?? []);

  for (const [key, patterns] of Object.entries(RULES)) {
    if (tags.has(key)) continue;
    if (patterns.some((pattern) => pattern.test(text))) tags.add(key);
  }

  return [...tags];
}

/**
 * True when the package carries the given activity tag.
 */
export function packageHasActivity(pkg: PackageViewModel, activity: string): boolean {
  const wanted = activity.trim().toLowerCase();
  if (!wanted) return true;
  return getPackageActivities(pkg).includes(wanted);
}

/**
 * Human label for an activity key, falling back to the key itself.
 */
export function activityLabel(key: string): string {
  return ACTIVITY_TAGS.find((t) => t.key === key)?.label ?? key;
}
