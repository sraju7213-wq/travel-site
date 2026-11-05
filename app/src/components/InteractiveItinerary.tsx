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
  if (lower.includes("drive") || lower.includes("transfer") || lower.includes("coach") || lower.includes("road") || lower.includes("by road")) {
    return { label: "Scenic Transfer", icon: "🚗" };
  }
  if (lower.includes("boat") || lower.includes("shikara") || lower.includes("raft") || lower.includes("houseboat") || lower.includes("cruise")) {
    return { label: "Water / Boat", icon: "🚣" };
  }
  if (lower.includes("flight") || lower.includes("fly") || lower.includes("airport")) {
    return { label: "Flight", icon: "✈️" };
  }
  if (lower.includes("temple") || lower.includes("fort") || lower.includes("palace") || lower.includes("sightseeing") || lower.includes("monument") || lower.includes("museum")) {
    return { label: "Heritage Tour", icon: "🏛️" };
  }
  if (lower.includes("safari") || lower.includes("wildlife") || lower.includes("rhino") || lower.includes("tiger") || lower.includes("national park") || lower.includes("sanctuary")) {
    return { label: "Wildlife", icon: "🐅" };
  }
  if (lower.includes("leisure") || lower.includes("free") || lower.includes("relax") || lower.includes("at leisure")) {
    return { label: "Leisure Day", icon: "☕" };
  }
  return null;
}

function extractLocations(text: string): string[] {
  // Extract potential place names (capitalized words, common Indian/Nepal locations)
  const locations: string[] = [];
  const commonPlaces = [
    "Delhi", "Agra", "Jaipur", "Udaipur", "Jodhpur", "Varanasi", "Kathmandu", "Leh", "Srinagar",
    "Mumbai", "Bombay", "Kochi", "Munnar", "Thekkady", "Alleppey", "Varkala", "Kovalam",
    "Kanyakumari", "Rameshwaram", "Madurai", "Kashmir", "Zanskar", "Ladakh", "Markha",
    "Nimaling", "Kongmaru", "Shang", "Sumdo", "Hemis", "Spituk", "Zingchen", "Yurutse",
    "Gondola", "Skiu", "Tchatchungtse", "Gulmarg", "Pahalgam", "Sonamarg", "Fatehpur Sikri",
    "Poovar", "Trivandrum", "Triveni", "Vivekanand", "Thiruvalluvar", "Annai Indira",
    "Pamban", "Dhanushkodi", "Kalam", "Meenakshi", "Koodal", "Azhagar", "Gandhi Memorial",
    "Thirumalai", "Nayakkar", "Patan", "Sarnath", "Bodhgaya", "Rajgir", "Nalanda"
  ];
  
  for (const place of commonPlaces) {
    if (text.includes(place) && !locations.includes(place)) {
      locations.push(place);
    }
  }
  return locations;
}

function highlightKeywords(text: string): React.ReactNode {
  // Highlight key terms in description
  const keywords = [
    { word: /(arrival|arrive|check.?in|meet|transfer|transfer to|transfer for)/gi, className: "text-brass/90 font-medium" },
    { word: /(sightseeing|visit|tour|excursion|explore|discover)/gi, className: "text-white/90 font-medium" },
    { word: /(flight|fly|airport|train|road|drive|coach)/gi, className: "text-brass/80 font-medium" },
    { word: /(houseboat|shikara|cruise|boat|raft)/gi, className: "text-white/90 font-medium" },
    { word: /(trek|hike|walk|climb|acclimat|altitude)/gi, className: "text-brass/80 font-medium" },
    { word: /(temple|fort|palace|monument|museum|heritage|monastery)/gi, className: "text-white/90 font-medium" },
    { word: /(wildlife|safari|national park|sanctuary|rhino|tiger)/gi, className: "text-brass/80 font-medium" },
    { word: /(leisure|free|relax|optional)/gi, className: "text-white/70 italic" },
    { word: /(overnight|stay|hotel|accommodation)/gi, className: "text-white/80 font-medium" },
    { word: /(morning|afternoon|evening|full.day|day.trip)/gi, className: "text-white/80 font-medium" },
  ];

  let parts: Array<string | React.ReactNode> = [text];
  
  for (const { word, className } of keywords) {
    const newParts: Array<string | React.ReactNode> = [];
    for (const part of parts) {
      if (typeof part === "string") {
        const regex = word;
        const segments = part.split(regex);
        const matches = [...part.matchAll(regex)].map(m => m[0]);
        for (let i = 0; i < segments.length; i++) {
          if (segments[i]) newParts.push(segments[i]);
          if (i < matches.length) {
            newParts.push(<span key={`match-${i}`} className={className}>{matches[i]}</span>);
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
  // Split into sentences and format
  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim());
  if (sentences.length <= 1) {
    return highlightKeywords(text);
  }
  
  return (
    <div className="space-y-1.5">
      {sentences.map((sentence, i) => (
        <p key={i} className="font-display text-sm md:text-base leading-relaxed text-white/75">
          {highlightKeywords(sentence.trim())}
        </p>
      ))}
    </div>
  );
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
    const newSet = new Set(expandedDays);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setExpandedDays(newSet);
  };

  const scrollToDay = (idx: number) => {
    setSelectedDay(idx);
    const el = document.getElementById(`itinerary-day-${idx}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (days.length === 0) {
    return (
      <section className="border-t border-white/10 bg-[#0C1617] py-16 md:py-24 text-white" id="itinerary" aria-label="Day-by-day itinerary">
        <Container>
          <div className="text-center py-12">
            <p className="subtitle-large mb-2 text-brass">Curated Route</p>
            <h2 className="text-h3 font-serif text-white mb-4">Day-by-Day Itinerary</h2>
            <p className="font-display text-base text-white/60 max-w-xl mx-auto">
              Detailed day-by-day itinerary will be available upon enquiry. Each journey is tailor-made; exact routing, timings and inclusions are confirmed directly.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-t border-white/10 bg-[#0C1617] py-16 md:py-24 text-white" id="itinerary" aria-label="Day-by-day itinerary">
      <Container>
        {/* Header with Title and Global Toggles */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 border-b border-white/10 pb-6">
          <div className="max-w-2xl">
            <p className="subtitle-large mb-2 text-brass">Curated Route</p>
            <h2 className="text-h3 font-serif text-white">Day-by-Day Itinerary</h2>
            <p className="font-display text-sm md:text-base text-white/75 leading-relaxed mt-2">
              Transcribed from the India Nepal Travel brochure. Day timings, rest days and optional side excursions are verified by direct enquiry.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="rounded-button border border-white/10 bg-[#132325] px-3 py-1.5 text-xs font-display uppercase tracking-wider font-semibold text-white shadow-sm">
              {days.length} Days Itinerary
            </span>
            <button
              type="button"
              onClick={toggleAll}
              className="rounded-button border border-white/10 bg-[#132325] px-3.5 py-1.5 text-xs font-display font-semibold uppercase tracking-wider text-white/75 hover:border-brass hover:text-brass transition-all shadow-sm cursor-pointer"
            >
              {allExpanded ? "Collapse All" : "Expand All"}
            </button>
          </div>
        </div>

        {/* Quick Jump Day Selector Pills */}
        <div className="mb-10">
          <p className="text-[0.65rem] font-display uppercase tracking-[0.25em] text-white/60 mb-3">
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
                      : "bg-[#132325] border border-white/10 text-white/75 hover:border-brass hover:text-brass"
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
            const locations = extractLocations(combinedText);
            const panelId = `day-panel-${idx}`;

            return (
              <div
                key={idx}
                id={`itinerary-day-${idx}`}
                className={`overflow-hidden rounded-[1.25rem] border transition-all duration-300 bg-[#132325] ${
                  isExpanded ? "border-brass/40 shadow-xl" : "border-white/10 shadow-md hover:border-white/20"
                }`}
              >
                {/* Day Header Trigger */}
                <button
                  type="button"
                  onClick={() => toggleDay(idx)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left transition-colors hover:bg-white/5 cursor-pointer"
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
                          <span className="rounded-pill bg-white/5 border border-white/10 px-2.5 py-0.5 text-[0.65rem] font-display uppercase tracking-wider text-white/75 flex items-center gap-1">
                            <span>{activity.icon}</span>
                            <span>{activity.label}</span>
                          </span>
                        )}
                        {locations.length > 0 && (
                          <span className="rounded-pill bg-white/5 border border-white/10 px-2.5 py-0.5 text-[0.65rem] font-display uppercase tracking-wider text-white/75 flex items-center gap-1 text-white/60">
                            <span>📍</span>
                            <span>{locations.slice(0, 2).join(", ")}{locations.length > 2 ? ` +${locations.length - 2}` : ""}</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg md:text-xl font-bold text-white mt-1">
                        {entry.title || `Day ${dayNum} Programme`}
                      </h3>
                    </div>
                  </div>

                  <span className="ml-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-transform duration-200">
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
                  className="border-t border-white/10 px-5 md:px-6 pb-6 pt-4 space-y-4 animate-fade-in-up"
                >
                  {entry.description && (
                    <div className="space-y-2">
                      <p className="text-[0.65rem] font-display uppercase tracking-wider text-white/60 font-semibold">
                        Description
                      </p>
                      <div className="font-display text-sm md:text-base leading-relaxed text-white/75">
                        {formatDescription(entry.description)}
                      </div>
                    </div>
                  )}

                  {/* Extracted Locations */}
                  {locations.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[0.65rem] font-display uppercase tracking-wider text-white/60 font-semibold mb-2">
                        Key Locations
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {locations.map((loc) => (
                          <span
                            key={loc}
                            className="inline-flex items-center gap-1.5 rounded-button border border-white/10 bg-white/5 px-3 py-1 text-xs font-display font-medium text-white/90"
                          >
                            <span className="text-brass">📍</span>
                            <span>{loc}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Transfer Note */}
                  {entry.transfers && (
                    <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-3.5 text-xs font-display text-white/75 flex items-center gap-2.5">
                      <span className="text-brass text-base">🚗</span>
                      <span><strong>Transfer details:</strong> {entry.transfers}</span>
                    </div>
                  )}

                  {/* Activity Type Indicator */}
                  {activity && (
                    <div className="rounded-[0.75rem] border border-white/10 bg-white/5 p-3.5 text-xs font-display text-white/75 flex items-center gap-2.5">
                      <span className="text-brass text-base">{activity.icon}</span>
                      <span><strong>Activity type:</strong> {activity.label}</span>
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