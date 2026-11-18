import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import CtaZoom from "@/components/CtaZoom";
import SearchAndFilters from "@/components/SearchAndFilters";
import PlaceOrbitHero from "@/components/journeys/PlaceOrbitHero";
import PosterRail from "@/components/journeys/PosterRail";
import TiltPoster from "@/components/journeys/TiltPoster";
import { getAllPackages, getPackageCardImage } from "@/data/catalogue";
import { getHeroJourneys } from "@/data/heroJourneys";
import { getPlaces } from "@/data/places";
import { BRAND } from "@/data/brandConfig";
import { placeLine } from "@/lib/packageDisplay";
import "./journeys.css";

const allPackages = getAllPackages();
const places = getPlaces();
const heroJourneys = getHeroJourneys();

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
      <section className="mt-20 md:mt-28" aria-labelledby="season-h">
        <Container wide>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 id="season-h" className="jy-section-title">
              In season now
            </h2>
            <p className="max-w-md text-sm text-white/60 md:text-right">
              The journeys running across India and Nepal this season.
            </p>
          </div>
        </Container>
        <div className="jy-coverflow">
          <div
            className="jy-coverflow-track"
            role="region"
            aria-label="Journeys in season now — scroll to browse"
            tabIndex={0}
          >
            {/* Primary slide set */}
            {inSeason.map((pkg, index) => (
              <div key={`${pkg.id}-primary`} className="jy-coverflow-slide">
                <article className="jy-coverflow-card" data-tilt>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="jy-coverflow-poster"
                    aria-label={`${pkg.title} — in season now`}
                  >
                    <Image
                      src={getPackageCardImage(pkg.slug)}
                      alt={pkg.title}
                      fill
                      sizes="(min-width: 768px) 450px, 80vw"
                      quality={90}
                      className="object-cover"
                    />
                  </Link>
                  <span className="jy-coverflow-veil" aria-hidden="true" />
                  <span className="jy-coverflow-sheen" aria-hidden="true" />
                  <div className="jy-coverflow-info">
                    <span className="jy-coverflow-rank" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-2.5">
                      <h3 className="jy-coverflow-title">{pkg.title}</h3>
                      <div className="jy-coverflow-meta">
                        <span className="font-mono text-[0.8125rem] text-white/70">
                          {placeLine(pkg)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}

            {/* Duplicated slide set for seamless 50% infinite translation loop */}
            {inSeason.map((pkg, index) => (
              <div
                key={`${pkg.id}-duplicate`}
                className="jy-coverflow-slide"
                aria-hidden="true"
              >
                <article className="jy-coverflow-card" data-tilt>
                  <Link
                    href={`/packages/${pkg.slug}`}
                    className="jy-coverflow-poster"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={getPackageCardImage(pkg.slug)}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 450px, 80vw"
                      quality={90}
                      className="object-cover"
                    />
                  </Link>
                  <span className="jy-coverflow-veil" aria-hidden="true" />
                  <span className="jy-coverflow-sheen" aria-hidden="true" />
                  <div className="jy-coverflow-info">
                    <span className="jy-coverflow-rank" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-2.5">
                      <h3 className="jy-coverflow-title">{pkg.title}</h3>
                      <div className="jy-coverflow-meta">
                        <span className="font-mono text-[0.8125rem] text-white/70">
                          {placeLine(pkg)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Places */}
      <section className="mt-20 md:mt-28" aria-labelledby="places-h">
        <Container wide>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
            <h2 id="places-h" className="jy-section-title">
              Places we travel
            </h2>
            <p className="max-w-md text-sm text-white/60 md:text-right">
              Every place, with the journeys that pass through it.
            </p>
          </div>
        </Container>
        <div className="jy-coverflow">
          <div
            className="jy-coverflow-track jy-coverflow-track--reverse"
            role="region"
            aria-label="Places we travel — scroll to browse"
            tabIndex={0}
          >
            {/* Primary slide set */}
            {places.map((place, index) => (
              <div key={`${place.name}-primary`} className="jy-coverflow-slide">
                <article className="jy-coverflow-card" data-tilt>
                  <Link
                    href={place.href}
                    className="jy-coverflow-poster"
                    aria-label={`${place.name} — ${place.journeys} journeys`}
                  >
                    <Image
                      src={place.image}
                      alt={place.alt}
                      fill
                      sizes="(min-width: 768px) 450px, 80vw"
                      quality={90}
                      className="object-cover"
                    />
                  </Link>
                  <span className="jy-coverflow-veil" aria-hidden="true" />
                  <span className="jy-coverflow-sheen" aria-hidden="true" />
                  <div className="jy-coverflow-info">
                    <span className="jy-coverflow-rank" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-2.5">
                      <h3 className="jy-coverflow-title">{place.name}</h3>
                      <div className="jy-coverflow-meta">
                        <span className="font-mono text-[0.8125rem] text-white/70">
                          {place.journeys} {place.journeys === 1 ? "journey" : "journeys"}
                        </span>
                        <span className="jy-pill jy-pill--essential">Explore</span>
                      </div>
                      <p className="jy-coverflow-summary text-xs sm:text-[0.875rem] text-white/80 line-clamp-2">
                        {place.blurb}
                      </p>
                      <div className="jy-coverflow-actions mt-1">
                        <Link
                          href={place.href}
                          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-[#0C1617] transition-all hover:bg-[var(--color-wild-orange-hover)]"
                        >
                          View {place.name} journeys
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}

            {/* Duplicated slide set for seamless 50% infinite reverse translation loop */}
            {places.map((place, index) => (
              <div
                key={`${place.name}-duplicate`}
                className="jy-coverflow-slide"
                aria-hidden="true"
              >
                <article className="jy-coverflow-card" data-tilt>
                  <Link
                    href={place.href}
                    className="jy-coverflow-poster"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <Image
                      src={place.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 450px, 80vw"
                      quality={90}
                      className="object-cover"
                    />
                  </Link>
                  <span className="jy-coverflow-veil" aria-hidden="true" />
                  <span className="jy-coverflow-sheen" aria-hidden="true" />
                  <div className="jy-coverflow-info">
                    <span className="jy-coverflow-rank" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid gap-2.5">
                      <h3 className="jy-coverflow-title">{place.name}</h3>
                      <div className="jy-coverflow-meta">
                        <span className="font-mono text-[0.8125rem] text-white/70">
                          {place.journeys} {place.journeys === 1 ? "journey" : "journeys"}
                        </span>
                        <span className="jy-pill jy-pill--essential">Explore</span>
                      </div>
                      <p className="jy-coverflow-summary text-xs sm:text-[0.875rem] text-white/80 line-clamp-2">
                        {place.blurb}
                      </p>
                      <div className="jy-coverflow-actions mt-1">
                        <Link
                          href={place.href}
                          tabIndex={-1}
                          className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-[#0C1617] transition-all hover:bg-[var(--color-wild-orange-hover)]"
                        >
                          View {place.name} journeys
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rails by category */}
      <section className="mt-20 grid grid-cols-[minmax(0,1fr)] gap-14 md:mt-28 md:gap-20">
        <PosterRail
          eyebrow="Himalayan expeditions"
          heading="Himalayan expeditions"
          intro="High passes, glacier camps and remote Himalayan villages."
          packages={byCategory("Himalayan Expeditions")}
        />
        <PosterRail
          eyebrow="Nepal adventure"
          heading="Nepal adventure"
          intro="Trekking, rafting and jungle safaris across Nepal."
          packages={byCategory("Nepal Adventure")}
        />
        <PosterRail
          eyebrow="Stopovers"
          heading="Stopovers"
          intro="Short city breaks and houseboat stays on the way through."
          packages={byCategory("Stopovers")}
        />
      </section>

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
    </PageShell>
  );
}
