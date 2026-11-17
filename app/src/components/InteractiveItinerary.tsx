"use client";

import { useMemo, useState } from "react";
import ActivityIcon from "@/components/package/ActivityIcon";
import {
  ACTIVITY_LABELS,
  ACTIVITY_TONES,
  detectActivity,
  type ActivityKind,
} from "@/lib/itinerary";

interface ItineraryDay {
  day?: number | string;
  title?: string;
  description?: string;
  stops?: string[];
  transfers?: string;
}

interface InteractiveItineraryProps {
  itinerary?: ItineraryDay[];
  eyebrow?: string;
  heading?: string;
}

function parseDayNumber(entry: ItineraryDay, index: number): string {
  if (entry.day !== undefined && entry.day !== null && entry.day !== "") {
    return String(entry.day);
  }
  return String(index + 1);
}

/** Highlights the load-bearing words in a brochure sentence. */
function highlightKeywords(text: string): React.ReactNode {
  // NOTE: every group must be non-capturing — `String.split` re-inserts capturing
  // groups into the result, which would duplicate the highlighted words.
  const keywords = [
    { word: /(?:arrival|arriv\w+|check.?in|transfer|meet and greet)/gi, className: "text-white/90 font-medium" },
    { word: /(?:sightseeing|visit|tour|excursion|explore|discover)/gi, className: "text-white/90 font-medium" },
    { word: /(?:flight|fly|train|rail|road|drive|coach)/gi, className: "text-brass/90 font-medium" },
    { word: /(?:boat|cruise|raft|shikara|houseboat)/gi, className: "text-white/90 font-medium" },
    { word: /(?:trek|hike|climb|acclimat\w*|altitude)/gi, className: "text-brass/90 font-medium" },
    { word: /(?:temple|fort|palace|monument|museum|heritage|monastery|stupa)/gi, className: "text-white/90 font-medium" },
    { word: /(?:safari|wildlife|national park|sanctuary|rhino|tiger)/gi, className: "text-brass/90 font-medium" },
    { word: /(?:at leisure|free time|optional)/gi, className: "text-white/70 italic" },
    { word: /(?:morning|afternoon|evening|full.?day)/gi, className: "text-white/80 font-medium" },
  ];

  let parts: Array<string | React.ReactNode> = [text];
  let matchIndex = 0;

  for (const { word, className } of keywords) {
    const newParts: Array<string | React.ReactNode> = [];
    for (const part of parts) {
      if (typeof part === "string") {
        const segments = part.split(word);
        const matches = [...part.matchAll(word)].map((m) => m[0]);
        for (let i = 0; i < segments.length; i++) {
          if (segments[i]) newParts.push(segments[i]);
          if (i < matches.length) {
            newParts.push(
              <span key={`match-${matchIndex++}`} className={className}>
                {matches[i]}
              </span>
            );
          }
        }
      } else {
        newParts.push(part);
      }
    }
    parts = newParts;
  }

  return <span>{parts}</span>;
}

function formatDescription(text: string): React.ReactNode {
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  if (sentences.length <= 1) {
    return highlightKeywords(text);
  }
  return (
    <div className="space-y-1.5">
      {sentences.map((sentence, i) => (
        <p key={i} className="font-display text-sm leading-relaxed text-white/70">
          {highlightKeywords(sentence.trim())}
        </p>
      ))}
    </div>
  );
}

export default function InteractiveItinerary({
  itinerary,
  eyebrow = "Curated Daily Schedule",
  heading,
}: InteractiveItineraryProps) {
  const days = useMemo(() => itinerary ?? [], [itinerary]);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => new Set());

  const allExpanded = days.length > 0 && expandedDays.size === days.length;

  const expandAll = () => setExpandedDays(new Set(days.map((_, i) => i)));
  const collapseAll = () => setExpandedDays(new Set());

  const toggleDay = (idx: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (days.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-xl font-bold text-white">Day-by-Day Itinerary</h2>
        <p className="mx-auto mt-3 max-w-xl font-display text-sm leading-relaxed text-white/60">
          Detailed day-by-day programming is available on enquiry. Each journey is tailor-made; routing,
          timings and inclusions are confirmed directly with a travel designer.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">{eyebrow}</p>
          <h2 className="mt-1 font-serif text-xl font-bold text-white">
            {heading ?? `${days.length}-Day Step-by-Step Experience`}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={expandAll}
            disabled={allExpanded}
            className="min-h-[40px] cursor-pointer rounded-none border border-white/10 bg-white/5 px-3 py-2 font-display text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 transition hover:border-brass/60 hover:text-brass disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            disabled={expandedDays.size === 0}
            className="min-h-[40px] cursor-pointer rounded-none border border-white/10 bg-white/5 px-3 py-2 font-display text-[11px] font-medium uppercase tracking-[0.12em] text-white/70 transition hover:border-brass/60 hover:text-brass disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            Collapse all
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {days.map((entry, idx) => {
          const dayNum = parseDayNumber(entry, idx);
          const isExpanded = expandedDays.has(idx);
          const activity: ActivityKind = detectActivity(
            `${entry.title ?? ""} ${entry.description ?? ""}`
          );
          const panelId = `itinerary-panel-${idx}`;
          const buttonId = `itinerary-trigger-${idx}`;

          return (
            <div
              key={idx}
              id={`itinerary-day-${idx}`}
              className={`overflow-hidden rounded-none border transition-colors duration-200 ${
                isExpanded
                  ? "border-brass/40 bg-white/[0.04]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25"
              }`}
            >
              <button
                type="button"
                id={buttonId}
                onClick={() => toggleDay(idx)}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brass"
              >
                <span className="flex min-w-0 flex-wrap items-center gap-3">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-none border font-display text-xs font-bold transition-colors ${
                      isExpanded
                        ? "border-brass bg-brass text-[#0C1617]"
                        : "border-white/10 bg-white/5 text-white/60"
                    }`}
                  >
                    {dayNum}
                  </span>
                  <span className="min-w-0 truncate font-display text-sm font-medium text-white">
                    {entry.title || `Day ${dayNum} Programme`}
                  </span>
                  <span
                    className={`hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-display text-[10px] font-medium uppercase tracking-[0.1em] sm:inline-flex ${ACTIVITY_TONES[activity]}`}
                  >
                    <ActivityIcon kind={activity} />
                    {ACTIVITY_LABELS[activity]}
                  </span>
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`shrink-0 text-white/50 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isExpanded}
                inert={!isExpanded}
                className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ gridTemplateRows: isExpanded ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className={`border-t border-white/10 px-4 pb-4 pt-3 ${isExpanded ? "animate-fade-in" : ""}`}>
                {entry.description && (
                  <div className="font-display text-sm leading-relaxed text-white/75">
                    {formatDescription(entry.description)}
                  </div>
                )}

                {entry.stops && entry.stops.length > 0 && (
                  <p className="mt-3 flex items-start gap-1.5 font-display text-xs text-white/60">
                    <span aria-hidden="true" className="text-brass">
                      ◆
                    </span>
                    <span>{entry.stops.join(" · ")}</span>
                  </p>
                )}

                {entry.transfers && (
                  <p className="mt-1.5 flex items-start gap-1.5 font-display text-xs text-white/60">
                    <span aria-hidden="true" className="text-brass">
                      ◆
                    </span>
                    <span>{entry.transfers}</span>
                  </p>
                )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
