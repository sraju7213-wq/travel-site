import { Suspense } from "react";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import CtaZoom from "@/components/CtaZoom";
import SearchAndFilters from "@/components/SearchAndFilters";
import JourneyLandingPage from "@/components/journeys/JourneyLandingPage";
import ModernExperience from "@/components/journeys/ModernExperience";
import PlaceOrbitHero from "@/components/journeys/PlaceOrbitHero";
import PosterRail from "@/components/journeys/PosterRail";
import SeasonRail from "@/components/journeys/SeasonRail";
import TiltPoster from "@/components/journeys/TiltPoster";
import { getAllPackages } from "@/data/catalogue";
import { getHeroJourneys } from "@/data/heroJourneys";
import { getJourneysByPlace, getPlaces } from "@/data/places";
import { BRAND } from "@/data/brandConfig";
import "./journeys.css";

const allPackages = getAllPackages();
const places = getPlaces();
const heroJourneys = getHeroJourneys();
const journeysByPlace = getJourneysByPlace();

export const metadata: Metadata = {
  title: `Journeys — ${BRAND.name}`,
  description:
    "Every journey, every place, every answer. Browse tailor-made journeys across India and Nepal.",
};

export default function JourneysPage() {
  const inSeason = allPackages.slice(0, 10);
  const byCategory = (category: string) =>
    allPackages.filter((pkg) => pkg.category === category).slice(0, 5);

  return (
    <PageShell mainClassName="">
      <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
        <JourneyLandingPage
        modern={<ModernExperience places={places} journeysByPlace={journeysByPlace} />}
        orbit={
          <>
      {/* Enables the reelipse-style poster tilt across every card on this page */}
      <TiltPoster className="contents" />

      {/* Hero — 3D orbit of marquee journeys; every card opens its itinerary */}
      <PlaceOrbitHero places={places} journeys={heroJourneys} />

      {/* Search & Filters Catalogue */}
      <section id="catalogue" className="section-journeys scroll-mt-20 py-12 md:py-16" aria-labelledby="catalogue-h">
        <Container wide>
          <h2 id="catalogue-h" className="sr-only">
            Journey catalogue
          </h2>
          <Suspense fallback={<p className="py-20 font-display text-white/70">Loading journeys…</p>}>
            <SearchAndFilters packages={allPackages} />
          </Suspense>
        </Container>
      </section>

      {/* In season now */}
      <SeasonRail packages={inSeason} />

      {/* Collections by category */}
      <div className="jy-collections mt-20 grid grid-cols-[minmax(0,1fr)] gap-16 md:mt-24 md:gap-24">
        <PosterRail
          id="rail-nepal-adventure"
          kicker="Wild trails"
          heading="Nepal adventure"
          intro="Trekking, rafting and jungle safaris across Nepal."
          actionHref="/journeys?category=Nepal%20Adventure#catalogue"
          packages={byCategory("Nepal Adventure")}
        />
        <PosterRail
          id="rail-stopovers"
          kicker={"City & stay"}
          heading="Stopovers"
          intro="Short city breaks and houseboat stays on the way through."
          actionHref="/journeys?category=Stopovers#catalogue"
          packages={byCategory("Stopovers")}
        />
      </div>

      {/* FAQ */}
      <section className="mt-20 border-t border-white/10 py-12 md:mt-28 md:py-16" aria-labelledby="faq-h">
        <Container className="max-w-3xl">
          <h2 id="faq-h" className="jy-section-title">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                q: "What is India Nepal Travel Center?",
                a: "A specialist operator for India and Nepal since 1927, offering tailor-made journeys, small-group tours, Himalayan trekking, cultural itineraries and Kashmir houseboats.",
              },
              {
                q: "How are the journeys listed?",
                a: "Every itinerary comes from the printed brochure catalogue, so the duration, route, grade and inclusions are the operator's own.",
              },
              {
                q: "Does it cover Indian journeys?",
                a: "Yes. Kashmir, Ladakh, Rajasthan, Kerala, Goa, Agra and Varanasi sit alongside Nepal adventures, with the same detail and inclusions.",
              },
              {
                q: "Is it free to enquire?",
                a: "Yes. No account is needed. Tell us your dates and interests and we shape the journey around you.",
              },
            ].map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg font-light text-white">
                  {item.q}
                  <span className="text-white/60 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/65">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <CtaZoom
        image="/images/misty-mountain-valley.jpg"
        imageAlt="Snow-capped Himalayan peaks above clouds with forested foothills"
        eyebrow="Plan your journey"
        title={
          <>
            India &amp; Nepal,<br className="hidden sm:block" /> your way.
          </>
        }
        body="Every journey can be tailored around your dates, party size and interests. Tell us what you want to discover."
        ctaLabel="Enquire now"
        ctaHref="/enquiry"
      />
          </>
        }
      />
      </Suspense>
    </PageShell>
  );
}
