"use client";

import { useMemo, useState } from "react";
import Container from "./Container";

interface ItineraryDay {
  day?: number | string;
  title?: string;
  description?: string;
  stops?: string[];
  transfers?: string;
}

interface InteractiveItineraryProps {
  itinerary?: ItineraryDay[];
}

function parseDayNumber(entry: ItineraryDay, index: number): string {
  if (entry.day !== undefined && entry.day !== null && entry.day !== "") {
    return String(entry.day);
  }
  return String(index + 1);
}

function getActivityBadge(text: string): { label: string; icon: string } | null {
  const lower = text.toLowerCase();
  if (lower.includes("trek") || lower.includes("walk") || lower.includes("hike") || lower.includes("climb")) {
    return { label: "Trek / Hike", icon: "🥾" };
  }
  if (lower.includes("drive") || lower.includes("transfer") || lower.includes("coach") || lower.includes("road")) {
    return { label: "Scenic Transfer", icon: "🚗" };
  }
  if (lower.includes("boat") || lower.includes("shikara") || lower.includes("raft") || lower.includes("houseboat")) {
    return { label: "Water / Boat", icon: "🚣" };
  }
  if (lower.includes("flight") || lower.includes("fly") || lower.includes("airport")) {
    return { label: "Flight", icon: "✈️" };
  }
  if (lower.includes("temple") || lower.includes("fort") || lower.includes("palace") || lower.includes("sightseeing")) {
    return { label: "Heritage Tour", icon: "🏛️" };
  }
  if (lower.includes("safari") || lower.includes("wildlife") || lower.includes("rhino") || lower.includes("tiger")) {
    return { label: "Wildlife", icon: "🐅" };
  }
  return null;
}

export default function InteractiveItinerary({ itinerary }: InteractiveItineraryProps) {
  const days = useMemo(() => itinerary ?? [], [itinerary]);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(() => new Set(days.map((_, i) => i)));
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const allExpanded = expandedDays.size === days.length;

  const toggleAll = () => {
    if (allExpanded) {
      setExpandedDays(new Set());
    } else {
      setExpandedDays(new Set(days.map((_, i) => i)));
    }
  };

  const toggleDay = (idx: number) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const scrollToDay = (idx: number) => {
    setSelectedDay(idx);
    setExpandedDays((prev) => new Set([...prev, idx]));
    const el = document.getElementById(`itinerary-day-${idx}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  if (days.length === 0) {
    return (
      <section className="border-t border-border bg-ivory-soft py-16 md:py-20" id="itinerary">
        <Container>
          <div className="max-w-2xl">
            <p className="subtitle-large mb-3 text-brass">Programme</p>
            <h2 className="text-h3 mb-4 text-charcoal">Day-by-Day Itinerary</h2>
            <p className="font-display text-base text-charcoal-soft leading-relaxed">
              No day-by-day programme has been transcribed for this journey yet. Direct consultation provides full departure notes, elevation profiles, and lodge stops.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-t border-border bg-ivory-soft/60 py-16 md:py-24" id="itinerary" aria-label="Day-by-day itinerary">
      <Container>
        {/* Header with Title and Global Toggles */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-border/80 pb-6">
          <div className="max-w-2xl">
            <p className="subtitle-large mb-2 text-brass">Curated Route</p>
            <h2 className="text-h3 font-serif text-charcoal">Day-by-Day Itinerary</h2>
            <p className="font-display text-sm md:text-base text-charcoal-soft leading-relaxed mt-2">
              Transcribed from the India Nepal Travel brochure. Day timings, rest days and optional side excursions are verified by direct enquiry.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="rounded-button border border-border bg-white px-3 py-1.5 text-xs font-display uppercase tracking-wider font-semibold text-charcoal shadow-sm">
              {days.length} Days Itinerary
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="rounded-button border border-border bg-white px-3.5 py-1.5 text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft hover:border-brass hover:text-brass transition-all shadow-sm cursor-pointer"
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </div>

        {/* Quick Jump Day Selector Pills */}
        <div className="mb-10">
          <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-charcoal-soft mb-3">
            Quick Jump To Day
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((entry, idx) => {
              const dayNum = parseDayNumber(entry, idx);
              const isCurrent = selectedDay === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToDay(idx)}
                  className={`flex-shrink-0 rounded-button px-3.5 py-1.5 text-xs font-display font-semibold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-brass text-white shadow-md scale-105"
                      : "bg-white border border-border text-charcoal-soft hover:border-brass hover:text-brass"
                  }`}
                >
                  Day {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Itinerary Timeline Cards */}
        <div className="space-y-6">
          {days.map((entry, idx) => {
            const dayNum = parseDayNumber(entry, idx);
            const isExpanded = expandedDays.has(idx);
            const combinedText = `${entry.title || ""} ${entry.description || ""}`;
            const activity = getActivityBadge(combinedText);
            const panelId = `day-panel-${idx}`;

            return (
              <div
                key={idx}
                id={`itinerary-day-${idx}`}
                className={`overflow-hidden rounded-[1.25rem] border transition-all duration-300 bg-white ${
                  isExpanded ? "border-border shadow-md" : "border-border/60 shadow-sm hover:border-border"
                }`}
              >
                {/* Day Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-ivory/20 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brass text-white font-serif text-sm font-bold shadow-sm">
                      {dayNum}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-display font-semibold uppercase tracking-wider text-brass">
                          Day {dayNum}
                        </span>
                        {activity && (
                          <span className="rounded-pill bg-ivory-soft border border-border px-2.5 py-0.5 text-[0.65rem] font-display uppercase tracking-wider text-charcoal-soft flex items-center gap-1">
                            <span>{activity.icon}</span>
                            <span>{activity.label}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-charcoal mt-1">
                        {entry.title || `Day ${dayNum} Programme`}
                      </h3>
                    </div>
                  </div>

                  <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full border border-border text-charcoal-soft transition-transform duration-200">
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      className={`stroke-current stroke-2 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <path d="M1 1.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {/* Collapsible Content Panel */}
                <div
                  id={panelId}
                  hidden={!isExpanded}
                  className="border-t border-border/60 px-5 md:px-6 pb-6 pt-4 space-y-4"
                >
                  {entry.description && (
                    <p className="font-display text-sm md:text-base leading-relaxed text-charcoal-soft">
                      {entry.description}
                    </p>
                  )}

                  {/* Stops tags */}
                  {entry.stops && entry.stops.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[0.65rem] font-display uppercase tracking-wider text-charcoal-soft font-semibold mb-2">
                        Route Stops &amp; Landmarks:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {entry.stops.map((stop) => (
                          <span
                            key={stop}
                            className="inline-flex items-center gap-1.5 rounded-button border border-border bg-ivory-soft px-3 py-1 text-xs font-display font-medium text-charcoal"
                          >
                            <span className="text-brass">📍</span>
                            <span>{stop}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transfer Note */}
                  {entry.transfers && (
                    <div className="rounded-[0.75rem] border border-border/80 bg-ivory/40 p-3.5 text-xs font-display text-charcoal-soft flex items-center gap-2.5">
                      <span className="text-brass text-base">🚗</span>
                      <span><strong>Transfer details:</strong> {entry.transfers}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
