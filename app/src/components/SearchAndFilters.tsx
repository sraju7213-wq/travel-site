"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllRegions, getAllDurations } from "@/data/catalogue";
import PackageGrid from "./PackageGrid";
import { CATEGORIES, type PackageViewModel } from "@/types/travel";

interface FilterState {
  q: string;
  category: string;
  region: string;
  duration: string;
  sort: string;
}

const ALL = "All";

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
    sort: searchParams.get("sort") ?? "title",
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const closeFiltersRef = useRef<HTMLButtonElement>(null);
  const filtersPanelRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileFiltersOpen) {
        setMobileFiltersOpen(false);
        closeFiltersRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileFiltersOpen]);

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
    if (state.sort !== "title") params.set("sort", state.sort);
    const newUrl = `/explore${params.toString() ? `?${params.toString()}` : ""}`;
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
      sort: searchParams.get("sort") ?? "title",
    };
    setState(nextState);
  }, [searchParams]);

  const activeFilterCount =
    (state.q ? 1 : 0) +
    (state.category !== ALL ? 1 : 0) +
    (state.region !== ALL ? 1 : 0) +
    (state.duration !== ALL ? 1 : 0);
  const categories = Array.from(new Set(packages.map((p) => p.category))).sort();
  const regions = getAllRegions();
  const durations = getAllDurations();

  const filtered = packages.filter((pkg) => {
    const matchesQuery =
      !state.q ||
      pkg.title.toLowerCase().includes(state.q.toLowerCase()) ||
      pkg.slug.toLowerCase().includes(state.q.toLowerCase()) ||
      pkg.brochure_code.toLowerCase().includes(state.q.toLowerCase()) ||
      pkg.region.some((r: string) => r.toLowerCase().includes(state.q.toLowerCase()));
    const matchesCategory = state.category === ALL || pkg.category === state.category;
    const matchesRegion = state.region === ALL || pkg.region.includes(state.region);
    const matchesDuration = state.duration === ALL || pkg.duration === state.duration;
    return matchesQuery && matchesCategory && matchesRegion && matchesDuration;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (state.sort) {
      case "duration-short":
        return parseDurationNights(a.duration) - parseDurationNights(b.duration);
      case "duration-long":
        return parseDurationNights(b.duration) - parseDurationNights(a.duration);
      default:
        return a.title.localeCompare(b.title);
    }
  });

  const handleClearAll = () => {
    setState({
      q: "",
      category: ALL,
      region: ALL,
      duration: ALL,
      sort: "title",
    });
    setMobileFiltersOpen(false);
  };

  return (
    <>
      {/* Search & Primary Actions Bar */}
      <div className="relative mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label htmlFor="package-search" className="sr-only">
              Search Brochure Itineraries
            </label>
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "scale-[1.02] shadow-[0_0_0_1px_rgba(177,138,81,0.4)]" : ""
              }`}
            >
              <div className="absolute inset-0 rounded-button bg-gradient-to-r from-brass/10 to-transparent opacity-0 transition-opacity pointer-events-none" aria-hidden="true" />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors duration-200 group-focus-within:text-brass"
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
                placeholder="Search by name, code (S01, II7, HE18) or destination…"
                className="w-full rounded-button border border-white/10 bg-[#132325] px-12 py-3.5 text-sm font-display text-white placeholder:text-white/40 transition-all duration-300 focus:border-brass focus:bg-[#1a2a2c] focus:outline-none focus:ring-2 focus:ring-brass/20"
                autoComplete="off"
              />
              {state.q && (
                <button
                  type="button"
                  onClick={() => setState({ ...state, q: "" })}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-brass transition-colors rounded-full hover:bg-white/5"
                  aria-label="Clear search"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 sm:flex-nowrap">
            {/* Clear All Filters */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="hidden sm:flex items-center gap-2 rounded-button border border-white/10 bg-transparent px-4 py-3.5 text-xs font-display font-semibold uppercase tracking-wider text-white/70 hover:border-brass hover:text-brass hover:bg-white/5 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Clear all
              </button>
            )}

            {/* Mobile Filters Trigger */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex sm:hidden items-center justify-center gap-2 h-[52px] rounded-button border border-white/10 bg-[#132325] px-5 text-xs font-display font-semibold uppercase tracking-wider text-white transition-all hover:border-brass hover:text-brass hover:bg-[#1a2a2c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass shadow-sm cursor-pointer"
              aria-expanded={mobileFiltersOpen}
              aria-controls="mobile-filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brass px-1.5 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Chips - always visible */}
        <div className="mt-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <FilterChip
              label={`All Journeys (${packages.length})`}
              isActive={state.category === ALL}
              onClick={() => setState({ ...state, category: ALL })}
              isPrimary={state.category === ALL}
            />
            {CATEGORIES.map((cat) => {
              const count = packages.filter((p) => p.category === cat).length;
              const isSelected = state.category === cat;
              return (
                <FilterChip
                  key={cat}
                  label={`${cat} (${count})`}
                  isActive={isSelected}
                  onClick={() => setState({ ...state, category: isSelected ? ALL : cat })}
                />
              );
            })}
          </div>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Active filters">
            {state.q && (
              <FilterPill label={`Search: "${state.q}"`} onRemove={() => setState({ ...state, q: "" })} />
            )}
            {state.category !== ALL && (
              <FilterPill label={state.category} onRemove={() => setState({ ...state, category: ALL })} />
            )}
            {state.region !== ALL && (
              <FilterPill label={state.region} onRemove={() => setState({ ...state, region: ALL })} />
            )}
            {state.duration !== ALL && (
              <FilterPill label={state.duration} onRemove={() => setState({ ...state, duration: ALL })} />
            )}
            <button
              type="button"
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 rounded-button border border-white/10 bg-transparent px-3 py-1.5 text-xs font-display font-medium uppercase tracking-wider text-white/60 hover:border-brass hover:text-brass hover:bg-white/5 transition-all"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer */}
      <div
        ref={filtersPanelRef}
        id="mobile-filters"
        hidden={!mobileFiltersOpen}
        className="fixed inset-0 z-50 flex flex-col bg-[#0C1617] animate-slide-in"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-lg font-serif font-bold text-white">
            Filters{activeFilterCount > 0 ? ` <span className="font-display text-brass">(${activeFilterCount})</span>` : ""}
          </h2>
          <button
            ref={closeFiltersRef}
            onClick={() => setMobileFiltersOpen(false)}
            className="p-2 text-white/70 hover:text-brass hover:bg-white/5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1617]"
            aria-label="Close filters"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 px-6 py-6 overflow-y-auto">
          <div className="space-y-6">
            <FilterSection
              label="Category"
              options={[{ value: ALL, label: "All categories", count: packages.length }, ...categories.map((c) => ({ value: c, label: c, count: packages.filter((p) => p.category === c).length }))]}
              value={state.category}
              onChange={(v) => setState({ ...state, category: v })}
            />
            <FilterSection
              label="Region"
              options={[{ value: ALL, label: "All regions", count: packages.length }, ...regions.map((r) => ({ value: r, label: r, count: packages.filter((p) => p.region.includes(r)).length }))]}
              value={state.region}
              onChange={(v) => setState({ ...state, region: v })}
            />
            <FilterSection
              label="Duration"
              options={[{ value: ALL, label: "All durations", count: packages.length }, ...durations.map((d) => ({ value: d, label: d, count: packages.filter((p) => p.duration === d).length }))]}
              value={state.duration}
              onChange={(v) => setState({ ...state, duration: v })}
            />
            <FilterSection
              label="Sort by"
              options={[
                { value: "title", label: "Title (A–Z)" },
                { value: "duration-short", label: "Shortest duration" },
                { value: "duration-long", label: "Longest duration" },
              ]}
              value={state.sort}
              onChange={(v) => setState({ ...state, sort: v })}
            />
          </div>
        </div>

        <div className="border-t border-white/10 px-6 py-4">
          <button
            onClick={handleClearAll}
            className="flex w-full items-center justify-center gap-2 rounded-button border border-brass px-4 py-3 text-sm font-display font-medium text-brass bg-transparent hover:bg-brass hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Reset all filters
          </button>
        </div>
      </div>

      {/* Results Count & Desktop Filter Summary */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
        <span aria-live="polite" className="font-display text-white/70">
          {sorted.length} trip{sorted.length === 1 ? "" : "s"} found
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-display font-medium">
          {state.sort !== "title" && (
            <span className="inline-flex items-center gap-1 rounded-button border border-white/10 bg-white/5 px-2.5 py-1 text-white/60">
              Sorted by:{' '}
              <span className="text-white">
                {state.sort === "duration-short"
                  ? "Shortest first"
                  : state.sort === "duration-long"
                  ? "Longest first"
                  : "Title"}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="mt-8">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <line x1="9" y1="15" x2="15" y2="9" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-xl font-light text-white">No journeys match</h3>
              <p className="mt-2 font-display text-white/50">Try adjusting your filters or search terms</p>
            </div>
            <button
              onClick={handleClearAll}
              className="btn-tertiary"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <PackageGrid packages={sorted} />
        )}
      </div>
    </>
  );
}

function parseDurationNights(duration: string): number {
  const match = duration.match(/(\d+)\s*nights?/);
  return match ? parseInt(match[1], 10) : 0;
}

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  isPrimary?: boolean;
}

function FilterChip({ label, isActive, onClick, isPrimary = false }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-shrink-0 rounded-button px-4 py-2.5 text-xs font-display font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer relative overflow-hidden ${
        isActive
          ? "bg-brass text-white shadow-[0_8px_25px_-5px_rgba(177,138,81,0.4)] scale-102"
          : "border border-white/10 bg-[#132325] text-white/75 hover:border-brass hover:text-brass hover:bg-[#1a2a2c] hover:shadow-[0_4px_15px_-3px_rgba(177,138,81,0.2)]"
      }`}
    >
      {label}
      {isActive && !isPrimary && (
        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-3/4 bg-white" aria-hidden="true" />
      )}
    </button>
  );
}

interface FilterPillProps {
  label: string;
  onRemove: () => void;
}

function FilterPill({ label, onRemove }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-button border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-display font-medium uppercase tracking-wider text-white/70 hover:border-brass hover:text-brass hover:bg-white/10 transition-all"
    >
      {label}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}

interface FilterSectionProps {
  label: string;
  options: Array<{ value: string; label: string; count?: number }>;
  value: string;
  onChange: (value: string) => void;
}

function FilterSection({ label, options, value, onChange }: FilterSectionProps) {
  return (
    <fieldset className="min-w-[200px]">
      <legend className="mb-3 text-xs font-display font-semibold uppercase tracking-wider text-white/70">
        {label}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex items-center justify-between rounded-button px-4 py-3 text-sm font-display transition-all duration-300 cursor-pointer ${
                isSelected
                  ? "bg-brass/10 border border-brass/30 text-white"
                  : "border border-white/10 bg-[#132325] text-white/75 hover:border-brass/50 hover:text-white hover:bg-[#1a2a2c]"
              }`}
            >
              <span>{opt.label}</span>
              {opt.count !== undefined && (
                <span
                  className={`ml-3 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full text-xs font-semibold ${
                    isSelected
                      ? "bg-brass text-white"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {opt.count}
                </span>
              )}
              {isSelected && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-brass ml-3 flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}