import CtaZoom from "@/components/CtaZoom";
import Container from "@/components/Container";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/ui/PageHero";
import PhotoFrame from "@/components/ui/PhotoFrame";
import Reveal from "@/components/ui/Reveal";
import { BRAND } from "@/data/brandConfig";

export const metadata = {
  title: `About Us — ${BRAND.name} & ${BRAND.operatorName}`,
  description:
    "Specialist tour operator heritage for India and Nepal descending from the Baktoo family operations founded in 1927.",
};

const STATS = [
  {
    value: "1927",
    label: "Founding heritage",
    detail: "Operating tours and treks to Northern India since 1927.",
  },
  {
    value: "India & Nepal",
    label: "Destinations",
    detail: "Specialist travel across two countries, the subcontinent and the Himalaya.",
  },
  {
    value: "Up to 15",
    label: "Guests per group",
    detail:
      "Departures operate without minimum passenger quotas, for small private groups of up to 15 or solo itineraries (subject to weather & pass safety).",
  },
];

const PILLARS = [
  {
    number: "01",
    title: "Guides and support crews",
    description:
      "Special-interest tours are escorted by designated expedition leaders, regional mountaineering specialists, and local trackers, arranged through our concierge desk or your travel agent.",
    badge: "Escorted tours",
  },
  {
    number: "02",
    title: "Accommodation",
    description:
      "All our accommodation has been carefully selected. We use hotels that are well serviced and centrally located, chosen for ambience, comfort, architecture and history, from deluxe categories to family-run establishments.",
    badge: "Selected lodgings",
  },
  {
    number: "03",
    title: "Programmes",
    description:
      "We arrange special-interest tours for clubs, schools, social or special-interest groups (Ayurveda, gardening, golf, business, textiles, fashion, yoga) and run escorted student tours for schools in both India and Nepal.",
    badge: "Special interest",
  },
  {
    number: "04",
    title: "Tailor-made itineraries",
    description:
      "Every itinerary in our catalogue can be tailored to your schedule, party size and interests. Itineraries in the brochure are an outline; detailed information is available on request.",
    badge: "Tailor-made",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Explore the catalogue",
    description:
      "Browse our itineraries across Himalayan treks, Kashmir houseboats, Rajasthan forts, and Nepal's sacred valleys.",
  },
  {
    step: "02",
    title: "Send your enquiry",
    description:
      "Tell us your preferred dates, party size, travel pace, and interests through our straightforward, direct enquiry form.",
  },
  {
    step: "03",
    title: "Receive a tailored quote",
    description:
      "We shape an itinerary around your dates, party size and interests, drawing on our brochure catalogue.",
  },
  {
    step: "04",
    title: "Guaranteed departures*",
    description:
      "Departures operate without minimum group quotas for solo travellers or small private groups up to 15, subject to mountain weather safety and pass access.",
  },
];

export default function AboutPage() {
  return (
    <PageShell mainClassName="">
      {/* Hero */}
      <PageHero
        align="left"
        height="full"
        image="/images/destinations/about-hero.jpg"
        mobileImage="/images/destinations/about-hero-mobile.jpg"
        imageStyle={{ transform: "scale(1.02)" }}
        imageAlt="Desert expedition caravan with camels and travelers crossing sand dunes at sunset"
        eyebrow="Est. 1927 · Specialist travel"
        contentClassName="text-center md:mr-auto md:ml-8 md:w-[40%] md:text-left md:drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]"
        hideOnMobile
        title="A century of travel"
        lead="Baktoo family heritage since 1927 — specialist travel across India and Nepal, with historical operating links in Delhi, Kashmir and Ladakh."
        primaryCta={{ label: "Plan your journey", href: "/enquiry" }}
        secondaryCta={{ label: "View all journeys", href: "/journeys" }}
        scrollCue
        footer={
          <figure className="pointer-events-none absolute inset-x-5 bottom-48 z-10 mx-auto max-w-[1240px] animate-fade-in sm:inset-x-10 md:bottom-28 md:px-10">
            <div className="max-w-lg border-l-2 border-[#E9B873]/70 pl-5">
              <blockquote className="font-serif text-lg font-light italic leading-[1.35] text-[#FFF7EC] [text-shadow:0_1px_3px_rgba(0,0,0,0.9)] sm:text-xl md:text-2xl">
                &ldquo;By Allah&rsquo;s grace, built on my parents&rsquo; prayers.&rdquo;
              </blockquote>
            </div>
          </figure>
        }
      />

      {/* Key numbers */}
      <section className="section-discover border-b border-white/5 py-16 md:py-20" aria-label="Key facts about our organisation">
        <Container wide>
          <Reveal as="dl" stagger={0.12} className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="group relative border-t border-white/10 pt-5 transition-colors duration-500 hover:border-[var(--color-wild-orange)]/50"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-0 bg-[var(--color-wild-orange)] transition-all duration-700 ease-out group-hover:w-full"
                />
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                  {stat.label}
                </dt>
                <dd>
                  <span className="mt-3 block font-serif text-3xl font-light leading-[1.05] text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)] md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-3 block font-sans text-xs font-light leading-relaxed text-white/55">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* The family */}
      <section className="section-darker border-b border-white/5 py-20 md:py-28" id="founders">
        <Container wide>
          <Reveal variant="fade-up" className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Founders &amp; visionaries
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              The Baktoo family heritage
            </h2>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              The Baktoo family has shared the landscapes and cultures of India and Nepal with travellers
              since 1927. Journeys presented by {BRAND.name} are operated in historical association with{" "}
              {BRAND.operatorName}, based in India.
            </p>
          </Reveal>

          <Reveal stagger={0.18} className="mt-14 grid gap-12 lg:grid-cols-2 lg:gap-14">
            {/* Sultan Baktoo */}
            <article className="group flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:gap-7">
              <div className="relative w-full shrink-0 sm:w-44">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 border border-[var(--color-wild-orange)]/25 transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:translate-y-2"
                />
                <PhotoFrame
                  src="/images/destinations/sultan-baktoo.jpg"
                  alt="Sultan Baktoo, pioneer of tourism and travel in Kashmir"
                  ratio="4/5"
                  sizes="(min-width: 640px) 176px, 100vw"
                  imageClassName="object-[94%_center] sm:object-[85%_center]"
                />
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  Founder &amp; pioneer
                </span>
                <h3 className="mt-2 font-serif text-2xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)] md:text-[1.75rem]">
                  Sultan Baktoo
                </h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                  Haji Mohammed Sultan Baktoo pioneered tourism and trekking in Northern India beginning in
                  1927. Historically recorded as the chief operator with hotel partnerships, a transport fleet
                  in Delhi, and the M.S. Baktoo luxury houseboat group in Kashmir. KHE established operational
                  links across India and Nepal.
                </p>
              </div>
            </article>

            {/* Farook Baktoo */}
            <article className="group flex flex-col gap-6 border-t border-white/10 pt-7 sm:flex-row sm:gap-7">
              <div className="relative w-full shrink-0 sm:w-44">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 translate-x-3 translate-y-3 border border-[var(--color-wild-orange)]/25 transition-transform duration-700 ease-out group-hover:translate-x-2 group-hover:translate-y-2"
                />
                <PhotoFrame
                  src="/images/destinations/farook-baktoo.jpg"
                  alt="Farook Baktoo, Himalayan expedition leader and director"
                  ratio="4/5"
                  sizes="(min-width: 640px) 176px, 100vw"
                  imageClassName="object-top"
                />
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  Tourism &amp; trekking
                </span>
                <h3 className="mt-2 font-serif text-2xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)] md:text-[1.75rem]">
                  Farook Baktoo
                </h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                  Farook has been planning and promoting tourism to the sub-continent for the past 20 years.
                  Having grown up in the lush Kashmir Valley and born into one of the pioneering families of
                  Himalayan trekking, Farook has led many tours and treks in the Himalayan, Karakoram, Zanskar
                  and Ladakh ranges.
                </p>
              </div>
            </article>
          </Reveal>

          {/* Operations & Leadership Team from family archives */}
          <div className="mt-16 border-t border-white/10 pt-12">
            <Reveal variant="fade-up">
              <p className="mb-8 flex items-center gap-4 font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
                Operations &amp; Subcontinent Leadership
              </p>
            </Reveal>
            <Reveal stagger={0.14} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group border border-white/10 bg-[#0C1617] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-wild-orange)]/50 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)] md:p-6">
                <PhotoFrame
                  src="/images/destinations/yousuf-baktoo.jpg"
                  alt="Yousuf Baktoo"
                  ratio="4/5"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  parallax={false}
                  imageClassName="object-[70%_center]"
                />
                <div className="mt-5">
                  <h4 className="font-serif text-2xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)]">Yousuf Baktoo</h4>
                  <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/65">Mentioned in the brochure&apos;s founders passage as supervising specialist tours.</p>
                </div>
              </div>

              <div className="group border border-white/10 bg-[#0C1617] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-wild-orange)]/50 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)] md:p-6">
                <PhotoFrame
                  src="/images/destinations/imtiaz-baktoo.jpg"
                  alt="Imtiaz Ahmad"
                  ratio="4/5"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  parallax={false}
                  imageClassName="object-left"
                />
                <div className="mt-5">
                  <h4 className="font-serif text-2xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)]">Imtiaz Ahmad</h4>
                  <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/65">Listed in the brochure&apos;s team profiles.</p>
                </div>
              </div>

              <div className="group border border-white/10 bg-[#0C1617] p-5 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-wild-orange)]/50 hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)] md:p-6">
                <PhotoFrame
                  src="/images/destinations/hashim-baktoo.jpg"
                  alt="Hashim"
                  ratio="4/5"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  parallax={false}
                  imageClassName="object-[47%_bottom]"
                />
                <div className="mt-5">
                  <h4 className="font-serif text-2xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)]">Hashim</h4>
                  <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/65">Listed in the brochure&apos;s team profiles.</p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Archival note */}
          <Reveal variant="fade-up">
            <figure className="mt-16 border-t border-white/10 pt-12 text-center md:mt-20 md:pt-14">
              <span aria-hidden="true" className="block font-serif text-7xl leading-[0.5] text-[var(--color-wild-orange)]/60">
                &ldquo;
              </span>
              <blockquote className="mx-auto mt-8 max-w-3xl font-serif text-xl font-light italic leading-[1.5] text-white/85 md:text-2xl">
                Our tours are planned without minimum-group cancellations, and can be enjoyed by a small group
                of up to 15 or as a solo traveller. The itineraries in this brochure outline what you can
                expect; detailed information is available on request.
              </blockquote>
              <figcaption className="mt-8 flex items-center justify-center gap-4 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                <span aria-hidden="true" className="h-px w-8 bg-[var(--color-wild-orange)]/60" />
                &mdash; Baktoo family archives
                <span aria-hidden="true" className="h-px w-8 bg-[var(--color-wild-orange)]/60" />
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* Standards */}
      <section className="section-pillars border-b border-white/5 py-20 md:py-28" aria-label="Our travel standards and principles">
        <Container wide>
          <Reveal variant="fade-up" className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
                <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
                Our standards
              </p>
              <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
                How we travel
              </h2>
            </div>
            <p className="max-w-xs font-sans text-sm font-light leading-relaxed text-white/55">
              Four principles we have worked to since 1927.
            </p>
          </Reveal>

          <Reveal stagger={0.12} className="mt-12 grid gap-6 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <article
                key={pillar.number}
                className="group relative overflow-hidden border border-white/10 bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-wild-orange)]/45 hover:bg-white/[0.04] hover:shadow-[0_24px_50px_-30px_rgba(0,0,0,0.8)] md:p-9"
              >
                <span
                  aria-hidden="true"
                  className="watermark-outline pointer-events-none absolute -right-2 -top-6 select-none font-serif text-[7rem] font-light leading-none opacity-25 transition-opacity duration-500 group-hover:opacity-45"
                >
                  {pillar.number}
                </span>
                <div className="relative flex items-center justify-between gap-4">
                  <span className="font-serif text-3xl font-light text-[var(--color-wild-orange)]">
                    {pillar.number}
                  </span>
                  <span className="border border-white/15 bg-white/[0.03] px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-white/60 transition-colors duration-500 group-hover:border-[var(--color-wild-orange)]/40 group-hover:text-white/80">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="relative mt-5 font-serif text-xl font-light text-white md:text-2xl">{pillar.title}</h3>
                <p className="relative mt-3 font-sans text-sm font-light leading-relaxed text-white/65">
                  {pillar.description}
                </p>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Process */}
      <section className="section-darker border-b border-white/5 py-20 md:py-28">
        <Container wide>
          <Reveal variant="fade-up" className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Personal service
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              From first idea to your
              <span className="block text-white/55">first morning on the trail</span>
            </h2>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              Every journey can be tailored to your dates, party size and interests. All tours are guaranteed
              to depart with a small group of up to 15, or as a solo traveller; detailed itineraries are
              prepared on request.
            </p>
          </Reveal>

          <Reveal as="ol" stagger={0.12} className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.step}
                className="group relative border-t border-white/15 pt-6 transition-colors duration-500 hover:border-[var(--color-wild-orange)]/50"
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-px left-0 h-px w-10 bg-[var(--color-wild-orange)] transition-all duration-700 ease-out group-hover:w-full"
                />
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-wild-orange)]">
                  {step.step}
                </span>
                <h3 className="mt-3 font-serif text-xl font-light text-white transition-colors duration-500 group-hover:text-[var(--color-brass-soft)]">{step.title}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/60">
                  {step.description}
                </p>
              </li>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Integrity */}
      <section className="section-signature border-b border-white/5 py-20 md:py-28">
        <Container wide>
          <Reveal variant="fade-up">
            <div className="relative overflow-hidden border border-white/10 bg-[#132325] p-8 md:p-12">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--color-wild-orange)]/10 blur-3xl"
              />
              <div className="relative flex flex-col gap-6 md:flex-row md:items-start">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-wild-orange)]/40 text-[var(--color-wild-orange)]">
                  <span aria-hidden="true" className="absolute -inset-1.5 rounded-full border border-white/10" />
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current stroke-[1.8]">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
                    <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                    Our operating standard
                  </p>
                  <h3 className="mt-3 font-serif text-2xl font-light text-white md:text-3xl">
                    Grounded in truth, not inflated claims
                  </h3>
                  <p className="mt-5 font-sans text-sm font-light leading-relaxed text-white/70">
                    Every package, duration and route published on this site is drawn from our organisation&rsquo;s
                    brochure catalogue. We intentionally refrain from publishing artificial discount countdowns,
                    fabricated star ratings, or speculative pricing tables.
                  </p>
                  <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/70">
                    Because seasonal weather, flight connections, permit regulations and group sizes vary, we
                    provide accurate, personalised quotations upon enquiry &mdash; ensuring you receive genuine
                    clarity before committing to any journey.
                  </p>

                  <ul className="mt-7 grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                    {[
                      "Brochure-sourced itineraries",
                      "Per-package inclusions",
                      "Dates and pricing confirmed by enquiry",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 font-sans text-xs font-light text-white/80">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[var(--color-wild-orange)]/40 text-[10px] text-[var(--color-wild-orange)]">
                          ✓
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaZoom
        image="/images/destinations/kashmir-shikara.jpg"
        imageAlt="Houseboats moored on Dal Lake in Srinagar beneath snow-covered mountains"
        eyebrow="Begin your exploration"
        title={
          <>
            Ready to plan a journey
            <br className="hidden sm:block" /> with us?
          </>
        }
        body="Tell us which landscapes and cultures call to you. Every journey in our catalogue can be tailored around your dates, party size and interests."
        ctaLabel="Plan your tailor-made trip"
        ctaHref="/enquiry"
      />
    </PageShell>
  );
}
