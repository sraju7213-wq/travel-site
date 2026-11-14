/**
 * Shared helpers for reading brochure itineraries.
 *
 * The brochure records only carry free-text day descriptions, so activity types
 * are *inferred* from that text. The inference is surfaced in the UI as a
 * descriptive tag rather than presented as a printed fact.
 */

export type ActivityKind =
  | "trek"
  | "flight"
  | "rail"
  | "water"
  | "wildlife"
  | "heritage"
  | "transfer"
  | "leisure"
  | "sightseeing";

export const ACTIVITY_LABELS: Record<ActivityKind, string> = {
  trek: "Trek / Hike",
  flight: "Scenic Flight",
  rail: "Rail Journey",
  water: "Water / Boat",
  wildlife: "Wildlife",
  heritage: "Heritage & Temples",
  transfer: "Scenic Transfer",
  leisure: "Leisure",
  sightseeing: "Sightseeing",
};

export const ACTIVITY_TONES: Record<ActivityKind, string> = {
  trek: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  flight: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  rail: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  water: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  wildlife: "border-lime-500/30 bg-lime-500/10 text-lime-300",
  heritage: "border-violet-500/30 bg-violet-500/10 text-violet-300",
  transfer: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  leisure: "border-white/15 bg-white/5 text-white/60",
  sightseeing: "border-white/15 bg-white/5 text-white/60",
};

/** Infers the dominant activity of a day from its title and description. */
export function detectActivity(text: string): ActivityKind {
  const lower = text.toLowerCase();
  if (/trek|hike|trekking|climb|acclimat/.test(lower)) return "trek";
  if (/flight|fly |flying|aerial|airport/.test(lower)) return "flight";
  if (/train|rail|shatabdi|express coach/.test(lower)) return "rail";
  if (/boat|shikara|raft|cruise|houseboat|ghat/.test(lower)) return "water";
  if (/safari|wildlife|rhino|tiger|wildlife sanctuary|national park/.test(lower)) return "wildlife";
  if (/temple|fort|palace|monument|museum|heritage|monastery|stupa|sightseeing/.test(lower)) {
    return "heritage";
  }
  if (/transfer|drive|coach|road|vehicle|car|taxi|bus/.test(lower)) return "transfer";
  if (/leisure|at leisure|free time|optional/.test(lower)) return "leisure";
  return "sightseeing";
}

/** Strips brochure prefixes so "Transfer to Agra" becomes "Agra". */
export function cleanStopName(raw: string): string {
  return raw
    .replace(
      /^(drive to|flight to|excursion to|trek to|transfer to|transfer for|visit to|explore|travel to|arrival in|departure from)\s+/i,
      ""
    )
    .replace(/\s*\/\s*/g, " & ")
    .trim();
}
