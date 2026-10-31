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
  const mounted = true;
  const isInitial = useRef(true);
  const [state, setState] = useState<FilterState>(() => ({
    q: decodeURIComponent(searchParams.get("q") ?? ""),
    category: searchParams.get("category") ?? ALL,
    region: searchParams.get("region") ?? ALL,
    duration: searchParams.get("duration") ?? ALL,
    sort: searchParams.get("sort") ?? "title",
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const closeFiltersRef = useRef<HTMLButtonElement>(null);
  const filtersPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeFiltersRef.current?.focus(), 0);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileFiltersOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const panel = filtersPanelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), select, input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
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
    const qs = params.toString();
    lastPushedRef.current = qs;
    router.replace(`/explore?${qs}`, { scroll: false });
  }, [router, state, mounted]);

  // Sync controls when the URL changes externally (back/forward, direct links).
  useEffect(() => {
    const qs = searchParams.toString();
    if (qs === lastPushedRef.current) return;
    setState({
      q: decodeURIComponent(searchParams.get("q") ?? ""),
      category: searchParams.get("category") ?? ALL,
      region: searchParams.get("region") ?? ALL,
      duration: searchParams.get("duration") ?? ALL,
      sort: searchParams.get("sort") ?? "title",
    });
    lastPushedRef.current = qs;
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
    if (state.q) {
      const q = state.q.toLowerCase();
      const matches =
        pkg.title.toLowerCase().includes(q) ||
        pkg.brochure_code.toLowerCase().includes(q) ||
        pkg.summary.toLowerCase().includes(q) ||
        pkg.region.some((r) => r.toLowerCase().includes(q)) ||
        pkg.highlights.some((h) => h.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (state.category !== ALL && pkg.category !== state.category) return false;
    if (state.region !== ALL && !pkg.region.includes(state.region)) return false;
    if (state.duration !== ALL && pkg.duration !== state.duration) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (state.sort === "duration-short") {
      const na = parseDurationNights(a.duration);
      const nb = parseDurationNights(b.duration);
      return na - nb || a.title.localeCompare(b.title);
    }
    if (state.sort === "duration-long") {
      const na = parseDurationNights(a.duration);
      const nb = parseDurationNights(b.duration);
      return nb - na || a.title.localeCompare(b.title);
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="flex-1">
          <label htmlFor="package-search" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft mb-2">
            Search Brochure Itineraries
          </label>
          <div className="relative">
            <input
              id="package-search"
              type="search"
              value={state.q}
              onChange={(e) => setState({ ...state, q: e.target.value })}
              placeholder="Search by package name, code (e.g. S01, II7, HE18) or destination..."
              className="w-full rounded-button border border-border bg-white px-4 py-3 text-sm font-display text-charcoal shadow-sm transition-colors focus:border-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            />
          </div>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="h-[46px] relative rounded-button border border-border px-5 text-xs font-display font-semibold uppercase tracking-wider text-charcoal bg-white transition-all hover:border-brass hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass shadow-sm cursor-pointer flex items-center justify-center gap-2"
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filters"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="stroke-current stroke-2">
              <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>More Filters</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brass px-1.5 text-xs font-semibold text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Category Chips */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            type="button"
            onClick={() => setState({ ...state, category: ALL })}
            className={`flex-shrink-0 rounded-button px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              state.category === ALL
                ? "bg-brass text-white shadow-md scale-102"
                : "border border-border bg-white text-charcoal-soft hover:border-brass hover:text-brass shadow-sm"
            }`}
          >
            All Journeys ({packages.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = packages.filter((p) => p.category === cat).length;
            const isSelected = state.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setState({ ...state, category: isSelected ? ALL : cat })}
                className={`flex-shrink-0 rounded-button px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-brass text-white shadow-md scale-102"
                    : "border border-border bg-white text-charcoal-soft hover:border-brass hover:text-brass shadow-sm"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={filtersPanelRef}
        id="mobile-filters"
        hidden={!mobileFiltersOpen}
        className="fixed inset-0 z-50 bg-forest flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
            <h2 className="text-lg font-serif font-bold text-white">
              Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </h2>
            <button
              ref={closeFiltersRef}
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-white hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
              aria-label="Close filters"
            >
              <span className="relative inline-flex h-6 w-3 flex-col justify-between">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className="h-0.5 w-full bg-white transition-all duration-200"
                    aria-hidden="true"
                  />
                ))}
              </span>
            </button>
          </div>
          <div className="flex-1 px-6 py-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="min-w-[200px]">
                <Select
                  id="filter-category"
                  label="Category"
                  value={state.category}
                  onChange={(v) => setState({ ...state, category: v })}
                  options={[ALL, ...categories]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  id="filter-region"
                  label="Region"
                  value={state.region}
                  onChange={(v) => setState({ ...state, region: v })}
                  options={[ALL, ...regions]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  id="filter-duration"
                  label="Duration"
                  value={state.duration}
                  onChange={(v) => setState({ ...state, duration: v })}
                  options={[ALL, ...durations]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  id="filter-sort"
                  label="Sort by"
                  value={state.sort}
                  onChange={(v) => setState({ ...state, sort: v })}
                  options={[
                    { label: "Title (A–Z)", value: "title" },
                    { label: "Shortest duration", value: "duration-short" },
                    { label: "Longest duration", value: "duration-long" },
                  ]}
                />
              </div>
              <button
                onClick={() => {
                  setState({
                    q: "",
                    category: ALL,
                    region: ALL,
                    duration: ALL,
                    sort: "title",
                  });
                  setMobileFiltersOpen(false);
                }}
                className="flex w-full items-center gap-1.5 rounded-button border border-brass-ink px-4 py-3 text-sm font-display font-medium text-brass-ink bg-transparent hover:bg-brass-ink hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>

      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <span aria-live="polite" className="font-display text-charcoal-soft">
          {sorted.length} trip{sorted.length === 1 ? "" : "s"} found
        </span>
        <div className="flex flex-wrap gap-1.5 text-xs font-display font-medium text-charcoal-soft">
          {state.category !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, category: ALL })}>{state.category}</FilterPill>
          )}
          {state.region !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, region: ALL })}>{state.region}</FilterPill>
          )}
          {state.duration !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, duration: ALL })}>{state.duration}</FilterPill>
          )}
          {state.q && <FilterPill onRemove={() => setState({ ...state, q: "" })}>{state.q}</FilterPill>}
        </div>
      </div>

      <div className="py-12">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <p className="font-display text-lg text-charcoal-soft">No journeys match these filters.</p>
            <button
              onClick={() => {
                setState({ q: "", category: ALL, region: ALL, duration: ALL, sort: "title" });
              }}
              className="btn-tertiary"
            >
              Reset filters
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

interface SelectProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[] | { label: string; value: string }[];
}

function Select({ id, label, value, onChange, options }: SelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-button border border-white/10 bg-forest px-3 py-2 text-sm font-display text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        {options.map((opt) => {
          const label =
            typeof opt === "string" ? opt : opt.label;
          const val =
            typeof opt === "string" ? opt : opt.value;
          return (
            <option key={val} value={val}>
              {label}
            </option>
          );
        })}
      </select>
    </div>
  );
}

interface FilterPillProps {
  children: React.ReactNode;
  onRemove: () => void;
}

function FilterPill({ children, onRemove }: FilterPillProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-button border border-white/10 px-3 py-1 text-[11px] font-display font-medium uppercase text-charcoal-soft bg-transparent transition-colors hover:border-brass-ink hover:text-brass-ink focus-within:ring-1 focus-within:ring-brass">
      <span className="truncate">{children}</span>
      <button
        onClick={onRemove}
        className="-mr-1 inline-flex h-6 w-6 shrink-0 items-center justify-center text-charcoal-soft hover:text-brass-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        aria-label={`Remove ${String(children)} filter`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
