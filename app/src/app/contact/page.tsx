import type { Metadata } from "next";
import Link from "next/link";
import CtaZoom from "@/components/CtaZoom";
import Container from "@/components/Container";
import PageShell from "@/components/PageShell";
import PageHero from "@/components/ui/PageHero";
import { BRAND } from "@/data/brandConfig";
import { isEnquiryBackendConfigured } from "@/lib/enquiryConfig";

export const metadata: Metadata = {
  title: `Contact Desk — ${BRAND.name}`,
  description: `Direct contact details, regional operating desks, and online enquiry information for ${BRAND.name} (in association with ${BRAND.operatorName}).`,
};

const CHANNELS = [
  {
    eyebrow: "Journey planning",
    title: "Plan a tailor-made trip",
    body:
      "Tell us your dates, party size and the places you want to see. A travel designer replies with a proposal drawn from the brochure catalogue.",
    href: "/enquiry",
    action: "Open the enquiry form",
  },
  {
    eyebrow: "Kashmir houseboats",
    title: "Reserve a houseboat",
    body:
      "Houseboats on Dal and Nagin Lake, from a two-bedroom craft to a seven-bedroom boat in sole use. Quoted and confirmed separately from our tour packages.",
    href: "/houseboats",
    action: "See houseboat options",
  },
  {
    eyebrow: "Your data",
    title: "Privacy & data requests",
    body:
      "How the details you send us are handled, how long we keep them, and how to ask for a copy or erasure of what we hold.",
    href: "/privacy",
    action: "Read the privacy notice",
  },
];

const DESKS = [
  {
    city: "Sydney",
    role: "International Booking Bureau",
    coordinates: "33.9167° S, 151.0667° E",
    timezone: "Australia/Sydney",
    detail: "68 Beauchamp St., Wiley Park, NSW 2195 (M: 0409 155 229 · T: 02 9579 0044).",
  },
  {
    city: "Delhi",
    role: "Subcontinent Headquarters",
    coordinates: "28.6139° N, 77.2090° E",
    timezone: "Asia/Kolkata",
    detail: "Central transit hub, hotel affiliations and private transport fleet dispatch.",
  },
  {
    city: "Srinagar",
    role: "Kashmir Houseboat Moorings",
    coordinates: "34.0837° N, 74.7973° E",
    timezone: "Asia/Kolkata",
    detail: "Dal & Nigeen Lake moorings office and M.S. Baktoo luxury houseboat base.",
  },
  {
    city: "Leh",
    role: "Ladakh & Zanskar Operations",
    coordinates: "34.1526° N, 77.5771° E",
    timezone: "Asia/Kolkata",
    detail: "High-altitude expedition liaison desk, mountaineering guides and pack crews.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Enquiry & Quotation",
    body:
      "Send your preferred journey, dates and party size. We provide a comprehensive outline quote and tailor the itinerary to your schedule.",
  },
  {
    step: "02",
    title: "$200 Deposit Confirmation",
    body:
      "Secure your departures with the standard $200 per person brochure deposit. Balance is payable 8 weeks before departure.",
  },
  {
    step: "03",
    title: "Vouchers & Expedition Pack",
    body:
      "Your final itinerary, accommodation vouchers, houseboat moorings, vehicle dispatch, and permits are confirmed directly to you.",
  },
];

export default function ContactPage() {
  const isConfigured = isEnquiryBackendConfigured();

  return (
    <PageShell mainClassName="">
      <PageHero
        align="left"
        height="full"
        image="/images/destinations/contact.jpg"
        imageClassName="object-[center_70%]"
        imageAlt="Sunrise illumination over the snow-covered Himalayan peaks of the Annapurna range"
        eyebrow="Concierge & specialist operations"
        title={
          <>
            Speak to a
            <span className="block text-white/60">travel designer</span>
          </>
        }
        lead={`Connect with our subcontinent specialists for tailor-made itineraries, small-group expeditions, Himalayan trekking and Kashmir houseboat reservations, operated in association with ${BRAND.operatorName}.`}
        meta={[
          { value: "28.6139° N, 77.2090° E", label: "Delhi · Srinagar · Leh Desks" },
        ]}
        primaryCta={{ label: "Open the enquiry form", href: "/enquiry" }}
        secondaryCta={{ label: "Browse all journeys", href: "/journeys" }}
        scrollCue
      />

      {/* System status */}
      <section className="border-b border-white/5 bg-[#101F21] py-6">
        <Container wide>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  isConfigured ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <div>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                  {isConfigured ? "Online enquiry system: active" : "Online enquiry system: configuration pending"}
                </p>
                <p className="mt-1 font-sans text-xs font-light leading-relaxed text-white/55">
                  {isConfigured
                    ? "Enquiries submitted through this site are transmitted to our reservations desk for review by a travel designer."
                    : "The submission backend is being finalised. Until it is connected, please use the enquiry form and we will reply by email."}
                </p>
              </div>
            </div>
            <Link
              href="/enquiry"
              className="shrink-0 border-b border-white/35 pb-1 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)]"
            >
              Go to enquiry form →
            </Link>
          </div>
        </Container>
      </section>

      {/* Ways to reach us */}
      <section className="section-discover border-b border-white/5 py-16 md:py-24">
        <Container wide>
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              Ways to reach us
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              One desk, routed
              <span className="block text-white/55">to the right specialist</span>
            </h2>
          </div>

          <div className="mt-12 grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">
            {CHANNELS.map((channel) => (
              <article key={channel.title} className="group bg-[#0C1617] p-7 md:p-9 hover:border-[var(--color-wild-orange)]/50 transition-colors">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-wild-orange)]">
                  {channel.eyebrow}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-light text-white">{channel.title}</h3>
                <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/65">
                  {channel.body}
                </p>
                <Link
                  href={channel.href}
                  className="group/link mt-7 inline-flex items-center gap-3 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:text-[var(--color-wild-orange)]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-wild-orange)] text-[var(--color-wild-orange)] transition-colors duration-300 group-hover/link:bg-[var(--color-wild-orange)] group-hover/link:text-white">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {channel.action}
                </Link>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Regional desks + pending publication */}
      <section className="section-journeys border-b border-white/5 py-16 md:py-24">
        <Container wide>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            {/* Desks */}
            <div>
              <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
                <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
                Operational bases
              </p>
              <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
                Where we work
              </h2>

              <ul className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {DESKS.map((desk) => (
                  <li key={desk.city} className="grid gap-3 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline">
                    <div>
                      <p className="font-serif text-2xl font-light text-white">{desk.city}</p>
                      <p className="mt-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-wild-orange)]">
                        {desk.role}
                      </p>
                      <p className="mt-3 font-sans text-xs font-light leading-relaxed text-white/55">
                        {desk.detail}
                      </p>
                    </div>
                    <div className="font-mono text-[11px] tracking-[0.12em] text-white/40 sm:text-right">
                      <p>{desk.coordinates}</p>
                      <p className="mt-1">{desk.timezone}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Published Booking Bureau from Brochure Page 10 */}
            <div className="border border-white/10 bg-[#132325] p-7 md:p-9 rounded-none">
              <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--color-wild-orange)]">
                Brochure Published Bureau
              </p>
              <h3 className="mt-3 font-serif text-2xl font-light text-white md:text-3xl">
                Booking Desk &amp; Reservations Office
              </h3>
              <p className="mt-4 font-sans text-sm font-light leading-relaxed text-white/65">
                Official contact channels and Australian reservations bureau as published on the {BRAND.operatorName} and {BRAND.bookingDeskName} brochure registry:
              </p>

              <div className="mt-7 space-y-5 border-t border-white/10 pt-6">
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    Primary Office Address
                  </p>
                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-white/75">
                    {BRAND.bookingOffice.address}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    Direct Telephones &amp; Mobile
                  </p>
                  <p className="mt-1 font-mono text-xs text-[var(--color-wild-orange)]">
                    M: {BRAND.bookingOffice.phoneMobile} &bull; T: {BRAND.bookingOffice.phoneLandline}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    Monitored Concierge Emails
                  </p>
                  <p className="mt-1 font-mono text-xs text-white/80">
                    {BRAND.bookingOffice.email} &bull; {BRAND.bookingOffice.altEmail}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                    Booking Deposit &amp; Terms
                  </p>
                  <p className="mt-1 font-sans text-xs font-light leading-relaxed text-white/75">
                    {BRAND.bookingOffice.deposit}. Balance due 8 weeks prior to departure. {BRAND.bookingOffice.amendmentFee}.
                  </p>
                </div>
              </div>

              <div className="mt-7 border-t border-white/10 pt-5 flex flex-wrap gap-2 text-[10px] font-mono text-white/50">
                {BRAND.bookingOffice.websites.map((url) => (
                  <span key={url} className="border border-white/10 bg-white/[0.03] px-2 py-0.5">
                    {url}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* What happens next */}
      <section className="section-darker border-b border-white/5 py-16 md:py-24">
        <Container wide>
          <div className="max-w-3xl">
            <p className="mb-5 flex items-center gap-4 font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[var(--color-wild-orange)]">
              <span className="h-px w-10 bg-[var(--color-wild-orange)]" />
              What happens next
            </p>
            <h2 className="font-serif text-4xl font-light leading-[1.08] tracking-normal text-white md:text-5xl">
              From enquiry to departure
            </h2>
          </div>

          <ol className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.step} className="border-t border-white/15 pt-5">
                <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-wild-orange)]">
                  {step.step}
                </span>
                <h3 className="mt-3 font-serif text-xl font-light text-white">{step.title}</h3>
                <p className="mt-3 font-sans text-sm font-light leading-relaxed text-white/60">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaZoom
        image="/images/destinations/kashmir-shikara.jpg"
        imageAlt="Houseboats moored on Dal Lake in Srinagar beneath snow-covered mountains"
        eyebrow="Plan your journey"
        title={
          <>
            Tell us where
            <br className="hidden sm:block" /> you want to go.
          </>
        }
        body="Dates, party size, travel pace and the landscapes that call to you — we will shape the rest."
        ctaLabel="Enquire now"
        ctaHref="/enquiry"
      />
    </PageShell>
  );
}
