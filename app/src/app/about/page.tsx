import Image from "next/image";
import Link from "next/link";
import CtaZoom from "@/components/CtaZoom";
import Container from "@/components/Container";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/ui/PageHero";
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
    value: "27",
    label: "Curated journeys",
    detail: "Himalayan expeditions, cultural circuits, wildlife safaris and city stopovers.",
  },
  {
    value: "2",
    label: "Dedicated realms",
    detail: "Specialist travel across India and Nepal, the subcontinent and the Himalaya.",
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
      "Browse 27 hand-crafted itineraries across Himalayan treks, Kashmir houseboats, Rajasthan forts, and Nepal's sacred valleys.",
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
        imageAlt="Desert expedition caravan with camels and travelers crossing sand dunes at sunset"
        eyebrow="Est. 1927 · Specialist travel"
        title={
          <>
            A century of travel
            <span className="block text-white/60">across India &amp; Nepal</span>
          </>
        }
        lead="Founded on the mountain waters of Kashmir and forged along the high trails of the Himalayas, our organisation has arranged specialist travel for nearly one hundred years — with offices in Delhi, Kashmir and Ladakh, and a fleet of cars in Delhi and luxurious houseboats in Kashmir."
        meta={[{ value: "Since 1927", label: "Baktoo family heritage" }]}
        primaryCta={{ label: "Plan your journey", href: "/enquiry" }}
        secondaryCta={{ label: "View all 27 journeys", href: "/journeys" }}
        scrollCue
      />

      {/* Key numbers */}
      <section className="section-discover border-b border-white/5 py-14 md:py-16" aria-label="Key facts about our organisation">
        <Container wide>
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-t border-white/10 pt-4">
                <dt className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                  {stat.label}
                </dt>
                <dd>
                  <span className="mt-2 block font-serif text-3xl font-light leading-none text-white md:text-4xl">
                    {stat.value}
                  </span>
                  <span className="mt-2 block font-sans text-xs font-light leading-relaxed text-white/55">
                    {stat.detail}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* The family */}
      <section className="section-darker border-b border-white/5 py-16 md:py-24" id="founders">
        <Container wide>
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Founders &amp; visionaries
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              The Baktoo family heritage
            </h2>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              The Baktoo family has been promoting and sharing experiences in tourism since 1927. Journeys
              presented by {BRAND.name} are operated in historical association with {BRAND.operatorName}{" "}
              based in India.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Sultan Baktoo */}
            <article className="group flex gap-6 border-t border-white/10 pt-6">
              <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-[#0C1617] sm:w-36">
                <Image
                  src="/images/destinations/sultan-baktoo.jpg"
                  alt="Sultan Baktoo, pioneer of tourism and travel in Kashmir"
                  fill
                  sizes="144px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  Founder &amp; pioneer
                </span>
                <h3 className="mt-2 font-serif text-2xl font-light text-white">Sultan Baktoo</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                  Haji Mohammed Sultan Baktoo pioneered tourism and trekking in Northern India beginning in
                  1927. Historically recorded as the chief operator with hotel partnerships, a transport fleet
                  in Delhi, and the M.S. Baktoo luxury houseboat group in Kashmir, KHE (Kashmir Himalayan
                  Expeditions / Baktoo family operations) established operational links across India and Nepal.
                </p>
              </div>
            </article>

            {/* Farook Baktoo */}
            <article className="group flex gap-6 border-t border-white/10 pt-6">
              <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden bg-[#0C1617] sm:w-36">
                <Image
                  src="/images/destinations/farook-baktoo.jpg"
                  alt="Farook Baktoo, Himalayan expedition leader and director"
                  fill
                  sizes="144px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  Director &amp; expedition leader
                </span>
                <h3 className="mt-2 font-serif text-2xl font-light text-white">Farook Baktoo</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/70">
                  Farook has been planning and promoting tourism to the sub-continent for the past 20 years.
                  Having grown up in the lush Kashmir Valley and born into one of the pioneering families of
                  Himalayan trekking, Farook has led many tours and treks in the Himalayan, Karakoram, Zanskar
                  and Ladakh ranges.
                </p>
              </div>
            </article>
          </div>

          {/* Operations & Leadership Team from family archives */}
          <div className="mt-12 pt-10 border-t border-white/10">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)] mb-6">
              Operations &amp; Subcontinent Leadership
            </p>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="border border-white/10 bg-[#0C1617] p-5 flex gap-4 items-center transition-colors hover:border-[var(--color-wild-orange)]/60">
                <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-black/40">
                  <Image
                    src="/images/destinations/yousuf-baktoo.jpg"
                    alt="Yousuf Baktoo"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-white">Yousuf Baktoo</h4>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/50">Senior Executive</p>
                </div>
              </div>

              <div className="border border-white/10 bg-[#0C1617] p-5 flex gap-4 items-center transition-colors hover:border-[var(--color-wild-orange)]/60">
                <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-black/40">
                  <Image
                    src="/images/destinations/imtiaz-baktoo.jpg"
                    alt="Imtiaz Baktoo"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-white">Imtiaz Baktoo</h4>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/50">Operations &amp; Logistics</p>
                </div>
              </div>

              <div className="border border-white/10 bg-[#0C1617] p-5 flex gap-4 items-center transition-colors hover:border-[var(--color-wild-orange)]/60">
                <div className="relative aspect-square w-16 shrink-0 overflow-hidden bg-black/40">
                  <Image
                    src="/images/destinations/hashim-baktoo.jpg"
                    alt="Hashim Baktoo"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-lg font-light text-white">Hashim Baktoo</h4>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-white/50">Expedition Planning</p>
                </div>
              </div>
            </div>
          </div>

          {/* Archival quote */}
          <figure className="mt-14 border-t border-white/10 pt-10">
            <div className="grid gap-8 md:grid-cols-[100px_1fr] md:items-center">
              <div className="relative aspect-square w-24 overflow-hidden rounded-none border border-white/15 bg-[#0C1617]">
                <Image
                  src="/images/destinations/founder-welcome.jpg"
                  alt="Traditional Indian Namaste welcome greeting"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div>
                <blockquote className="font-serif text-xl font-light italic leading-relaxed text-white/90 md:text-2xl">
                  &ldquo;Our tours are planned without minimum group cancellations and can be enjoyed by a
                  small group of up to 15 or as a solo traveller. Itineraries provided in this brochure are an
                  outline of what you can expect. Detailed information is available on request.&rdquo;
                </blockquote>
                <figcaption className="mt-5 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  The Baktoo family archives &mdash; {BRAND.operatorName} (presented by {BRAND.name})
                </figcaption>
              </div>
            </div>
          </figure>
        </Container>
      </section>

      {/* Two realms */}
      <section className="section-signature border-b border-white/5 py-16 md:py-24" aria-label="Our destinations: India and Nepal">
        <Container wide>
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Two diverse lands
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              Two distinct civilisations,
              <span className="block text-white/55">one seamless journey</span>
            </h2>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              We operate exclusively in India and Nepal, with offices in Delhi, Kashmir and Ladakh.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* India */}
            <article className="group relative overflow-hidden border border-white/10 bg-[#0C1617]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/destinations/amber-fort.jpg"
                  alt="The sandstone ramparts of Amer Fort above Jaipur in Rajasthan"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0C1617] via-[#0C1617]/20 to-transparent" />
                <span className="absolute left-5 top-5 border border-white/25 bg-black/40 px-3.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
                  India
                </span>
              </div>
              <div className="p-7 md:p-9">
                <h3 className="font-serif text-2xl font-light text-white md:text-3xl">
                  From royal palaces to glaciated passes
                </h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/70">
                  Rajasthan&rsquo;s historic desert citadels, Varanasi&rsquo;s ancient dawn ghats along the
                  Ganges, tranquil houseboat cruises through the Kerala backwaters, and high Buddhist
                  monasteries in Ladakh.
                </p>
                <ul className="mt-6 grid gap-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-white/60 sm:grid-cols-2">
                  {[
                    "Golden Triangle & Rajasthan",
                    "Kashmir Valley & Houseboats",
                    "Ladakh & Zanskar Treks",
                    "Kerala Backwaters & South India",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/explore?category=India%20Tours"
                  className="group/link mt-8 inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--color-wild-orange)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover/link:bg-[var(--color-wild-orange)] group-hover/link:text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Explore India journeys
                </Link>
              </div>
            </article>

            {/* Nepal */}
            <article className="group relative overflow-hidden border border-white/10 bg-[#0C1617]">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/destinations/nepal-boudhanath-dusk.jpg"
                  alt="Boudhanath Stupa in Kathmandu at dusk, ringed by prayer flags"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0C1617] via-[#0C1617]/20 to-transparent" />
                <span className="absolute left-5 top-5 border border-white/25 bg-black/40 px-3.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.24em] text-white/90 backdrop-blur-sm">
                  Nepal
                </span>
              </div>
              <div className="p-7 md:p-9">
                <h3 className="font-serif text-2xl font-light text-white md:text-3xl">
                  The sanctuary of the high peaks
                </h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/70">
                  Kathmandu&rsquo;s sacred Newari temples, peaceful lakeside reflections in Pokhara, white-water
                  rafting along the roaring Trisuli River, and rhino safaris in Chitwan National Park.
                </p>
                <ul className="mt-6 grid gap-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-white/60 sm:grid-cols-2">
                  {[
                    "Kathmandu Valley World Heritage",
                    "Himalayan Mini & Multi-Day Treks",
                    "Chitwan Jungle Wildlife Safaris",
                    "Trisuli River Rafting Expeditions",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--color-wild-orange)]" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/explore?category=Nepal%20Adventure"
                  className="group/link mt-8 inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--color-wild-orange)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover/link:bg-[var(--color-wild-orange)] group-hover/link:text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Explore Nepal journeys
                </Link>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* Standards */}
      <section className="section-pillars border-b border-white/5 py-16 md:py-24" aria-label="Our travel standards and principles">
        <Container wide>
          <div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end">
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
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div key={pillar.number} className="border-t border-white/10 pt-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-serif text-3xl font-light text-[var(--color-wild-orange)]">
                    {pillar.number}
                  </span>
                  <span className="border border-white/15 px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-white/60">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="mt-4 font-serif text-xl font-light text-white md:text-2xl">{pillar.title}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/65">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="section-darker border-b border-white/5 py-16 md:py-24">
        <Container wide>
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Personal service
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              From first idea to your
              <span className="block text-white/55">first morning on the trail</span>
            </h2>
            <p className="mt-6 font-sans text-sm font-light leading-relaxed text-white/70 md:text-base">
              All tours are guaranteed to depart and can be enjoyed by a small group of up to 15, or as a solo
              traveller. Itineraries in the brochure are an outline; detailed information is available on
              request.
            </p>
          </div>

          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <li key={step.step} className="relative border-t border-white/15 pt-5">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-wild-orange)]">
                  {step.step}
                </span>
                <h3 className="mt-3 font-serif text-xl font-light text-white">{step.title}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/60">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Integrity */}
      <section className="section-signature border-b border-white/5 py-16 md:py-24">
        <Container wide>
          <div className="flex flex-col gap-6 border border-white/10 bg-[#132325] p-8 md:flex-row md:items-start md:p-12">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 text-[var(--color-wild-orange)]">
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
