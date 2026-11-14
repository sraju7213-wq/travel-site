import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import CtaZoom from "@/components/CtaZoom";
import PlaceOrbitHero from "@/components/journeys/PlaceOrbitHero";
import TrendingJourneys from "@/components/journeys/TrendingJourneys";
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
  { label: "Trekking", href: "/explore?category=Himalayan+Expeditions" },
  { label: "Houseboats", href: "/explore?q=houseboat" },
  { label: "Heritage", href: "/explore?category=Images+of+India" },
  { label: "Wildlife", href: "/explore?q=wildlife" },
  { label: "Culture", href: "/explore?q=culture" },
  { label: "Rafting", href: "/explore?q=rafting" },
  { label: "Stopovers", href: "/explore?category=Stopovers" },
  { label: "Nepal", href: "/explore?category=Nepal+Adventure" },
];

export const metadata: Metadata = {
  title: `Journeys — ${BRAND.name}`,
  description:
    "Every journey, every place, every answer. Browse tailor-made journeys across India and Nepal.",
};

export default function JourneysPage() {
  const trending = allPackages.slice(0, 12);
  const inSeason = allPackages.slice(0, 10);
  const byCategory = (category: string) =>
    allPackages.filter((pkg) => pkg.category === category).slice(0, 5);

  return (
    <PageShell mainClassName="">
      {/* Enables the reelipse-style poster tilt across every card on this page */}
      <TiltPoster className="contents" />

      {/* Hero — 3D orbit of marquee journeys; every card opens its itinerary */}
      <PlaceOrbitHero places={places} journeys={heroJourneys} />

      {/* Trending this week */}
      <section className="mt-24" aria-labelledby="trending-h">
        <Container wide>
          <h2 id="trending-h" className="jy-section-title">
            Trending this week
          </h2>
          <p className="mb-10 mt-4 text-lg text-white/70">
            What travellers are booking right now, from Himalayan treks to houseboat
            weekends.
          </p>
        </Container>
        <TrendingJourneys packages={trending} />
        <div className="mt-10 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)]"
          >
            See all {allPackages.length} journeys
          </Link>
        </div>
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
            {inSeason.map((pkg, index) => (
              <div key={pkg.id} className="jy-coverflow-slide">
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
                      sizes="(min-width: 768px) 320px, 64vw"
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
          <div className="jy-rail">
            {places.map((place) => (
              <article key={place.name} className="jy-rail-card group">
                <Link href={place.href} aria-label={`${place.name} — ${place.journeys} journeys`}>
                  <div className="jy-rail-poster" data-tilt>
                    <Image
                      src={place.image}
                      alt={place.alt}
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw"
                      className="object-cover"
                    />
                    <span className="jy-rail-glare" aria-hidden="true" />
                  </div>
                  <h3 className="jy-rail-title">{place.name}</h3>
                  <div className="jy-rail-meta">
                    <span className="font-mono text-xs text-white/55">
                      {place.journeys} {place.journeys === 1 ? "journey" : "journeys"}
                    </span>
                    <span className="jy-pill jy-pill--essential">Explore</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </Container>
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
