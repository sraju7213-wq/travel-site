"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllRegions } from "@/data/catalogue";
import PackageGrid from "./PackageGrid";
import CoverflowSwiper from "./journeys/CoverflowSwiper";
import ListboxSelect, { type ListboxOption } from "./ui/ListboxSelect";
import { ACTIVITY_TAGS, activityLabel, packageHasActivity } from "@/lib/activities";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";
import { CATEGORIES, type PackageViewModel } from "@/types/travel";

interface FilterState {
  q: string;
  category: string;
  region: string;
  duration: string;
  activity: string;
  sort: string;
}

const ALL = "All";

const DURATION_BUCKETS = [
  { value: ALL, label: "All Durations", short: "Any length", min: 1, max: 4 },
  { value: "short", label: "Short Getaway (1–4 days)", short: "1–4 days", min: 1, max: 4 },
  { value: "classic", label: "Classic Journey (5–8 days)", short: "5–8 days", min: 5, max: 8 },
  { value: "extended", label: "Extended Route (9–14 days)", short: "9–14 days", min: 9, max: 14 },
  { value: "expedition", label: "Grand Expedition (15+ days)", short: "15+ days", min: 15, max: 99 },
];

function parseDays(durationStr: string): number {
  const nightMatch = durationStr.match(/(\d+)\s*nights?/i);
  if (nightMatch) return parseInt(nightMatch[1], 10) + 1;
  const dayMatch = durationStr.match(/(\d+)\s*days?/i);
  if (dayMatch) return parseInt(dayMatch[1], 10);
  return 1;
}

export default function SearchAndFilters({
  packages,
}: {
  packages: PackageViewModel[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInitial = useRef(true);

  const [state, setState] = useState<FilterState>(() => ({
    q: searchParams.get("q") ?? "",
    category: searchParams.get("category") ?? ALL,
    region: searchParams.get("region") ?? ALL,
    duration: searchParams.get("duration") ?? ALL,
    activity: searchParams.get("activity") ?? ALL,
    sort: searchParams.get("sort") ?? "title",
  }));

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const closeFiltersRef = useRef<HTMLButtonElement>(null);
  const filtersTriggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [viewMode, setViewMode] = useState<"coverflow" | "grid">("grid");

  // The filter drawer is modal on phones, so the page behind must not scroll.
  useBodyOverflowLock(mobileFiltersOpen);

  // Every control inside the drawer unmounts with it, so closing must hand
  // focus back to the button that opened the drawer; otherwise the browser
  // drops focus onto <body> and keyboard users lose their place.
  const closeFilters = useCallback(() => {
    setMobileFiltersOpen(false);
    filtersTriggerRef.current?.focus();
  }, []);

  // Sync keyboard escape for mobile drawer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileFiltersOpen) {
        closeFilters();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileFiltersOpen, closeFilters]);

  // URL Query Sync
  const lastPushedRef = useRef<string>("");

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category !== ALL) params.set("category", state.category);
    if (state.region !== ALL) params.set("region", state.region);
    if (state.duration !== ALL) params.set("duration", state.duration);
    if (state.activity !== ALL) params.set("activity", state.activity);
    if (state.sort !== "title") params.set("sort", state.sort);
    const newUrl = `/journeys${params.toString() ? `?${params.toString()}` : ""}#catalogue`;
    if (newUrl !== lastPushedRef.current) {
      router.push(newUrl, { scroll: false });
      lastPushedRef.current = newUrl;
    }
  }, [router, state]);

  useEffect(() => {
    if (isInitial.current) return;
    const nextState: FilterState = {
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? ALL,
      region: searchParams.get("region") ?? ALL,
      duration: searchParams.get("duration") ?? ALL,
      activity: searchParams.get("activity") ?? ALL,
      sort: searchParams.get("sort") ?? "title",
    };
    setState(nextState);
  }, [searchParams]);

  const activeFilterCount =
    (state.q ? 1 : 0) +
    (state.category !== ALL ? 1 : 0) +
    (state.region !== ALL ? 1 : 0) +
    (state.duration !== ALL ? 1 : 0) +
    (state.activity !== ALL ? 1 : 0);

  // Region options sorted by package presence
  const regions = useMemo(() => {
    const all = getAllRegions();
    return all.sort((a, b) => {
      const countA = packages.filter((p) => p.region.includes(a)).length;
      const countB = packages.filter((p) => p.region.includes(b)).length;
      return countB - countA || a.localeCompare(b);
    });
  }, [packages]);

  // Listbox options: keep the trigger label clean and move counts into `meta`.
  const regionOptions = useMemo<ListboxOption[]>(
    () => [
      { value: ALL, label: "All Regions", meta: `${packages.length} journeys` },
      ...regions.map((r) => ({
        value: r,
        label: r,
        meta: `${packages.filter((p) => p.region.includes(r)).length} journeys`,
      })),
    ],
    [packages, regions]
  );

  const activityOptions = useMemo<ListboxOption[]>(
    () => [
      { value: ALL, label: "Any Activity" },
      ...ACTIVITY_TAGS.map((a) => ({ value: a.key, label: a.label })),
    ],
    []
  );

  // Desktop chips use the compact label; the drawer has room for the full one.
  const durationOptions = useMemo<ListboxOption[]>(
    () => DURATION_BUCKETS.map((d) => ({ value: d.value, label: d.short })),
    []
  );
  const durationDrawerOptions = useMemo<ListboxOption[]>(
    () => DURATION_BUCKETS.map((d) => ({ value: d.value, label: d.label })),
    []
  );

  const sortOptions = useMemo<ListboxOption[]>(
    () => [
      { value: "title", label: "A–Z" },
      { value: "duration-short", label: "Shortest" },
      { value: "duration-long", label: "Longest" },
    ],
    []
  );
  const sortDrawerOptions = useMemo<ListboxOption[]>(
    () => [
      { value: "title", label: "Title (A–Z)" },
      { value: "duration-short", label: "Shortest Duration First" },
      { value: "duration-long", label: "Longest Duration First" },
    ],
    []
  );

  // Filter packages
  const filtered = useMemo(() => {
    return packages.filter((pkg) => {
      const q = state.q.trim().toLowerCase();
      const matchesQuery =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        pkg.slug.toLowerCase().includes(q) ||
        pkg.brochure_code.toLowerCase().includes(q) ||
        pkg.region.some((r: string) => r.toLowerCase().includes(q));

      const matchesCategory = state.category === ALL || pkg.category === state.category;
      const matchesRegion = state.region === ALL || pkg.region.includes(state.region);
      const matchesActivity =
        state.activity === ALL || packageHasActivity(pkg, state.activity);

      let matchesDuration = true;
      if (state.duration !== ALL) {
        const days = parseDays(pkg.duration);
        const bucket = DURATION_BUCKETS.find((b) => b.value === state.duration);
        if (bucket && bucket.min !== undefined && bucket.max !== undefined) {
          matchesDuration = days >= bucket.min && days <= bucket.max;
        } else {
          matchesDuration = pkg.duration === state.duration;
        }
      }

      return (
        matchesQuery &&
        matchesCategory &&
        matchesRegion &&
        matchesActivity &&
        matchesDuration
      );
    });
  }, [packages, state]);

  // Sort packages
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      switch (state.sort) {
        case "duration-short":
          return parseDays(a.duration) - parseDays(b.duration);
        case "duration-long":
          return parseDays(b.duration) - parseDays(a.duration);
        default:
          return a.title.localeCompare(b.title);
      }
    });
  }, [filtered, state.sort]);

  const handleClearAll = () => {
    setState({
      q: "",
      category: ALL,
      region: ALL,
      duration: ALL,
      activity: ALL,
      sort: "title",
    });
    closeFilters();
  };

  return (
    <>
      {/* Sleek Command & Filter Bar */}
      <div className="relative mb-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 backdrop-blur-sm shadow-sm">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          {/* Main Search Input */}
          <div className="relative flex-1">
            <label htmlFor="package-search" className="sr-only">
              Search Itineraries
            </label>
            <div
              className={`relative flex items-center rounded-xl border bg-black/30 transition-all duration-300 ${
                isSearchFocused
                  ? "border-[var(--color-wild-orange)] shadow-[0_0_20px_rgba(212,147,104,0.25)] ring-1 ring-[var(--color-wild-orange)]/40"
                  : "border-white/10 hover:border-white/20"
              }`}
            >
              <svg
                className={`ml-3.5 h-4 w-4 transition-colors duration-200 ${
                  isSearchFocused ? "text-[var(--color-wild-orange)]" : "text-white/60"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                ref={searchInputRef}
                id="package-search"
                type="search"
                value={state.q}
                onChange={(e) => setState({ ...state, q: e.target.value })}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search destination or code…"
                className="min-h-[44px] w-full bg-transparent px-3 py-2.5 text-sm font-sans text-white placeholder:text-white/60 focus:outline-none"
                autoComplete="off"
              />
              {state.q && (
                <button
                  type="button"
                  onClick={() => setState({ ...state, q: "" })}
                  className="mr-1 flex h-11 w-11 items-center justify-center text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                  aria-label="Clear search"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Direct Desktop Dropdown Filters */}
          <div className="hidden flex-wrap items-center gap-2.5 sm:flex">
            {/* Region Dropdown */}
            <ListboxSelect
              id="filter-region-desktop"
              value={state.region}
              options={regionOptions}
              onChange={(region) => setState({ ...state, region })}
              listLabel="Filter by region"
              variant="pill"
              active={state.region !== ALL}
            />

            {/* Activity Dropdown */}
            <ListboxSelect
              id="filter-activity-desktop"
              value={state.activity}
              options={activityOptions}
              onChange={(activity) => setState({ ...state, activity })}
              listLabel="Filter by activity"
              variant="pill"
              active={state.activity !== ALL}
            />

            {/* Duration Dropdown */}
            <ListboxSelect
              id="filter-duration-desktop"
              value={state.duration}
              options={durationOptions}
              onChange={(duration) => setState({ ...state, duration })}
              listLabel="Filter by duration"
              variant="pill"
              active={state.duration !== ALL}
            />

            {/* Sort Dropdown */}
            <ListboxSelect
              id="filter-sort-desktop"
              value={state.sort}
              options={sortOptions}
              onChange={(sort) => setState({ ...state, sort })}
              listLabel="Sort journeys"
              variant="pill"
            />

            {/* Clear All Reset Pill */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 font-sans text-xs font-semibold uppercase tracking-wider text-white/70 transition-all hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] hover:bg-white/10"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Mobile Filter Trigger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              type="button"
              ref={filtersTriggerRef}
              onClick={() => setMobileFiltersOpen(true)}
              className="flex-1 flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 font-sans text-xs font-semibold uppercase tracking-wider text-white transition-all hover:border-brass hover:text-brass"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-wild-orange)] px-1.5 text-[11px] font-bold text-[#0C1617]">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="min-h-[48px] px-3.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white/70"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Category Carousel Navigation */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              type="button"
              onClick={() => setState({ ...state, category: ALL })}
              className={`flex-shrink-0 inline-flex min-h-[46px] items-center gap-2 rounded-full px-3.5 py-2 font-sans text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                state.category === ALL
                  ? "bg-gradient-to-r from-[var(--color-wild-orange)] to-brass text-[#0C1617] font-bold shadow-[0_4px_16px_rgba(212,147,104,0.35)] scale-[1.02]"
                  : "border border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              <span>All Journeys</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                state.category === ALL ? "bg-black/25 text-[#0C1617]" : "bg-black/30 text-white/85"
              }`}>
                {packages.length}
              </span>
            </button>

            {CATEGORIES.map((cat) => {
              const count = packages.filter((p) => p.category === cat).length;
              const isSelected = state.category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setState({ ...state, category: isSelected ? ALL : cat })}
                  className={`flex-shrink-0 inline-flex min-h-[46px] items-center gap-2 rounded-full px-3.5 py-2 font-sans text-xs font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-[var(--color-wild-orange)] to-brass text-[#0C1617] font-bold shadow-[0_4px_16px_rgba(212,147,104,0.35)] scale-[1.02]"
                      : "border border-white/10 bg-white/[0.04] text-white/75 hover:border-white/25 hover:text-white hover:bg-white/[0.08]"
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isSelected ? "bg-black/25 text-[#0C1617]" : "bg-black/30 text-white/85"
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-2 border-t border-white/5 pt-2.5">
            <span className="font-sans text-[11px] uppercase tracking-wider text-white/60">
              Active filters:
            </span>
            {state.q && (
              <FilterPill label={`"${state.q}"`} onRemove={() => setState({ ...state, q: "" })} />
            )}
            {state.category !== ALL && (
              <FilterPill label={state.category} onRemove={() => setState({ ...state, category: ALL })} />
            )}
            {state.region !== ALL && (
              <FilterPill label={`Region: ${state.region}`} onRemove={() => setState({ ...state, region: ALL })} />
            )}
            {state.duration !== ALL && (
              <FilterPill
                label={DURATION_BUCKETS.find((b) => b.value === state.duration)?.label ?? state.duration}
                onRemove={() => setState({ ...state, duration: ALL })}
              />
            )}
            {state.activity !== ALL && (
              <FilterPill
                label={`Activity: ${activityLabel(state.activity)}`}
                onRemove={() => setState({ ...state, activity: ALL })}
              />
            )}
          </div>
        )}
      </div>

      {/* Control Bar: Result Count & Segmented View Switcher */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Results indicator */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-sans text-sm font-medium text-white/80">
            <strong className="text-white font-semibold">{sorted.length}</strong> {sorted.length === 1 ? "journey" : "journeys"} available
          </span>
          {sorted.length < packages.length && (
            <span className="text-xs text-white/60">
              (filtered from {packages.length})
            </span>
          )}
        </div>

        {/* Segmented View Switcher */}
        <div className="inline-flex w-full items-center rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-md shadow-inner sm:w-auto">
          <button
            type="button"
            onClick={() => setViewMode("coverflow")}
            aria-pressed={viewMode === "coverflow"}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer sm:flex-none min-h-[46px] ${
              viewMode === "coverflow"
                ? "bg-gradient-to-r from-brass to-[var(--color-wild-orange)] text-[#0C1617] shadow-[0_4px_12px_rgba(212,147,104,0.3)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="3" width="20" height="18" rx="2" />
              <line x1="8" y1="3" x2="8" y2="21" />
              <line x1="16" y1="3" x2="16" y2="21" />
            </svg>
            <span>3D Coverflow</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer sm:flex-none min-h-[46px] ${
              viewMode === "grid"
                ? "bg-gradient-to-r from-brass to-[var(--color-wild-orange)] text-[#0C1617] shadow-[0_4px_12px_rgba(212,147,104,0.3)]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative min-h-[400px]">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#101b1d]/40 p-12 text-center backdrop-blur-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-[var(--color-wild-orange)]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-light text-white">No journeys found</h3>
            <p className="mt-2 max-w-md font-sans text-sm text-white/60">
              We couldn&apos;t find any itineraries matching your current filters. Try expanding your search terms or clearing filters.
            </p>
            <button
              type="button"
              onClick={handleClearAll}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-6 py-2.5 font-sans text-xs font-semibold text-[#0C1617] transition-all hover:bg-[var(--color-wild-orange-hover)]"
            >
              Reset all filters
            </button>
          </div>
        ) : viewMode === "coverflow" ? (
          <CoverflowSwiper packages={sorted} />
        ) : (
          <PackageGrid packages={sorted} />
        )}
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter Journeys"
          className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden"
        >
          <button
            type="button"
            aria-label="Close filters"
            onClick={closeFilters}
            className="absolute inset-0 h-full w-full cursor-default bg-black/80 backdrop-blur-md"
          />
          <div className="relative max-h-[85vh] flex flex-col rounded-t-3xl border-t border-white/15 bg-[#0e181a] p-6 shadow-2xl overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-light text-white">Filter Itineraries</h3>
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-[var(--color-wild-orange)] px-2 py-0.5 text-xs font-bold text-[#0C1617]">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                ref={closeFiltersRef}
                onClick={closeFilters}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white"
                aria-label="Close filters"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 py-5">
              {/* Region */}
              <div>
                <label htmlFor="filter-region" className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-white/70">
                  Region
                </label>
                <ListboxSelect
                  id="filter-region"
                  value={state.region}
                  options={regionOptions}
                  onChange={(region) => setState({ ...state, region })}
                  listLabel="Region"
                  variant="drawer"
                />
              </div>

              {/* Activity */}
              <div>
                <label htmlFor="filter-activity" className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-white/70">
                  Activity
                </label>
                <ListboxSelect
                  id="filter-activity"
                  value={state.activity}
                  options={activityOptions}
                  onChange={(activity) => setState({ ...state, activity })}
                  listLabel="Activity"
                  variant="drawer"
                />
              </div>

              {/* Duration */}
              <div>
                <label htmlFor="filter-duration" className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-white/70">
                  Duration
                </label>
                <ListboxSelect
                  id="filter-duration"
                  value={state.duration}
                  options={durationDrawerOptions}
                  onChange={(duration) => setState({ ...state, duration })}
                  listLabel="Duration"
                  variant="drawer"
                />
              </div>

              {/* Sort */}
              <div>
                <label htmlFor="filter-sort" className="mb-2 block font-sans text-xs font-semibold uppercase tracking-wider text-white/70">
                  Sort By
                </label>
                <ListboxSelect
                  id="filter-sort"
                  value={state.sort}
                  options={sortDrawerOptions}
                  onChange={(sort) => setState({ ...state, sort })}
                  listLabel="Sort By"
                  variant="drawer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 h-12 rounded-xl border border-white/20 bg-white/5 font-sans text-xs font-semibold uppercase tracking-wider text-white/80"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={closeFilters}
                className="flex-[2] h-12 rounded-xl bg-[var(--color-wild-orange)] font-sans text-xs font-bold uppercase tracking-wider text-[#0C1617]"
              >
                Show {sorted.length} {sorted.length === 1 ? "Journey" : "Journeys"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-sans text-xs font-medium text-white/85">
      <span>{label}</span>
      <button
        type="button"
        onClick={onRemove}
        className="-m-2 flex h-9 w-9 items-center justify-center text-white/70 hover:text-white transition-colors rounded-full"
        aria-label={`Remove filter ${label}`}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}
