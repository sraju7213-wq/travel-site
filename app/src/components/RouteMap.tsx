"use client";

import { useMemo, useState } from "react";
import type { TravelPackage } from "@/types/travel";

interface RouteMapProps {
  pkg: TravelPackage;
}

interface CoordinateStop {
  id: string;
  name: string;
  day: string;
  x: number; // 0 - 100% SVG coordinates
  y: number; // 0 - 100% SVG coordinates
  description?: string;
  transport?: string;
}

// Subcontinent geographic reference points mapped to a responsive 800x500 SVG canvas
const KNOWN_COORDINATES: Record<string, { x: number; y: number; region: string }> = {
  // North & Golden Triangle
  delhi: { x: 380, y: 220, region: "North India" },
  agra: { x: 420, y: 250, region: "Uttar Pradesh" },
  jaipur: { x: 340, y: 260, region: "Rajasthan" },
  jodhpur: { x: 260, y: 280, region: "Rajasthan" },
  udaipur: { x: 280, y: 340, region: "Rajasthan" },
  varanasi: { x: 540, y: 270, region: "Uttar Pradesh" },

  // Kashmir & Ladakh
  srinagar: { x: 310, y: 90, region: "Kashmir" },
  gulmarg: { x: 290, y: 85, region: "Kashmir" },
  sonamarg: { x: 325, y: 80, region: "Kashmir" },
  pahalgam: { x: 320, y: 105, region: "Kashmir" },
  leh: { x: 380, y: 95, region: "Ladakh" },
  nubra: { x: 395, y: 75, region: "Ladakh" },
  pangong: { x: 415, y: 100, region: "Ladakh" },
  markha: { x: 375, y: 110, region: "Ladakh" },
  zanskar: { x: 350, y: 125, region: "Ladakh" },

  // Nepal
  kathmandu: { x: 620, y: 230, region: "Nepal" },
  pokhara: { x: 570, y: 225, region: "Nepal" },
  chitwan: { x: 585, y: 245, region: "Nepal" },
  trisuli: { x: 595, y: 230, region: "Nepal" },
  annapurna: { x: 560, y: 215, region: "Nepal" },

  // West & South
  bombay: { x: 240, y: 410, region: "Maharashtra" },
  mumbai: { x: 240, y: 410, region: "Maharashtra" },
  goa: { x: 250, y: 470, region: "Goa" },
  cochin: { x: 290, y: 550, region: "Kerala" },
  kochi: { x: 290, y: 550, region: "Kerala" },
  munnar: { x: 310, y: 540, region: "Kerala" },
  alleppey: { x: 295, y: 565, region: "Kerala" },
  thekkady: { x: 315, y: 555, region: "Kerala" },
  kovalam: { x: 300, y: 585, region: "Kerala" },
};

function normalizeName(str: string): string {
  return str.toLowerCase().replace(/[^a-z]/g, "");
}

function findCoords(name: string): { x: number; y: number; region: string } | null {
  const norm = normalizeName(name);
  for (const [key, coords] of Object.entries(KNOWN_COORDINATES)) {
    if (norm.includes(key) || key.includes(norm)) {
      return coords;
    }
  }
  return null;
}

export default function RouteMap({ pkg }: RouteMapProps) {
  const [activeStopIndex, setActiveStopIndex] = useState<number>(0);
  const [mapMode, setMapMode] = useState<"route" | "elevation">("route");

  // Derive stops from itinerary days
  const stops: CoordinateStop[] = useMemo(() => {
    const list: CoordinateStop[] = [];
    const itinerary = pkg.itinerary || [];

    if (itinerary.length > 0) {
      itinerary.forEach((dayEntry, idx) => {
        const dayLabel = String(dayEntry.day ?? idx + 1);
        const dayStops = dayEntry.stops && dayEntry.stops.length > 0 ? dayEntry.stops : [dayEntry.title || `Day ${dayLabel}`];

        dayStops.forEach((stopName) => {
          const coords = findCoords(stopName);
          if (coords) {
            // Avoid duplicate consecutive identical stops
            const last = list[list.length - 1];
            if (!last || last.name !== stopName) {
              list.push({
                id: `${stopName}-${idx}`,
                name: stopName,
                day: dayLabel,
                x: coords.x,
                y: coords.y,
                description: dayEntry.description,
                transport: dayEntry.transfers,
              });
            }
          }
        });
      });
    }

    // Fallback: If no itinerary stops mapped, use pkg.region
    if (list.length === 0) {
      pkg.region.forEach((r, idx) => {
        const coords = findCoords(r) || { x: 350 + idx * 70, y: 220 + idx * 40, region: r };
        list.push({
          id: `region-${idx}`,
          name: r,
          day: `${idx + 1}`,
          x: coords.x,
          y: coords.y,
          description: `Key region explored during ${pkg.title}.`,
        });
      });
    }

    // Default fallbacks if still minimal
    if (list.length === 1) {
      list.push({
        id: "return-stop",
        name: `${list[0].name} (Return)`,
        day: "Departure",
        x: list[0].x + 35,
        y: list[0].y + 25,
        description: "Return transfer and departure.",
      });
    }

    return list;
  }, [pkg]);

  // Generate SVG path connecting stops
  const pathD = useMemo(() => {
    if (stops.length < 2) return "";
    return stops.reduce((acc, curr, i) => {
      if (i === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth quadratic curve towards each point
      const prev = stops[i - 1];
      const cx = (prev.x + curr.x) / 2;
      const cy = (prev.y + curr.y) / 2 - 15;
      return `${acc} Q ${cx} ${cy} ${curr.x} ${curr.y}`;
    }, "");
  }, [stops]);

  const activeStop = stops[activeStopIndex] ?? stops[0];

  return (
    <section className="mb-14" aria-label="Interactive itinerary route map">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="subtitle-large mb-1 text-brass">Journey Route &amp; Navigation</p>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
            Interactive Route Map
          </h2>
          <p className="font-display text-sm text-charcoal-soft mt-1">
            Explore the departure waypoints, transit legs, and overnight stays for {pkg.title}.
          </p>
        </div>

        {/* View mode toggle tabs */}
        <div className="flex items-center gap-1.5 rounded-button border border-border bg-white p-1 shadow-sm shrink-0">
          <button
            type="button"
            onClick={() => setMapMode("route")}
            className={`rounded-button px-3.5 py-1.5 text-xs font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              mapMode === "route"
                ? "bg-forest text-white shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Route Map
          </button>
          <button
            type="button"
            onClick={() => setMapMode("elevation")}
            className={`rounded-button px-3.5 py-1.5 text-xs font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
              mapMode === "elevation"
                ? "bg-forest text-white shadow-sm"
                : "text-charcoal-soft hover:text-charcoal"
            }`}
          >
            Elevation &amp; Leg Guide
          </button>
        </div>
      </div>

      {/* Main Luxury Map Canvas Container */}
      <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#123438] text-white shadow-2xl">
        {/* Atmospheric Topographic Canvas Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"
        />

        {/* Wilderness Brand Map Coordinates Eyebrow */}
        <div className="absolute left-6 top-6 z-10 hidden sm:flex items-center gap-4 text-[0.65rem] font-display uppercase tracking-[0.3em] text-white/60">
          <span>{stops.length} Waypoints Recorded</span>
          <span className="h-1 w-1 rounded-full bg-brass" />
          <span>India &amp; Nepal Subcontinent Trail</span>
        </div>

        {mapMode === "route" ? (
          <div className="relative p-6 pt-14 sm:p-10 sm:pt-16">
            {/* SVG Visual Stage */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full max-h-[520px]">
              <svg
                viewBox="200 50 500 350"
                className="h-full w-full overflow-visible"
                aria-label="Route map illustration"
              >
                <defs>
                  {/* Glowing golden-orange trail gradient */}
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff6e00" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#ffa866" stopOpacity="1" />
                    <stop offset="100%" stopColor="#ff6e00" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Soft trail glow filter */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Subtle topographic contour background curves */}
                <g opacity="0.12" stroke="white" strokeWidth="1" fill="none">
                  <path d="M 220 180 Q 350 140 480 200 T 700 160" />
                  <path d="M 200 240 Q 320 200 460 260 T 680 220" />
                  <path d="M 240 300 Q 380 260 520 320 T 720 280" />
                  <path d="M 220 360 Q 360 320 500 380 T 700 340" />
                </g>

                {/* Connecting Route Trail Line */}
                {pathD && (
                  <>
                    {/* Shadow halo */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#000000"
                      strokeWidth="6"
                      opacity="0.5"
                      strokeLinecap="round"
                    />
                    {/* Glowing trail */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="url(#routeGradient)"
                      strokeWidth="3.5"
                      strokeDasharray="6 4"
                      filter="url(#glow)"
                      strokeLinecap="round"
                    />
                  </>
                )}

                {/* Stops Marker Pins */}
                {stops.map((stop, idx) => {
                  const isActive = activeStopIndex === idx;
                  return (
                    <g
                      key={stop.id}
                      onClick={() => setActiveStopIndex(idx)}
                      className="cursor-pointer group"
                    >
                      {/* Active pulsed halo ring */}
                      {isActive && (
                        <circle
                          cx={stop.x}
                          cy={stop.y}
                          r="16"
                          fill="none"
                          stroke="#ff6e00"
                          strokeWidth="2"
                          opacity="0.6"
                          className="animate-ping origin-center"
                        />
                      )}

                      {/* Exterior pin ring */}
                      <circle
                        cx={stop.x}
                        cy={stop.y}
                        r={isActive ? "10" : "7"}
                        fill={isActive ? "#ff6e00" : "#123438"}
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all duration-300 group-hover:r-[10] group-hover:fill-[#ff6e00]"
                      />

                      {/* Numbered inner marker */}
                      <text
                        x={stop.x}
                        y={stop.y + (isActive ? 3.5 : 3)}
                        fontSize={isActive ? "8" : "7"}
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                        fill="#ffffff"
                        className="pointer-events-none select-none"
                      >
                        {idx + 1}
                      </text>

                      {/* Name label beside pin */}
                      <text
                        x={stop.x}
                        y={stop.y - 12}
                        fontSize="9"
                        fontFamily="serif"
                        fontWeight="bold"
                        letterSpacing="0.05em"
                        textAnchor="middle"
                        fill={isActive ? "#ffffff" : "rgba(255, 255, 255, 0.75)"}
                        className="transition-colors group-hover:fill-white select-none pointer-events-none drop-shadow-md"
                      >
                        {stop.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Interactive Stop Detail Card Floating at Bottom of Map */}
            <div className="mt-6 rounded-[1rem] border border-white/15 bg-black/60 p-5 md:p-6 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass text-white font-serif text-base font-bold shadow-md">
                  {activeStopIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.65rem] font-display font-semibold uppercase tracking-wider text-brass">
                      Day {activeStop.day}
                    </span>
                    {activeStop.transport && (
                      <span className="text-white/60 text-xs font-display">
                        · {activeStop.transport}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-white mt-0.5">
                    {activeStop.name}
                  </h3>
                  {activeStop.description && (
                    <p className="mt-1 font-display text-xs md:text-sm text-white/80 line-clamp-2 max-w-2xl leading-relaxed">
                      {activeStop.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Waypoint step buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => setActiveStopIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeStopIndex === 0}
                  aria-label="Previous route stop"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-brass hover:border-brass disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  &larr;
                </button>
                <span className="px-2 text-xs font-display tabular-nums tracking-wider text-white/70">
                  {activeStopIndex + 1} of {stops.length}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveStopIndex((prev) => Math.min(stops.length - 1, prev + 1))}
                  disabled={activeStopIndex === stops.length - 1}
                  aria-label="Next route stop"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:bg-brass hover:border-brass disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  &rarr;
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Elevation & Leg Guide Mode */
          <div className="p-6 sm:p-10 space-y-6 pt-14">
            <div className="border-b border-white/10 pb-4">
              <h3 className="font-serif text-xl font-bold text-white">Route Transit &amp; Leg Profile</h3>
              <p className="font-display text-xs text-white/70 mt-1">
                Sequential transit legs, transfers, and day-by-day exploration pace for {pkg.title}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stops.map((stop, idx) => (
                <div
                  key={stop.id}
                  onClick={() => {
                    setActiveStopIndex(idx);
                    setMapMode("route");
                  }}
                  className="group rounded-[1rem] border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-brass/40 cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-display text-brass mb-2">
                    <span className="font-bold">Leg {idx + 1}</span>
                    <span className="text-white/60">Day {stop.day}</span>
                  </div>
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-brass transition-colors">
                    {stop.name}
                  </h4>
                  <p className="font-display text-xs text-white/75 mt-1 line-clamp-2 leading-relaxed">
                    {stop.description || "Scenic waypoint and scheduled itinerary programme."}
                  </p>
                  {stop.transport && (
                    <span className="mt-3 inline-block rounded-pill bg-black/40 px-2.5 py-0.5 text-[0.65rem] font-display text-white/80 border border-white/10">
                      🚗 {stop.transport}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
