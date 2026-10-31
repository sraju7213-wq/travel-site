import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "About Us — Specialist Travel Across India & Nepal Since 1927",
  description:
    "Specialist tour operator for India and Nepal since 1927, with offices in Delhi, Kashmir and Ladakh and agents throughout India and Nepal.",
};

const STATS = [
  {
    value: "1927",
    label: "Founding Heritage",
    detail: "Operating tours and treks to Northern India since 1927.",
  },
  {
    value: "27",
    label: "Curated Journeys",
    detail: "Himalayan expeditions, cultural circuits, wildlife safaris, and city stopovers.",
  },
  {
    value: "2",
    label: "Dedicated Realms",
    detail: "Specialist travel across India and Nepal, the subcontinent and the Himalaya.",
  },
  {
    value: "Up to 15",
    label: "Guests per Group",
    detail:
      "Guaranteed to depart, as a small group of up to 15 travellers or as a solo traveller.",
  },
];

const PILLARS = [
  {
    number: "01",
    title: "Guides and support crews",
    description:
      "Special-interest tours are escorted by a team leader from Australia who specialises in a particular area. All of our special interest tours are arranged through India Nepal Travel Centre or your travel agent.",
    badge: "Escorted Tours",
  },
  {
    number: "02",
    title: "Accommodation",
    description:
      "All our accommodation has been carefully selected. We use hotels that are well serviced and centrally located, chosen for ambience, comfort, architecture and history, from deluxe categories to family-run establishments.",
    badge: "Selected Lodgings",
  },
  {
    number: "03",
    title: "Programmes",
    description:
      "We arrange special-interest tours for clubs, schools, social or special-interest groups (Ayurveda, gardening, golf, business, textiles, fashion, yoga) and run escorted student tours for schools in both India and Nepal.",
    badge: "Special Interest",
  },
  {
    number: "04",
    title: "Tailor-made itineraries",
    description:
      "Every itinerary in our catalogue can be tailored to your schedule, party size and interests. Itineraries in the brochure are an outline; detailed information is available on request.",
    badge: "Tailor-Made",
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
    title: "Guaranteed departures",
    description:
      "All tours are guaranteed to depart and can be enjoyed by a small group of up to 15 travellers, or as a solo traveller.",
  },
];

export default function AboutPage() {
  return (
    <PageShell mainClassName="">
      {/* 1. Hero Section: Atmospheric Full-Bleed Dark Canvas */}
      <section className="relative overflow-hidden bg-forest pt-[104px] pb-20 text-white md:pt-[132px] md:pb-28">
        {/* Subtle decorative background watermark */}
        <p
          aria-hidden="true"
          data-watermark="Since 1927"
          className="watermark-text pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-serif text-[14vw] uppercase leading-none tracking-[0.05em] text-white/[0.03] select-none"
        />

        <div className="relative mx-auto max-w-[1400px] px-4 md:px-8">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb" className="mb-8 text-xs font-display font-medium uppercase tracking-[0.2em] text-white/60">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-brass transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-white/30">/</li>
              <li className="text-brass-ink" aria-current="page">About Us</li>
            </ol>
          </nav>

          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-brass/30 bg-brass/10 px-4 py-1.5 text-xs font-display font-semibold uppercase tracking-[0.25em] text-brass mb-6">
                <span>Est. 1927</span>
                <span className="h-1 w-1 rounded-full bg-brass" />
                <span>Specialist Travel</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif font-normal text-white leading-[1.12] tracking-tight mb-6">
                Nearly a century of specialist travel across India &amp; Nepal
              </h1>

              <p className="mb-5 font-display text-lg leading-relaxed text-white/85 md:text-xl">
                Founded on the mountain waters of Kashmir and forged along the high trails of the
                Himalayas, our organisation has arranged specialist travel for nearly one hundred years.
              </p>

              <p className="mb-8 font-display text-base leading-relaxed text-white/70 md:text-lg">
                Offices in Delhi, Kashmir and Ladakh, with a fleet of cars in Delhi and luxurious
                houseboats in Kashmir. All tours are organized in association with our family company
                based in India.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/enquiry" className="btn-primary">
                  Plan your journey <span aria-hidden="true">→</span>
                </Link>
                <Link href="/explore" className="btn-ghost-dark">
                  View all 27 journeys
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main hero photograph */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1rem] border border-white/15 bg-charcoal shadow-2xl">
                  <Image
                    src="/images/destinations/kashmir-shikara.jpg"
                    alt="A traditional shikara boat carrying flowers across Dal Lake in Kashmir against the mountains"
                    fill
                    priority
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 450px, 100vw"
                    className="object-cover"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                  {/* Caption badge overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="text-xs font-display uppercase tracking-[0.2em] text-brass mb-1">
                      Our Home Waters
                    </p>
                    <p className="font-serif text-lg leading-snug">
                      Dal Lake, Kashmir &mdash; where our family&rsquo;s hospitality tradition began in 1927.
                    </p>
                  </div>
                </div>

                {/* Overlapping archival badge */}
                <div className="absolute -bottom-5 -left-5 hidden sm:flex items-center gap-3.5 rounded-xl border border-white/20 bg-charcoal/95 backdrop-blur-md p-4 text-white shadow-xl">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brass font-serif text-lg font-bold text-white shadow-md">
                    IN
                  </span>
                  <div>
                    <p className="font-serif text-sm font-bold text-white">India Nepal Travel</p>
                    <p className="text-[0.65rem] font-display tracking-wider text-white/70 uppercase">Specialist Travel Since 1927</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Numbers Ribbon: Clean Contrast Band */}
      <section className="border-y border-border bg-ivory-soft py-14 text-charcoal" aria-label="Key facts about our organisation">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-l-2 border-brass pl-5">
                <dt className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-brass-ink mb-1">
                  {stat.label}
                </dt>
                <dd className="font-serif text-4xl font-bold tracking-tight text-forest md:text-5xl mb-2">
                  {stat.value}
                </dd>
                <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                  {stat.detail}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 3. The Founders & Visionaries: Editorial Showcase */}
      <section className="bg-white py-20 text-charcoal md:py-28" id="founders">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="subtitle-large mb-4 text-brass-ink">Founders &amp; Visionaries</p>
            <h2 className="text-h2 mb-6 text-forest">
              The Baktoo family
            </h2>
            <p className="font-display text-lg leading-relaxed text-charcoal-soft">
              The Baktoo family has been promoting and sharing experiences in tourism since 1927. All
              tours are organized in association with our family company based in India.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Sultan Baktoo */}
            <article className="group flex flex-col sm:flex-row gap-6 rounded-[1rem] border border-border bg-white p-6 shadow-subtle transition-all duration-300 hover:shadow-card md:p-8">
              <div className="relative aspect-[4/5] w-full sm:w-[160px] shrink-0 overflow-hidden rounded-image bg-ivory-soft border border-border">
                <Image
                  src="/images/destinations/sultan-baktoo.jpg"
                  alt="Sultan Baktoo, pioneer of tourism and travel in Kashmir"
                  fill
                  sizes="160px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink mb-1">
                  Founder &amp; Pioneer
                </span>
                <h3 className="mb-3 font-serif text-2xl font-bold text-forest">
                  Sultan Baktoo
                </h3>
                <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                  Sultan Baktoo has operated tours and treks to Northern India since 1927. He is the
                  chief operator, with hotels, a fleet of cars in Delhi and luxurious houseboats in
                  Kashmir. KHE operates offices in Delhi, Kashmir and Ladakh and agents/sub-agents in
                  all parts of India and Nepal.
                </p>
              </div>
            </article>

            {/* Farook Baktoo */}
            <article className="group flex flex-col sm:flex-row gap-6 rounded-[1rem] border border-border bg-white p-6 shadow-subtle transition-all duration-300 hover:shadow-card md:p-8">
              <div className="relative aspect-[4/5] w-full sm:w-[160px] shrink-0 overflow-hidden rounded-image bg-ivory-soft border border-border">
                <Image
                  src="/images/destinations/farook-baktoo.jpg"
                  alt="Farook Baktoo, Himalayan expedition leader and director"
                  fill
                  sizes="160px"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink mb-1">
                  Director &amp; Expedition Leader
                </span>
                <h3 className="mb-3 font-serif text-2xl font-bold text-forest">
                  Farook Baktoo
                </h3>
                <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                  Farook has been planning and promoting tourism to the sub-continent for the past 20
                  years. Having grown up in the lush Kashmir Valley and born into one of the pioneering
                  families of Himalayan trekking, Farook has led many tours and treks in the Himalayan,
                  Karakoram, Zanskar and Ladakh ranges.
                </p>
              </div>
            </article>
          </div>

          {/* Archival Note & Welcome Philosophy */}
          <div className="mt-12 overflow-hidden rounded-[1rem] border border-border bg-ivory-soft p-8 md:p-10">
            <div className="grid items-center gap-8 md:grid-cols-[100px_1fr]">
              <div className="relative aspect-square w-24 overflow-hidden rounded-full border-2 border-brass/40 bg-ivory-soft">
                <Image
                  src="/images/destinations/founder-welcome.jpg"
                  alt="Archival welcome crest from the founding family"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div>
                <blockquote className="font-serif text-lg italic leading-relaxed text-forest md:text-xl">
                  &ldquo;Our tours are guaranteed to depart and can be enjoyed by a small group of up to 15 or as a
                  solo traveller. Itineraries provided in this brochure are an outline of what you can
                  expect. Detailed information is available on request.&rdquo;
                </blockquote>
                <p className="mt-4 text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink">
                  The Baktoo Family &mdash; India Nepal Travel Organisation
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Two Extraordinary Realms: India & Nepal Contrast */}
      <section className="section-dark relative overflow-hidden py-20 text-white md:py-28" aria-label="Our destinations: India and Nepal">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="subtitle-large mb-4 text-brass">Two Diverse Lands</p>
            <h2 className="text-h2 mb-6 text-white">
              Two distinct civilisations, one seamless journey
            </h2>
            <p className="font-display text-lg leading-relaxed text-white/80">
              We operate exclusively in India and Nepal, with offices in Delhi, Kashmir and Ladakh.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* India Card */}
            <div className="group relative overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/destinations/jodhpur-fort.jpg"
                    alt="Majestic desert fort and palace architecture in Rajasthan, India"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-charcoal/70 backdrop-blur-md px-3.5 py-1 text-xs font-display font-medium tracking-wider uppercase text-brass border border-white/10">
                    India
                  </span>
                </div>
                <div className="p-8 pb-4">
                  <h3 className="mb-3 font-serif text-2xl font-bold text-white">
                    From Royal Palaces to Glaciated Passes
                  </h3>
                  <p className="mb-6 font-display text-sm leading-relaxed text-white/75">
                    Rajasthan&rsquo;s historic desert citadels, Varanasi&rsquo;s ancient dawn ghats along the Ganges,
                    tranquil houseboat cruises through the Kerala backwaters, and high Buddhist monasteries in Ladakh.
                  </p>
                  <ul className="mb-6 grid gap-2.5 text-xs font-display uppercase tracking-wider text-white/70 sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Golden Triangle &amp; Rajasthan
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Kashmir Valley &amp; Houseboats
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Ladakh &amp; Zanskar Treks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Kerala Backwaters &amp; South India
                    </li>
                  </ul>
                </div>
              </div>
              <div className="px-8 pb-8">
                <Link href="/explore?category=India%20Tours" className="btn-tertiary">
                  Explore India Journeys <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Nepal Card */}
            <div className="group relative overflow-hidden rounded-[1rem] border border-white/10 bg-charcoal flex flex-col justify-between">
              <div>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src="/images/destinations/pokhara-lake.jpg"
                    alt="Annapurna mountain range reflected in Pokhara lake in Nepal"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
                  <span className="absolute top-4 left-4 rounded-full bg-charcoal/70 backdrop-blur-md px-3.5 py-1 text-xs font-display font-medium tracking-wider uppercase text-brass border border-white/10">
                    Nepal
                  </span>
                </div>
                <div className="p-8 pb-4">
                  <h3 className="mb-3 font-serif text-2xl font-bold text-white">
                    The Sanctuary of the High Peaks
                  </h3>
                  <p className="mb-6 font-display text-sm leading-relaxed text-white/75">
                    Kathmandu&rsquo;s sacred Newari temples, peaceful lakeside reflections in Pokhara,
                    white-water rafting along the roaring Trisuli River, and rhino safaris in Chitwan National Park.
                  </p>
                  <ul className="mb-6 grid gap-2.5 text-xs font-display uppercase tracking-wider text-white/70 sm:grid-cols-2">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Kathmandu Valley World Heritage
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Himalayan Mini &amp; Multi-Day Treks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Chitwan Jungle Wildlife Safaris
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                      Trisuli River Rafting Expeditions
                    </li>
                  </ul>
                </div>
              </div>
              <div className="px-8 pb-8">
                <Link href="/explore?category=Nepal%20Adventure" className="btn-tertiary">
                  Explore Nepal Journeys <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Core Philosophy: Our 4 Pillars */}
      <section className="bg-ivory-soft py-20 text-charcoal md:py-28" aria-label="Our travel standards and principles">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="subtitle-large mb-4 text-brass-ink">Our Standards</p>
            <h2 className="text-h2 mb-6 text-forest">How we travel</h2>
            <p className="font-display text-lg leading-relaxed text-charcoal-soft">
              Four principles we have worked to since 1927.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="group rounded-[1rem] border border-border bg-white p-8 shadow-subtle transition-all duration-300 hover:shadow-card hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-3xl font-bold text-brass-ink">
                    {pillar.number}
                  </span>
                  <span className="rounded-full bg-ivory-soft px-3 py-1 text-xs font-display font-medium uppercase tracking-wider text-charcoal-soft border border-border">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="mb-3 font-serif text-2xl font-bold text-forest">
                  {pillar.title}
                </h3>
                <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. The Enquiry-Led Process: How We Work */}
      <section className="bg-white py-20 text-charcoal md:py-28">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <p className="subtitle-large mb-4 text-brass-ink">Personal Service</p>
            <h2 className="text-h2 mb-6 text-forest">
              From initial idea to your first morning on the trail
            </h2>
            <p className="font-display text-lg leading-relaxed text-charcoal-soft">
              All tours are guaranteed to depart and can be enjoyed by a small group of up to 15, or as
              a solo traveller. Itineraries in the brochure are an outline; detailed information is
              available on request.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.step}
                className="rounded-[1rem] border border-border bg-ivory-soft p-6 transition-all duration-300 hover:border-brass/40 hover:shadow-subtle"
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-forest font-serif text-lg font-bold text-brass">
                  {step.step}
                </span>
                <h3 className="mb-2 font-serif text-xl font-bold text-forest">
                  {step.title}
                </h3>
                <p className="font-display text-sm leading-relaxed text-charcoal-soft">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Integrity & Transparency Commitment: Clean Professional Assurance */}
      <section className="bg-ivory py-16 border-y border-border">
        <div className="mx-auto max-w-[1100px] px-4 md:px-8">
          <div className="rounded-[1rem] border border-border bg-white p-8 md:p-12 shadow-subtle">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brass-ink/10 text-brass-ink border border-brass-ink/20">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-none stroke-current stroke-[1.8]"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinejoin="round" />
                  <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink mb-2">
                  Our Operating Standard
                </p>
                <h3 className="mb-4 font-serif text-2xl font-bold text-forest">
                  Grounded in Truth, Not Inflated Claims
                </h3>
                <p className="mb-4 font-display text-sm leading-relaxed text-charcoal-soft">
                  Every package, duration and route published on this site is drawn from our
                  organisation&rsquo;s brochure catalogue. We intentionally refrain from publishing
                  artificial discount countdowns, fabricated star ratings, or speculative pricing tables.
                </p>
                <p className="mb-6 font-display text-sm leading-relaxed text-charcoal-soft">
                  Because seasonal weather, flight connections, permit regulations and group sizes vary,
                  we provide accurate, personalised quotations upon enquiry &mdash; ensuring you receive genuine
                  clarity before committing to any journey.
                </p>

                <div className="grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
                  <div className="flex items-center gap-2 text-xs font-display font-medium text-charcoal">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ivory-soft text-brass-ink font-bold text-[0.65rem]">✓</span>
                    <span>Brochure-sourced itineraries</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-display font-medium text-charcoal">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ivory-soft text-brass-ink font-bold text-[0.65rem]">✓</span>
                    <span>Per-package inclusions</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-display font-medium text-charcoal">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ivory-soft text-brass-ink font-bold text-[0.65rem]">✓</span>
                    <span>Dates and pricing confirmed by enquiry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Signature Call to Action */}
      <section className="section-darker relative overflow-hidden py-24 text-center md:py-32">
        <p
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center font-serif text-[24vw] font-bold text-white/[0.02] select-none"
        >
          IN
        </p>

        <div className="relative z-10 mx-auto max-w-3xl px-4 md:px-8">
          <p className="subtitle-large mb-4 text-brass">Begin your exploration</p>
          <h2 className="text-h2 mb-6 text-white">Ready to plan a journey with us?</h2>
          <p className="mb-10 font-display text-lg leading-relaxed text-white/80">
            Tell us which landscapes and cultures call to you. Every journey in our catalogue can be
            tailored around your dates, party size and interests.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/enquiry" className="btn-primary">
              Plan your tailor-made trip <span aria-hidden="true">→</span>
            </Link>
            <Link href="/explore" className="btn-ghost-dark">
              Browse our catalogue
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

