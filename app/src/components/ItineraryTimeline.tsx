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
  const days = itinerary ?? [];

  if (days.length === 0) {
    return (
      <section className="border-t border-border bg-ivory-soft py-16 md:py-20">
        <Container>
          <h2 className="text-h3 mb-5 text-charcoal">Day-by-day itinerary</h2>
          <p className="max-w-xl font-display text-lg leading-relaxed text-charcoal-soft">
            No day-by-day programme has been transcribed for this journey yet. Enquire for the
            full itinerary.
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="border-t border-border bg-ivory-soft py-16 md:py-20">
      <Container>
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-h3 mb-4 text-charcoal">Day-by-day itinerary</h2>
            <p className="font-display leading-relaxed text-charcoal-soft">
              The programme below is transcribed from the India Nepal Travel brochure. Night stops,
              timings and optional activities are confirmed with the operator before booking.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center self-start rounded-button border border-border bg-white px-3 py-1.5 text-xs font-display uppercase tracking-wider text-charcoal-soft">
            Programme outline · {days.length} entries listed
          </span>
        </div>

        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute left-[15px] top-2 bottom-2 w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
          />
          {days.map((entry, index) => (
            <li
              key={index}
              className="relative mb-8 pl-10 last:mb-0 lg:mb-14 lg:w-1/2 lg:pl-0 lg:pr-8 lg:last:mb-0"
            >
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-1 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-brass-ink bg-white font-display text-xs font-semibold text-brass-ink lg:left-1/2"
              >
                {shortLabel(entry)}
              </span>
              <div
                className={`rounded-[1rem] border border-border/80 bg-white p-5 md:p-6 shadow-sm transition-shadow hover:shadow-md ${
                  index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                }`}
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                    Day {dayLabel(entry)}
                  </span>
                  {entry.title && (
                    <span className="rounded-button border border-brass-ink/40 bg-brass-ink/10 px-2 py-0.5 text-[0.7rem] font-display font-medium uppercase text-brass-ink">
                      {entry.title}
                    </span>
                  )}
                </div>
                {entry.description && (
                  <p className="font-display leading-relaxed text-charcoal-soft">
                    {entry.description}
                  </p>
                )}
                {entry.stops && entry.stops.length > 0 && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {entry.stops.map((stop) => (
                      <li
                        key={stop}
                        className="rounded-button border border-border bg-ivory-soft px-3 py-1 text-sm font-display text-charcoal-soft"
                      >
                        {stop}
                      </li>
                    ))}
                  </ul>
                )}
                {entry.transfers && (
                  <p className="mt-3 font-display text-sm italic text-charcoal-soft">
                    Transfers: {entry.transfers}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function dayLabel(day: ItineraryDay): string {
  if (day.day === undefined || day.day === null) return "";
  return String(day.day);
}

function shortLabel(day: ItineraryDay): string {
  const label = dayLabel(day);
  const match = label.match(/\d+/);
  return match ? match[0] : label;
}
