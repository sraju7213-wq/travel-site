"use client";

import { useRef, useState } from "react";
import InclusionsExclusions from "@/components/InclusionsExclusions";
import InteractiveItinerary from "@/components/InteractiveItinerary";
import PackageGallery from "@/components/PackageGallery";
import RouteMap from "@/components/RouteMap";
import { canShowItinerary, publicDayCount, type GalleryImage } from "@/data/catalogue";
import type { PackageViewModel } from "@/types/travel";

type TabId = "overview" | "itinerary" | "map" | "inclusions";

interface PackageWorkspaceProps {
  pkg: PackageViewModel;
  gallery: GalleryImage[];
}

export default function PackageWorkspace({ pkg, gallery }: PackageWorkspaceProps) {
  const dayCount = publicDayCount(pkg) ?? 0;
  const itineraryAllowed = canShowItinerary(pkg);
  const destinations = pkg.region.filter((r) => r !== "India" && r !== "Nepal");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: Array<{ id: TabId; label: string; short: string }> = [
    { id: "overview", label: "Overview & Highlights", short: "Overview" },
    ...(itineraryAllowed && pkg.itineraryVisible !== false
      ? [
          {
            id: "itinerary" as const,
            label: dayCount > 0 ? `Day-by-Day (${dayCount} Days)` : "Day-by-Day",
            short: "Itinerary",
          },
          { id: "map" as const, label: "Interactive Map", short: "Map" },
        ]
      : []),
    { id: "inclusions", label: "Inclusions & Info", short: "Details" },
  ];

  const focusTab = (index: number) => {
    const next = (index + tabs.length) % tabs.length;
    setActiveTab(tabs[next].id);
    triggerRefs.current[next]?.focus();
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Tab bar */}
      <div className="rounded-xl border border-white/10 bg-[#132325] p-1.5 shadow-sm">
        <div
          role="tablist"
          aria-label={`${pkg.title} details`}
          className="flex items-center gap-1 overflow-x-auto scrollbar-hide"
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  triggerRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`flex-1 whitespace-nowrap rounded-lg min-h-[44px] px-2 py-3 font-display text-[11px] font-semibold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass sm:px-3 sm:py-2.5 sm:text-xs ${
                  isActive
                    ? "bg-brass text-[#0C1617] shadow-sm"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel */}
      <div className="relative min-h-[520px] rounded-xl border border-white/10 bg-[#132325] p-5 shadow-xl md:p-6">
        {/* Overview */}
        <div
          role="tabpanel"
          id="panel-overview"
          aria-labelledby="tab-overview"
          hidden={activeTab !== "overview"}
          className="animate-fade-in"
        >
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
            <div>
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
                Journey Perspective
              </p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                {destinations.length > 0 ? destinations.join(" · ") : pkg.title}
              </h2>
            </div>
            {gallery.length > 0 && (
              <button
                type="button"
                onClick={() => setGalleryOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 pt-2 font-display text-xs text-brass-soft transition hover:text-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <span>View Full Gallery ({gallery.length} Photos)</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          <p className="mt-4 max-w-3xl font-display text-sm leading-relaxed text-white/65">{pkg.shortDescription ?? pkg.summary}</p>
          {pkg.fullDescription && <p className="mt-4 max-w-3xl whitespace-pre-line font-sans text-sm leading-relaxed text-white/70">{pkg.fullDescription}</p>}

          <div className="mt-5">
            <PackageGallery
              images={gallery}
              title={pkg.title}
              open={galleryOpen}
              onOpenChange={setGalleryOpen}
            />
          </div>

          {pkg.highlights.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-2 font-display text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <span className="h-2 w-2 rounded-full bg-brass" aria-hidden="true" />
                Key Journey Highlights
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pkg.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3"
                  >
                    <span aria-hidden="true" className="mt-0.5 text-base text-brass">
                      ✦
                    </span>
                    <p className="font-display text-sm leading-relaxed text-white/70">{highlight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itinerary */}
        <div
          role="tabpanel"
          id="panel-itinerary"
          aria-labelledby="tab-itinerary"
          hidden={activeTab !== "itinerary"}
          className="animate-fade-in"
        >
          <InteractiveItinerary itinerary={itineraryAllowed && pkg.itineraryVisible !== false ? pkg.itinerary : []} />
        </div>

        {/* Map */}
        <div
          role="tabpanel"
          id="panel-map"
          aria-labelledby="tab-map"
          hidden={activeTab !== "map"}
          className="animate-fade-in"
        >
          {itineraryAllowed && <RouteMap pkg={pkg} />}
        </div>

        {/* Inclusions */}
        <div
          role="tabpanel"
          id="panel-inclusions"
          aria-labelledby="tab-inclusions"
          hidden={activeTab !== "inclusions"}
          className="animate-fade-in"
        >
          {(pkg.inclusionsVisible !== false || pkg.exclusionsVisible !== false) && <InclusionsExclusions
            inclusions={pkg.inclusions}
            exclusions={pkg.exclusions}
            showInclusions={pkg.inclusionsVisible !== false}
            showExclusions={pkg.exclusionsVisible !== false}
          />}
          {(pkg.startingPoint || pkg.endingPoint || pkg.transportation || pkg.accommodationDetails || pkg.importantInformation || pkg.cancellationPolicy) && <dl className="mt-5 grid gap-3 text-sm md:grid-cols-2">{pkg.startingPoint && <div><dt className="text-white/50">Starting point</dt><dd>{pkg.startingPoint}</dd></div>}{pkg.endingPoint && <div><dt className="text-white/50">Ending point</dt><dd>{pkg.endingPoint}</dd></div>}{pkg.transportation && <div><dt className="text-white/50">Transportation</dt><dd>{pkg.transportation}</dd></div>}{pkg.accommodationDetails && <div><dt className="text-white/50">Accommodation</dt><dd>{pkg.accommodationDetails}</dd></div>}{pkg.importantInformation && <div className="md:col-span-2"><dt className="text-white/50">Important information</dt><dd className="whitespace-pre-line">{pkg.importantInformation}</dd></div>}{pkg.cancellationPolicy && <div className="md:col-span-2"><dt className="text-white/50">Cancellation policy</dt><dd className="whitespace-pre-line">{pkg.cancellationPolicy}</dd></div>}</dl>}
          {(pkg.faqs?.some((faq) => faq.visible !== false) ?? false) && <section className="mt-6"><h3 className="font-serif text-xl">Package FAQs</h3><div className="mt-3 space-y-2">{pkg.faqs?.filter((faq) => faq.visible !== false).map((faq) => <details key={faq.question} className="rounded border border-white/10 p-3"><summary>{faq.question}</summary><p className="mt-2 text-sm text-white/65">{faq.answer}</p></details>)}</div></section>}
        </div>
      </div>
    </div>
  );
}
