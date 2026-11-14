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
import { getAllPackages } from "@/data/catalogue";
import { getHeroJourneys } from "@/data/heroJourneys";
import { getPlaces } from "@/data/places";
import { BRAND } from "@/data/brandConfig";
import { placeLine } from "@/lib/packageDisplay";
import "./journeys.css";

const allPackages = getAllPackages();
const places = getPlaces();
const heroJourneys = getHeroJourneys();

const MOODS = [
  { label: "Trekking", href: "/journeys?category=Himalayan+Expeditions#catalogue" },
  { label: "Houseboats", href: "/journeys?q=houseboat#catalogue" },
  { label: "Heritage", href: "/journeys?category=Images+of+India#catalogue" },
  { label: "Wildlife", href: "/journeys?q=wildlife#catalogue" },
  { label: "Culture", href: "/journeys?q=culture#catalogue" },
  { label: "Rafting", href: "/journeys?q=rafting#catalogue" },
  { label: "Stopovers", href: "/journeys?category=Stopovers#catalogue" },
  { label: "Nepal", href: "/journeys?category=Nepal+Adventure#catalogue" },
];

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
      <section id="catalogue" className="section-journeys scroll-mt-20 py-16 md:py-24">
        <Container wide>
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div className="max-w-2xl">
              <p className="mb-3 flex items-center gap-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--color-wild-orange)]">
                <span className="h-px w-8 bg-[var(--color-wild-orange)]" />
                Complete Itinerary Catalogue
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-white tracking-tight">
                Journeys shaped around you
                <span className="block text-white/50 text-2xl sm:text-3xl md:text-4xl mt-1 font-serif italic">
                  from the Himalaya to the backwaters
                </span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs font-sans text-white/60">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange)]" />
                27 Verified Brochure Routes
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                Custom Private Departures
              </span>
            </div>
          </div>

          <Suspense fallback={<p className="py-20 font-display text-white/70">Loading journeys…</p>}>
            <SearchAndFilters packages={allPackages} />
          </Suspense>
        </Container>
      </section>

      {/* In season now */}
      <section className="mt-32" aria-labelledby="season-h">
        <Container wide>
          <h2 id="season-h" className="jy-section-title">
            In season now
          </h2>
          <p className="mb-10 mt-4 text-lg text-white/70">
            The journeys running across India and Nepal this season.
          </p>
        </Container>
        <div className="jy-coverflow">
          <div
            className="jy-coverflow-track"
            role="region"
            aria-label="Journeys in season now"
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
                      src={`/images/packages/${pkg.slug}.jpg`}
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
                      src={`/images/packages/${pkg.slug}.jpg`}
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
      <section className="mt-32" aria-labelledby="places-h">
        <Container wide>
          <h2 id="places-h" className="jy-section-title">
            Places we travel
          </h2>
          <p className="mb-10 mt-4 text-lg text-white/70">
            Every place, with the journeys that pass through it.
          </p>
        </Container>
        <div className="jy-coverflow">
          <div
            className="jy-coverflow-track jy-coverflow-track--reverse"
            role="region"
            aria-label="Places we travel"
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-[#0C1617] transition-all hover:bg-[var(--color-wild-orange-hover)]"
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-wild-orange)] px-4 py-2 font-sans text-xs sm:text-sm font-semibold text-[#0C1617] transition-all hover:bg-[var(--color-wild-orange-hover)]"
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
      <section className="mt-32 grid gap-32">
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

      {/* Mood */}
      <section className="mt-32" aria-labelledby="mood-h">
        <Container wide>
          <h2 id="mood-h" className="jy-section-title">
            What are you in the mood for?
          </h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <Link key={mood.label} href={mood.href} className="jy-chip">
                {mood.label}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Absolute journeys */}
      <section className="mt-32" aria-labelledby="absolute-h">
        <Container wide>
          <h2 id="absolute-h" className="jy-section-title">
            Absolute journeys
          </h2>
          <p className="mb-10 mt-4 text-lg text-white/70">
            The marquee routes, ranked by the travellers who have walked them.
          </p>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {allPackages.slice(0, 10).map((pkg, index) => (
              <li key={pkg.id}>
                <Link
                  href={`/packages/${pkg.slug}`}
                  className="group flex items-center gap-4 py-4 transition-colors hover:bg-white/[0.02]"
                >
                  <span className="w-10 shrink-0 font-serif text-2xl text-white/35">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-serif text-lg font-light text-white transition-colors group-hover:text-[var(--color-wild-orange)]">
                      {pkg.title}
                    </p>
                    <p className="mt-0.5 truncate font-sans text-[11px] uppercase tracking-[0.16em] text-white/50">
                      {placeLine(pkg)}
                    </p>
                  </div>
                  <span className="hidden shrink-0 border border-white/15 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-white/60 sm:inline-block">
                    {pkg.category}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQ */}
      <section className="mt-32 border-t border-white/10 py-20" aria-labelledby="faq-h">
        <Container className="max-w-3xl">
          <h2 id="faq-h" className="jy-section-title">
            Frequently asked questions
          </h2>
          <div className="mt-8 divide-y divide-white/10 border-y border-white/10">
            {[
              {
                q: "What is KS World Adventure?",
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
                  <span className="text-white/40 transition-transform group-open:rotate-45">+</span>
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
        image="/images/destinations/kashmir-shikara.jpg"
        imageAlt="Houseboats moored on Dal Lake in Srinagar beneath snow-covered mountains"
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
