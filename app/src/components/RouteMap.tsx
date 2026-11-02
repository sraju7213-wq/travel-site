"use client";

import { useMemo, useState } from "react";
import type { TravelPackage } from "@/types/travel";

interface RouteMapProps {
  pkg: TravelPackage;
}

interface Waypoint {
  id: string;
  name: string;
  dayLabel: string;
  query: string;
  description?: string;
}

export default function RouteMap({ pkg }: RouteMapProps) {
  const [selectedId, setSelectedId] = useState<string>("all");
  const [mapType, setMapType] = useState<"p" | "k" | "m">("p"); // p: terrain, k: satellite, m: standard roadmap

  // Determine country context from regions or package properties
  const regions = pkg.region || [];
  const isNepal =
    regions.some((r) => r.toLowerCase().includes("nepal") || r.toLowerCase().includes("kathmandu")) ||
    pkg.title.toLowerCase().includes("nepal");
  const defaultCountry = isNepal ? "Nepal" : "India";
  const primaryRegion = regions.find((r) => r.toLowerCase() !== "india" && r.toLowerCase() !== "nepal") || "";

  // Extract waypoints from itinerary or fallback to regions
  const waypoints = useMemo(() => {
    const list: Waypoint[] = [];
    const itinerary = pkg.itinerary || [];

    if (itinerary.length > 0) {
      itinerary.forEach((day, idx) => {
        const dayLabel = day.day ? `Day ${day.day}` : `Day ${idx + 1}`;
        const rawStops =
          day.stops && day.stops.length > 0
            ? day.stops
            : day.title
            ? [day.title]
            : [];

        rawStops.forEach((raw, sIdx) => {
          // Clean prefixes like "Drive to", "Flight to", "Excursion to", "Trek to"
          const cleanName = raw
            .replace(/^(drive to|flight to|excursion to|trek to|transfer to|visit|explore|travel to)\s+/i, "")
            .replace(/\s*\/\s*/g, " & ")
            .trim();

          if (!cleanName) return;

          // Avoid repeating identical stop name consecutively
          const prev = list[list.length - 1];
          if (prev && prev.name.toLowerCase() === cleanName.toLowerCase()) {
            return;
          }

          // Build query with regional context for accurate Google Maps lookup
          const query = primaryRegion && !cleanName.toLowerCase().includes(primaryRegion.toLowerCase())
            ? `${cleanName}, ${primaryRegion}, ${defaultCountry}`
            : `${cleanName}, ${defaultCountry}`;

          list.push({
            id: `stop-${idx}-${sIdx}`,
            name: cleanName,
            dayLabel,
            query,
            description: day.description || day.title,
          });
        });
      });
    }

    // Fallback if no itinerary entries found
    if (list.length === 0) {
      const fallbackStops = regions.length > 0 ? regions : [pkg.title];
      fallbackStops.forEach((r, idx) => {
        list.push({
          id: `region-${idx}`,
          name: r,
          dayLabel: `Point ${idx + 1}`,
          query: `${r}, ${defaultCountry}`,
          description: `Regional waypoint across ${r}`,
        });
      });
    }

    return list;
  }, [pkg, primaryRegion, defaultCountry, regions]);

  // Derive active location query & Google Maps embed URL
  const { embedUrl, externalUrl, activeWaypoint } = useMemo(() => {
    let query = "";
    let extUrl = "";
    let activeWp: Waypoint | null = null;

    if (selectedId === "all" || !waypoints.some((w) => w.id === selectedId)) {
      // Full route overview query
      const routeStops = waypoints.slice(0, 4).map((w) => w.name);
      if (routeStops.length > 1) {
        query = `${routeStops.join(" to: ")}, ${defaultCountry}`;
        extUrl = `https://www.google.com/maps/dir/${routeStops.map(encodeURIComponent).join("/")}`;
      } else if (routeStops.length === 1) {
        query = `${routeStops[0]}, ${defaultCountry}`;
        extUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      } else {
        query = `${pkg.title}, ${defaultCountry}`;
        extUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
      }
    } else {
      activeWp = waypoints.find((w) => w.id === selectedId) || waypoints[0];
      query = activeWp.query;
      extUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    const zoom = selectedId === "all" ? (waypoints.length > 3 ? "8" : "9") : "12";
    const src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=${zoom}&output=embed`;

    return { embedUrl: src, externalUrl: extUrl, activeWaypoint: activeWp };
  }, [selectedId, waypoints, defaultCountry, pkg.title, mapType]);

  return (
    <section className="mb-14 scroll-mt-24" id="route-map" aria-label="Journey Google Map">
      {/* Header Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brass animate-pulse" />
            <p className="subtitle-large text-brass font-accent">Google Maps Cartography</p>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-light text-white">
            Interactive Route Map
          </h2>
          <p className="font-sans font-light text-xs sm:text-sm text-white/70 mt-1 max-w-xl">
            Live topographic navigation, terrain waypoints and satellite imagery for {pkg.title}.
          </p>
        </div>

        {/* Action Controls: Map Type Toggles + External Link */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="inline-flex rounded-button border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setMapType("p")}
              className={`rounded-button px-3 py-1 text-[11px] font-accent uppercase tracking-wider transition-all cursor-pointer ${
                mapType === "p"
                  ? "bg-brass text-white font-semibold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Terrain
            </button>
            <button
              type="button"
              onClick={() => setMapType("k")}
              className={`rounded-button px-3 py-1 text-[11px] font-accent uppercase tracking-wider transition-all cursor-pointer ${
                mapType === "k"
                  ? "bg-brass text-white font-semibold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => setMapType("m")}
              className={`rounded-button px-3 py-1 text-[11px] font-accent uppercase tracking-wider transition-all cursor-pointer ${
                mapType === "m"
                  ? "bg-brass text-white font-semibold shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Roadmap
            </button>
          </div>

          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open route in Google Maps app or website"
            className="btn-ghost-dark inline-flex items-center gap-1.5 py-2 px-3 text-[11px] font-accent tracking-wider uppercase"
          >
            <span>Open in Google Maps</span>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-[2]">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Main Map Box */}
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/10 bg-[#132325] text-white shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr]">
          {/* Waypoints Sidebar Selector */}
          <div className="border-b border-white/10 lg:border-b-0 lg:border-r p-4 sm:p-5 flex flex-col justify-between max-h-[540px] overflow-y-auto">
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-white/60">
                <span className="font-accent uppercase tracking-wider text-brass-soft">
                  Route Waypoints
                </span>
                <span className="font-mono text-[10px] text-white/50">
                  {waypoints.length} stops
                </span>
              </div>

              {/* Waypoint list buttons */}
              <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
                {/* Full Route Overview Button */}
                <button
                  type="button"
                  onClick={() => setSelectedId("all")}
                  className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer shrink-0 ${
                    selectedId === "all"
                      ? "border-brass bg-brass/20 text-white shadow-md ring-1 ring-brass/50"
                      : "border-white/5 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-accent text-[11px] font-semibold uppercase tracking-wider text-brass-soft">
                      Complete Circuit
                    </span>
                    <span className="font-mono text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-white/70">
                      All Legs
                    </span>
                  </div>
                  <p className="font-serif text-sm font-light text-white mt-1">
                    Full Route Overview
                  </p>
                </button>

                {/* Individual Itinerary Waypoint Stops */}
                {waypoints.map((wp, index) => {
                  const isSelected = selectedId === wp.id;
                  return (
                    <button
                      key={wp.id}
                      type="button"
                      onClick={() => setSelectedId(wp.id)}
                      className={`w-full text-left rounded-xl p-3 border transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? "border-brass bg-brass/20 text-white shadow-md ring-1 ring-brass/50"
                          : "border-white/5 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-brass-soft">
                          {wp.dayLabel}
                        </span>
                        <span className="font-mono text-[10px] text-white/50">
                          Leg {index + 1}
                        </span>
                      </div>
                      <p className="font-serif text-sm font-light text-white mt-0.5 truncate">
                        {wp.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Waypoint Brief Note */}
            {activeWaypoint && activeWaypoint.description && (
              <div className="mt-4 pt-4 border-t border-white/10 hidden lg:block">
                <p className="font-mono text-[10px] uppercase tracking-wider text-brass-soft">
                  {activeWaypoint.dayLabel} Destination Focus
                </p>
                <p className="font-sans font-light text-xs text-white/70 mt-1 line-clamp-3 leading-relaxed">
                  {activeWaypoint.description}
                </p>
              </div>
            )}
          </div>

          {/* Google Maps Interactive Frame */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto min-h-[380px] sm:min-h-[460px] lg:min-h-[540px] w-full bg-[#0C1617]">
            <iframe
              key={`${embedUrl}-${mapType}`}
              src={embedUrl}
              title={`Google Map for ${pkg.title}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 filter brightness-[0.92] contrast-[1.05]"
            />

            {/* Interactive Overlay Badge */}
            <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 backdrop-blur-md shadow-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              <span className="font-accent text-[10px] uppercase tracking-wider text-brass-soft font-semibold">
                Google Maps Live View
              </span>
              <span className="text-white/40">&bull;</span>
              <span className="font-sans text-[11px] font-light text-white/80">
                {selectedId === "all" ? "Subcontinent Trail Overview" : activeWaypoint?.name}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
