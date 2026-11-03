import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { isEnquiryBackendConfigured } from "@/lib/enquiryConfig";
import { BRAND } from "@/data/brandConfig";

export const metadata: Metadata = {
  title: `Contact Desk — ${BRAND.name}`,
  description:
    `Direct contact details, regional operating desks, and online enquiry information for ${BRAND.name} (in association with ${BRAND.operatorName}).`,
};

export default function ContactPage() {
  const isConfigured = isEnquiryBackendConfigured();

  return (
    <PageShell>
      <Container>
        <section className="py-14 md:py-20 max-w-4xl mx-auto px-4 text-white">
          {/* Header */}
          <div className="border-b border-white/10 pb-6 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-brass/35 bg-black/40 px-3.5 py-1 backdrop-blur-md mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              <p className="font-accent text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-brass-soft">
                Concierge &amp; Specialist Operations
              </p>
            </div>
            <h1 className="text-h2 font-serif font-light text-white mb-3">
              Contact Us
            </h1>
            <p className="font-sans font-light text-sm md:text-base text-white/75 leading-relaxed max-w-2xl">
              Connect with our subcontinent specialists for tailor-made itineraries, small-group expeditions, Himalayan trekking, and Kashmir houseboat reservations, operated in association with {BRAND.operatorName}.
            </p>
          </div>

          {/* System Status Banner */}
          <div className="mb-10 rounded-2xl border border-white/15 bg-[#132325] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full shrink-0 ${
                    isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
                  }`}
                />
                <div>
                  <h2 className="font-serif text-lg font-normal text-white">
                    {isConfigured
                      ? "Online Enquiry System: Active"
                      : "Online Enquiry System: Configuration Pending"}
                  </h2>
                  <p className="font-sans font-light text-xs sm:text-sm text-white/70 mt-1 leading-relaxed">
                    {isConfigured
                      ? "Online journey enquiries submitted via our portal are securely transmitted to our reservations database for review by our travel designers."
                      : "The online submission backend is currently being finalized. Submissions will remain disabled until destination credentials are set."}
                  </p>
                </div>
              </div>
              <Link
                href="/enquiry"
                className="btn-ghost-dark text-xs py-2.5 px-5 self-start sm:self-auto shrink-0"
              >
                Go to Enquiry Form &rarr;
              </Link>
            </div>
          </div>

          {/* Operator Contact Details & Required Placeholders */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-light text-white mb-2">
                Operational Channels &amp; Office Desks
              </h2>
              <p className="font-sans font-light text-xs sm:text-sm text-white/60 mb-6">
                Verified public telephone numbers, dedicated email channels, and physical office addresses are pending supply by the business owner. The placeholders below identify the specific details to be published prior to full commercial rollout:
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Card 1: Direct Helpline & Email */}
              <div className="rounded-xl border border-white/10 bg-[#132325]/70 p-5 space-y-3">
                <div className="flex items-center gap-2 text-brass">
                  <span className="font-serif text-lg">☎</span>
                  <h3 className="font-accent text-xs font-semibold uppercase tracking-wider text-white">
                    Telephone &amp; Messaging
                  </h3>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-white/50 uppercase font-mono text-[10px]">Primary Helpline</p>
                  <p className="font-mono text-brass-soft bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                    [Owner to provide: Verified public telephone / WhatsApp helpline]
                  </p>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  <p className="text-white/50 uppercase font-mono text-[10px]">Operating Hours</p>
                  <p className="font-mono text-white/70 bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                    [Owner to provide: Monitored hours &amp; response time window]
                  </p>
                </div>
              </div>

              {/* Card 2: Electronic Mail */}
              <div className="rounded-xl border border-white/10 bg-[#132325]/70 p-5 space-y-3">
                <div className="flex items-center gap-2 text-brass">
                  <span className="font-serif text-lg">✉</span>
                  <h3 className="font-accent text-xs font-semibold uppercase tracking-wider text-white">
                    Enquiry &amp; Support Email
                  </h3>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="text-white/50 uppercase font-mono text-[10px]">Reservations Desk</p>
                  <p className="font-mono text-brass-soft bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                    [Owner to provide: Official monitored concierge email, e.g. bookings@...]
                  </p>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  <p className="text-white/50 uppercase font-mono text-[10px]">Privacy &amp; Data Erasure</p>
                  <p className="font-mono text-white/70 bg-black/40 px-2.5 py-1.5 rounded border border-white/5">
                    [Owner to provide: Dedicated privacy contact email, e.g. privacy@...]
                  </p>
                </div>
              </div>

              {/* Card 3: Regional Hubs */}
              <div className="rounded-xl border border-white/10 bg-[#132325]/70 p-5 space-y-3">
                <div className="flex items-center gap-2 text-brass">
                  <span className="font-serif text-lg">📍</span>
                  <h3 className="font-accent text-xs font-semibold uppercase tracking-wider text-white">
                    Subcontinent Operational Bases
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-brass-soft font-semibold block">Headquarters:</span>
                    <span className="font-mono text-white/70">[Owner to provide: New Delhi registered office address]</span>
                  </div>
                  <div>
                    <span className="text-brass-soft font-semibold block">Kashmir Houseboat Base:</span>
                    <span className="font-mono text-white/70">[Owner to provide: Srinagar Dal Lake moorings office]</span>
                  </div>
                  <div>
                    <span className="text-brass-soft font-semibold block">Ladakh &amp; Zanskar:</span>
                    <span className="font-mono text-white/70">[Owner to provide: Leh expedition liaison address]</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Legal & Regulatory */}
              <div className="rounded-xl border border-white/10 bg-[#132325]/70 p-5 space-y-3">
                <div className="flex items-center gap-2 text-brass">
                  <span className="font-serif text-lg">⚖</span>
                  <h3 className="font-accent text-xs font-semibold uppercase tracking-wider text-white">
                    Entity &amp; Regulatory Identity
                  </h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-brass-soft font-semibold block">Registered Entity Name:</span>
                    <span className="font-mono text-white/70">[Owner to provide: Full legal business identity &amp; jurisdiction]</span>
                  </div>
                  <div>
                    <span className="text-brass-soft font-semibold block">Tourism &amp; Travel License:</span>
                    <span className="font-mono text-white/70">[Owner to provide: Travel regulatory licence / registration number]</span>
                  </div>
                  <div>
                    <span className="text-brass-soft font-semibold block">Emergency Duty Contact:</span>
                    <span className="font-mono text-white/70">[Owner to provide: 24/7 emergency dispatch line for active tours]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
            <Link href="/enquiry" className="btn-ghost-dark text-xs py-3 px-6">
              Plan Your Trip &rarr;
            </Link>
            <div className="flex items-center gap-4 text-xs font-sans text-white/60">
              <Link href="/privacy" className="hover:text-brass transition-colors underline">
                Privacy Notice
              </Link>
              <span>&bull;</span>
              <Link href="/explore" className="hover:text-brass transition-colors">
                Explore All Journeys
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
