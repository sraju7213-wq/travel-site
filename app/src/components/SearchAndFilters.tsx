"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllRegions, getAllDurations } from "@/data/catalogue";
import PackageGrid from "./PackageGrid";
import type { PackageViewModel } from "@/types/travel";

interface FilterState {
  q: string;
  category: string;
  region: string;
  duration: string;
  activity: string;
  difficulty: string;
  sort: string;
}

const ALL = "All";

const ACTIVITY_TAGS: Record<string, string[]> = {
  Stopovers: ["city stopover", "culture"],
  "Images of India": ["culture", "houseboat/backwaters", "wildlife"],
  "India Tours": ["culture", "wildlife"],
  "Himalayan Expeditions": ["trekking"],
  "Mini Trek in Kashmir": ["trekking", "skiing"],
  "Nepal Adventure": ["trekking", "rafting", "wildlife"],
};

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
    activity: searchParams.get("activity") ?? ALL,
    difficulty: searchParams.get("difficulty") ?? ALL,
    sort: searchParams.get("sort") ?? "title",
  }));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (!mounted || isInitial.current) {
      isInitial.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.category !== ALL) params.set("category", state.category);
    if (state.region !== ALL) params.set("region", state.region);
    if (state.duration !== ALL) params.set("duration", state.duration);
    if (state.activity !== ALL) params.set("activity", state.activity);
    if (state.difficulty !== ALL) params.set("difficulty", state.difficulty);
    if (state.sort !== "title") params.set("sort", state.sort);
    router.replace(`/explore?${params.toString()}`, { scroll: false });
  }, [router, state, mounted]);

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
    if (state.activity !== ALL) {
      const tags = ACTIVITY_TAGS[pkg.category] ?? [];
      if (!tags.includes(state.activity)) return false;
    }
    if (state.difficulty !== ALL && pkg.difficultyLabel !== state.difficulty) return false;
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
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <label className="block text-sm font-display font-medium text-charcoal mb-2">Search</label>
          <div className="relative">
            <input
              type="search"
              value={state.q}
              onChange={(e) => setState({ ...state, q: e.target.value })}
              placeholder="Package name, code or destination"
              className="w-full rounded-button border border-wild-border-light px-4 py-2.5 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
              aria-label="Search packages"
            />
          </div>
        </div>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="rounded-button border border-wild-border-light px-4 py-2.5 text-sm font-display font-medium text-wild-sand bg-white transition-colors hover:bg-wild-dark hover:text-wild-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
          aria-expanded={mobileFiltersOpen}
          aria-controls="mobile-filters"
        >
          Filters
        </button>
      </div>

      {mobileFiltersOpen && (
        <div
          id="mobile-filters"
          className="fixed inset-0 z-50 bg-wild-dark flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-wild-border-light">
            <h2 className="text-lg font-serif font-bold text-wild-white">Filters</h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="p-2 text-wild-white hover:text-wild-orange focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
              aria-label="Close filters"
            >
              <span className="relative inline-flex h-6 w-3 flex-col justify-between">
                {[0, 1].map((i) => (
                  <span
                    key={i}
                    className="h-0.5 w-full bg-wild-white transition-all duration-200"
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
                  label="Category"
                  value={state.category}
                  onChange={(v) => setState({ ...state, category: v })}
                  options={[ALL, ...categories]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  label="Region"
                  value={state.region}
                  onChange={(v) => setState({ ...state, region: v })}
                  options={[ALL, ...regions]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  label="Duration"
                  value={state.duration}
                  onChange={(v) => setState({ ...state, duration: v })}
                  options={[ALL, ...durations]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
                  label="Activity"
                  value={state.activity}
                  onChange={(v) => setState({ ...state, activity: v })}
                  options={[
                    ALL,
                    "city stopover",
                    "culture",
                    "trekking",
                    "skiing",
                    "rafting",
                    "wildlife",
                    "houseboat/backwaters",
                  ]}
                />
              </div>
              <div className="min-w-[200px]">
                <Select
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
                    activity: ALL,
                    difficulty: ALL,
                    sort: "title",
                  });
                  setMobileFiltersOpen(false);
                }}
                className="flex w-full items-center gap-1.5 rounded-button border border-wild-orange px-4 py-3 text-sm font-display font-medium text-wild-orange bg-transparent hover:bg-wild-orange hover:text-wild-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
              >
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm">
        <span className="font-display text-charcoal-soft">
          {sorted.length} trip{sorted.length === 1 ? "" : "s"} found
        </span>
        <div className="flex gap-1.5 text-xs font-display font-medium text-wild-sand">
          {state.category !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, category: ALL })}>{state.category}</FilterPill>
          )}
          {state.region !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, region: ALL })}>{state.region}</FilterPill>
          )}
          {state.duration !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, duration: ALL })}>{state.duration}</FilterPill>
          )}
          {state.activity !== ALL && (
            <FilterPill onRemove={() => setState({ ...state, activity: ALL })}>{state.activity}</FilterPill>
          )}
          {state.q && <FilterPill onRemove={() => setState({ ...state, q: "" })}>{state.q}</FilterPill>}
        </div>
      </div>

      <div className="py-12">
        <PackageGrid packages={sorted} />
      </div>
    </>
  );
}

function parseDurationNights(duration: string): number {
  const match = duration.match(/(\d+)\s*nights?/);
  return match ? parseInt(match[1], 10) : 0;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[] | { label: string; value: string }[];
}

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-display font-semibold uppercase tracking-wider text-wild-sand">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-button border border-wild-border-light bg-wild-dark px-3 py-2 text-sm font-display text-wild-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
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
    <span className="inline-flex items-center gap-1.5 rounded-button border border-wild-border-light px-3 py-1 text-[10px] font-display font-medium uppercase text-wild-sand bg-transparent hover:text-wild-orange hover:border-wild-orange transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wild-orange">
      {children}
      <button
        onClick={onRemove}
        className="p-0.5 text-wild-sand hover:text-wild-orange focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-wild-orange"
        aria-label={`Remove ${String(children)} filter`}
      >
        <span aria-hidden="true">×</span>
      </button>
    </span>
  );
}
