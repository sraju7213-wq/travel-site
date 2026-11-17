"use client";

import { useMemo, useState } from "react";
import ActivityIcon from "@/components/package/ActivityIcon";
import { ACTIVITY_LABELS, cleanStopName, detectActivity, type ActivityKind } from "@/lib/itinerary";
import type { TravelPackage } from "@/types/travel";

interface RouteMapProps {
  pkg: TravelPackage;
}

interface Waypoint {
  id: string;
  name: string;
  dayLabel: string;
  kind: ActivityKind;
  description?: string;
}

const VIEW_W = 500;
const VIEW_H = 240;
const PAD_X = 46;
const BAND_TOP = 86;
const BAND_BOTTOM = 162;

function truncate(value: string, max = 14): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function deriveWaypoints(pkg: TravelPackage): Waypoint[] {
  const list: Waypoint[] = [];
  const itinerary = pkg.itinerary ?? [];

  itinerary.forEach((day, idx) => {
    const dayLabel = day.day ? `Day ${day.day}` : `Day ${idx + 1}`;
    const rawStops =
      day.stops && day.stops.length > 0
        ? day.stops
        : (day.title ?? "").split(/\s*[/\u2013\u2014]\s*/).filter(Boolean);

    rawStops.forEach((raw, sIdx) => {
      const name = cleanStopName(raw);
      if (!name) return;
      const prev = list[list.length - 1];
      if (prev && prev.name.toLowerCase() === name.toLowerCase()) return;
      list.push({
        id: `wp-${idx}-${sIdx}`,
        name,
        dayLabel,
        kind: detectActivity(`${day.title ?? ""} ${day.description ?? ""}`),
        description: day.description || day.title,
      });
    });
  });

  if (list.length === 0) {
    const regions = pkg.region ?? [];
    (regions.length > 0 ? regions : [pkg.title]).forEach((r, idx) => {
      list.push({
        id: `region-${idx}`,
        name: r,
        dayLabel: `Point ${idx + 1}`,
        kind: "sightseeing",
        description: `Regional waypoint across ${r}`,
      });
    });
  }

  return list.slice(0, 8);
}

export default function RouteMap({ pkg }: RouteMapProps) {
  const waypoints = useMemo(() => deriveWaypoints(pkg), [pkg]);
  const [activeId, setActiveId] = useState<string>(waypoints[0]?.id ?? "");

  const points = useMemo(() => {
    const n = waypoints.length;
    return waypoints.map((wp, i) => {
      const t = n > 1 ? i / (n - 1) : 0;
      const x = n > 1 ? PAD_X + (i * (VIEW_W - 2 * PAD_X)) / (n - 1) : VIEW_W / 2;
      const y = BAND_BOTTOM - t * (BAND_BOTTOM - BAND_TOP) + Math.sin(i * 1.5) * 10;
      return { ...wp, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
    });
  }, [waypoints]);

  const active = points.find((p) => p.id === activeId) ?? points[0];

  const googleMapsUrl = useMemo(() => {
    const stops = points.map((p) => p.name).slice(0, 4);
    if (stops.length > 1) {
      return `https://www.google.com/maps/dir/${stops.map(encodeURIComponent).join("/")}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stops[0] ?? pkg.title)}`;
  }, [points, pkg.title]);

  const legs = useMemo(() => {
    const result: Array<{ from: string; to: string; dayLabel: string; kind: ActivityKind }> = [];
    for (let i = 0; i < points.length - 1; i++) {
      result.push({
        from: points[i].name,
        to: points[i + 1].name,
        dayLabel: points[i + 1].dayLabel,
        kind: points[i + 1].kind,
      });
    }
    return result;
  }, [points]);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
            Visual Cartography
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold text-white">
            Topographic Route: {points.length} Waypoint{points.length === 1 ? "" : "s"}
          </h2>
        </div>
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-display text-[11px] font-medium uppercase tracking-[0.14em] text-brass transition hover:text-brass-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <span>Open Full Map</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Stylised route card */}
      <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#0C1617] p-4">
        <div className="relative w-full overflow-hidden rounded-lg border border-white/10 bg-[#0e1620]">
          <svg
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            className="h-auto w-full"
            role="img"
            aria-label={`Route map for ${pkg.title} with ${points.length} waypoints`}
          >
            {/* Terrain contours */}
            <path
              d="M0,180 Q120,130 250,160 T500,100"
              fill="none"
              stroke="#1f2c3d"
              strokeDasharray="4 4"
              strokeWidth="2"
            />
            <path d="M0,80 Q140,50 300,90 T500,40" fill="none" stroke="#1a2433" strokeWidth="1.5" />
            <path d="M0,215 Q160,190 320,205 T500,170" fill="none" stroke="#16202c" strokeWidth="1.5" />

            {/* Route trajectory */}
            {points.length > 1 && (
              <polyline
                points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="none"
                stroke="#d49368"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Waypoints */}
            {points.map((p, idx) => {
              const isActive = active?.id === p.id;
              const isFirst = idx === 0;
              const isLast = idx === points.length - 1;
              return (
                <g
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${p.name}, ${p.dayLabel}`}
                  onClick={() => setActiveId(p.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveId(p.id);
                    }
                  }}
                  className="cursor-pointer outline-none focus-visible:opacity-100"
                >
                  {(isFirst || isLast) && (
                    <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#d49368" strokeOpacity="0.3" strokeWidth="2" />
                  )}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isActive ? 7 : 5}
                    fill={isLast ? "#10b981" : "#d49368"}
                  />
                  <text
                    x={p.x}
                    y={p.y - 14}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {truncate(p.name)}
                  </text>
                  <text x={p.x} y={p.y + 20} fill="#94a3b8" fontSize="9" textAnchor="middle">
                    {p.dayLabel}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active waypoint detail */}
        {active && (
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3">
            <div className="min-w-0">
              <p className="font-display text-[10px] uppercase tracking-[0.16em] text-brass">
                {active.dayLabel} · {ACTIVITY_LABELS[active.kind]}
              </p>
              <p className="mt-0.5 font-serif text-base text-white">{active.name}</p>
              {active.description && (
                <p className="mt-1 line-clamp-2 max-w-2xl font-display text-xs leading-relaxed text-white/55">
                  {active.description}
                </p>
              )}
            </div>
            <ActivityIcon kind={active.kind} className="mt-1 h-4 w-4 shrink-0 text-brass" />
          </div>
        )}

        {/* Leg table */}
        {legs.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {legs.slice(0, 8).map((leg, idx) => (
              <div key={`${leg.from}-${leg.to}`} className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                <div className="font-display text-[10px] uppercase tracking-[0.14em] text-brass">
                  Leg {idx + 1}
                </div>
                <div className="mt-0.5 truncate font-display text-xs font-medium text-white">
                  {truncate(leg.from, 18)} → {truncate(leg.to, 18)}
                </div>
                <div className="mt-1 truncate font-display text-[10px] text-white/60">
                  {leg.dayLabel} · {ACTIVITY_LABELS[leg.kind]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
