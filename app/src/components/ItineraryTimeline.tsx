"use client";

import { useState } from "react";
import Container from "@/components/Container";

interface ItineraryDay {
  day?: number | string;
  title?: string;
  description?: string;
  stops?: string[];
  transfers?: string;
}

interface ItineraryTimelineProps {
  itinerary?: ItineraryDay[];
}

export default function ItineraryTimeline({ itinerary }: ItineraryTimelineProps) {
  const [openDay, setOpenDay] = useState<number | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const days = itinerary ?? [];

  if (days.length === 0) {
    return (
      <section className="px-4 py-16 md:px-8 lg:px-12 border-t border-wild-border-light">
        <Container>
          <h2 className="text-3xl font-serif font-bold text-charcoal mb-6 uppercase">
            Day-by-day itinerary
          </h2>
          <p className="max-w-xl font-display text-lg leading-relaxed text-charcoal-soft">
            No day-by-day programme has been transcribed for this journey yet. Enquire for the
            full itinerary.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="px-4 py-16 md:px-8 lg:px-12 border-t border-wild-border-light">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 mb-12">
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-4 uppercase">
              Day-by-day itinerary
            </h2>
            <p className="font-display text-lg leading-relaxed text-charcoal-soft">
              A day-by-day outline of the journey. Details are drawn from the brochure and
              transcribed per package — enquire for the full programme.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-display uppercase tracking-wider text-wild-sand">
            <span className="inline-flex items-center rounded-button border border-wild-border-light px-3 py-1">
              {days.length} days
            </span>
          </div>
        </div>

        {/* Desktop: vertical timeline */}
        {!isMobile && (
          <ol className="relative space-y-0">
            <span
              className="hidden lg:block absolute left-[calc(50%-1px)] top-0 bottom-0 w-px bg-wild-border-light z-0"
              aria-hidden="true"
            />
            {days.map((day, index) => (
              <li key={index} className="relative mb-16 z-10">
                {/* Day marker */}
                <div
                  className={`absolute left-[calc(50%-14px)] top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 font-display font-bold text-white transition-all duration-300 group-hover:scale-110 ${
                    openDay === index
                      ? "bg-wild-orange border-wild-orange"
                      : "bg-wild-cream border-wild-border-light text-charcoal"
                  }`}
                >
                  {dayLabel(day)}
                </div>

                <div
                  className={`relative w-full max-w-[480px] ${
                    index % 2 === 0 ? "ml-auto" : "mr-auto"
                  }`}
                >
                  <div className="relative rounded-image border border-wild-border-light bg-ivory shadow-sm transition-all duration-300 group-hover:border-wild-orange group-hover:shadow-md">
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-display font-semibold uppercase tracking-wider text-wild-sand">
                          Day {day.day ?? index + 1}
                        </span>
                        <span
                          className="inline-flex items-center rounded-button border border-wild-border-light px-2 py-0.5 text-[0.7rem] font-display font-medium uppercase text-wild-orange"
                        >
                          {day.title}
                        </span>
                      </div>
                      {day.description && (
                        <p className="mb-4 text-lg font-display leading-relaxed text-charcoal-soft">
                          {day.description}
                        </p>
                      )}
                      {day.stops && day.stops.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {day.stops.map((stop) => (
                            <span
                              key={stop}
                              className="rounded-button border border-wild-border-light px-3 py-1 text-sm font-display font-medium text-charcoal-soft bg-wild-cream/50"
                            >
                              {stop}
                            </span>
                          ))}
                        </div>
                      )}
                      {day.transfers && (
                        <p className="mb-6 text-sm font-display italic text-charcoal-soft">
                          Transfers: {day.transfers}
                        </p>
                      )}
                      {openDay === index && (
                        <div className="pt-4 border-t border-wild-border-light">
                          <p className="text-sm font-display text-white/80 leading-relaxed">
                            Detailed day notes are drawn from the brochure and transcribed per
                            package. Enquire for the full day-by-day programme.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expand trigger */}
                  <button
                    onClick={() => setOpenDay(openDay === index ? null : index)}
                    className="mt-4 inline-flex items-center gap-1.5 font-display font-semibold text-wild-orange hover:text-wild-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
                    aria-expanded={openDay === index}
                    aria-controls={`itinerary-day-${index}`}
                  >
                    {openDay === index ? "Show less" : "Read more"}
                    <span
                      className={`transition-transform duration-300 ${
                        openDay === index ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                  </button>
                </div>
              </li>
            ))}
          </ol>
        )}

        {/* Mobile: accordion sections */}
        {isMobile && (
          <div className="space-y-3">
            {days.map((day, index) => (
              <div key={index} className="overflow-hidden rounded-image border border-wild-border-light bg-ivory shadow-sm transition-all duration-300">
                <button
                  onClick={() => setOpenDay(openDay === index ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left bg-transparent hover:bg-wild-cream/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2"
                  aria-expanded={openDay === index}
                  aria-controls={`itinerary-day-${index}`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[0.7rem] font-display font-semibold uppercase tracking-wider text-wild-sand">
                        Day {day.day ?? index + 1}
                      </span>
                      <span
                        className="inline-flex items-center rounded-button border border-wild-border-light px-2 py-0.5 text-[0.65rem] font-display font-medium uppercase text-wild-orange"
                      >
                        {day.title}
                      </span>
                    </div>
                    {day.description && (
                      <p className="text-sm font-display leading-relaxed text-charcoal-soft">
                        {day.description}
                      </p>
                    )}
                    {day.stops && day.stops.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {day.stops.map((stop) => (
                          <span
                            key={stop}
                            className="rounded-button border border-wild-border-light px-2.5 py-0.5 text-[0.7rem] font-display font-medium text-charcoal-soft bg-wild-cream/40"
                          >
                            {stop}
                          </span>
                        ))}
                      </div>
                    )}
                    {day.transfers && (
                      <p className="mt-2 text-[0.75rem] font-display italic text-charcoal-soft">
                        Transfers: {day.transfers}
                      </p>
                    )}
                  </div>
                  <span
                    className={`ml-2 transition-transform duration-300 ${
                      openDay === index ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  >
                    ▾
                  </span>
                </button>
                {openDay === index && (
                  <div className="px-5 pb-5 border-t border-wild-border-light/50">
                    <p className="text-sm font-display text-charcoal-soft leading-relaxed">
                      Detailed day notes are drawn from the brochure and transcribed per package.
                      Enquire for the full day-by-day programme.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function dayLabel(day: ItineraryDay): string {
  return typeof day.day === "number" ? String(day.day) : day.day ?? String("");
}
