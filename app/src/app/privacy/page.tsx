import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";
import { BRAND } from "@/data/brandConfig";

export const metadata: Metadata = {
  title: `Privacy Notice — ${BRAND.name}`,
  description:
    `Factual explanation of how personal data, enquiries, and contact information are processed by ${BRAND.name} in association with ${BRAND.operatorName}.`,
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <Container>
        <article className="py-16 md:py-24 max-w-4xl mx-auto px-4 text-white">
          {/* Header */}
          <div className="border-b border-white/10 pb-8 mb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-brass/35 bg-black/40 px-3.5 py-1 backdrop-blur-md mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-brass" />
              <p className="font-accent text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.32em] text-brass-soft">
                Data Transparency &amp; Protection
              </p>
            </div>
            <h1 className="text-h2 font-serif font-light text-white mb-4">
              Privacy Notice
            </h1>
            <p className="font-sans font-light text-sm md:text-base text-white/70 leading-relaxed">
              This notice outlines the exact technical data flows, purposes, storage systems, and retention policies applicable to enquiries and website interactions with {BRAND.name} (presenting expedition itineraries operated in association with {BRAND.operatorName}).
            </p>
          </div>

          <div className="space-y-12 font-sans font-light text-sm md:text-base text-white/80 leading-relaxed">
            {/* Section 1: Overview */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                1. Operational Reality &amp; Scope
              </h2>
              <p>
                We believe in factual transparency. This notice describes only what is technically and operationally implemented on this website. We do not make boilerplate legal representations or cite unverified regulatory memberships.
              </p>
              <p>
                This notice applies to individuals who explore our catalogue, submit tailor-made journey enquiries via our enquiry portal, or sign up for regional travel notes.
              </p>
            </section>

            {/* Section 2: Data Flow */}
            <section className="space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                2. Data We Collect &amp; Actual Transmission Flow
              </h2>
              <p>
                When you interact with our enquiry form at <Link href="/enquiry" className="text-brass underline hover:text-brass-soft">/enquiry</Link>, we collect only the information necessary to plan your custom travel itinerary:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-white/75 text-xs sm:text-sm">
                <li><strong className="text-white">Personal Identity:</strong> Full Name.</li>
                <li><strong className="text-white">Contact Channels:</strong> Email Address, Telephone Number, and your Preferred Contact Method (Email or Phone).</li>
                <li><strong className="text-white">Travel Parameters:</strong> Intended departure date, date flexibility indicator, party size (number of guests), and preferred journey or custom region.</li>
                <li><strong className="text-white">Special Requests:</strong> Dietary requirements, high-altitude trekking experience, accommodation preferences, or specific inquiries provided in the free-text message field.</li>
                <li><strong className="text-white">Technical Anti-Abuse Tokens:</strong> A client-generated unique submission identifier (used exclusively in-memory for 10 minutes to prevent duplicate double-submissions) and a hidden honeypot field (to block automated robotic spam).</li>
              </ul>
              <div className="rounded-xl border border-white/10 bg-[#132325] p-5 text-xs sm:text-sm text-white/75">
                <strong className="text-brass block font-accent uppercase tracking-wider mb-1">
                  Technical Data Path:
                </strong>
                Submissions are transmitted securely over TLS 1.3 / HTTPS to our Next.js API handler (<code className="font-mono text-brass-soft">/api/enquiry</code>). When the backend database is configured, records are stored directly into our secure PostgreSQL database (<code className="font-mono text-brass-soft">enquiries</code> table) hosted on Supabase cloud infrastructure. Records are accessed solely by authenticated operators via a password-protected administrative console.
              </div>
            </section>

            {/* Section 3: Unconfigured State */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                3. Policy on Inactive or Unconfigured Intake
              </h2>
              <p>
                We do not collect personal data deceptively. If the backend database or submission webhook is temporarily unconfigured or undergoing maintenance, the enquiry form is automatically disabled.
              </p>
              <p>
                In this state, form inputs are non-interactive, and no personal names, email addresses, or phone numbers are accepted, transmitted, or logged.
              </p>
            </section>

            {/* Section 4: Purpose */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                4. Purpose of Processing
              </h2>
              <p>
                Your information is used exclusively for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-1.5 text-white/75 text-xs sm:text-sm">
                <li>Evaluating itinerary feasibility, accommodation availability, and seasonal timing for your party.</li>
                <li>Contacting you with a personalized, non-binding itinerary proposal and price quotation.</li>
                <li>Responding to questions regarding regional permits, high-altitude trekking, or houseboat bookings.</li>
              </ul>
              <p className="font-medium text-white/90">
                We never sell, rent, monetize, or disclose your contact information to third-party marketing brokers or advertising networks.
              </p>
            </section>

            {/* Section 5: Retention */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                5. Data Retention &amp; Security
              </h2>
              <p>
                Enquiry records are retained in the concierge intake system for the active duration of the trip planning lifecycle and subsequent tour execution. Inactive inquiries that do not proceed to a confirmed journey are periodically archived or removed from the active database.
              </p>
              <p>
                Administrative access to enquiry records is restricted by authentication protocols. No personal user data is ever written to public server logs or debugging outputs.
              </p>
            </section>

            {/* Section 6: User Rights & Contact */}
            <section className="space-y-3">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                6. Your Rights &amp; How to Request Deletion
              </h2>
              <p>
                You have the right to request a copy of any personal data you have submitted, request correction of inaccurate details, or request that your enquiry record be permanently erased from our intake database.
              </p>
              <p>
                To request data access or erasure, please contact our administrative desk:
              </p>
              <div className="rounded-xl border border-white/10 bg-[#132325] p-5 space-y-2 text-xs sm:text-sm">
                <p>
                  <strong className="text-white">Direct Privacy Contact:</strong>{" "}
                  <span className="font-mono text-brass-soft">[Owner to provide: Official privacy email, e.g. privacy@ks-world-adventure.com]</span>
                </p>
                <p>
                  <strong className="text-white">Registered Entity:</strong>{" "}
                  <span className="text-white/70">[Owner to provide: Full legal company name &amp; registered corporate address]</span>
                </p>
                <p>
                  <strong className="text-white">Emergency Concierge:</strong>{" "}
                  <span className="text-white/70">[Owner to provide: Duty helpline for active travellers]</span>
                </p>
              </div>
            </section>

            {/* Section 7: Important Notice on Bookings */}
            <section className="space-y-3 border-t border-white/10 pt-8">
              <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
                7. Clarification Regarding Bookings &amp; Payment
              </h2>
              <p>
                Submitting an enquiry through this website does not constitute a confirmed travel booking, hotel reservation, or commercial contract. No payment details (such as credit card numbers or bank accounts) are ever requested or stored on this website.
              </p>
              <p>
                All final travel arrangements, invoices, and booking contracts are issued individually after direct consultation and mutual confirmation.
              </p>
            </section>
          </div>

          {/* Return Links */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap gap-4 items-center justify-between">
            <Link href="/enquiry" className="btn-ghost-dark text-xs py-3 px-6">
              &larr; Back to Enquiry Page
            </Link>
            <Link href="/contact" className="text-xs font-accent uppercase tracking-wider text-white/60 hover:text-brass transition-colors">
              Contact Desk &rarr;
            </Link>
          </div>
        </article>
      </Container>
    </PageShell>
  );
}
