import Link from "next/link";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";

export const metadata = {
  title: "Contact — India Nepal Travel Organisation",
  description:
    "Contact India Nepal Travel Organisation to enquire about tailor-made tours, small-group journeys, Himalayan trekking, cultural itineraries and Kashmir houseboats.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <Container>
        <section className="px-4 py-16 md:px-8 lg:px-12">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-charcoal mb-6 uppercase">
            Contact us
          </h1>
          <p className="text-lg font-display text-charcoal leading-relaxed mb-10 max-w-2xl">
            The quickest way to reach us is through the enquiry form below. Tell us which journey
            interests you, your dates, party size and any preferences, and we will reply directly.
          </p>
          <div className="rounded-image border border-wild-border-light bg-ivory-soft p-8 mb-12">
            <h2 className="text-xl font-serif font-bold text-charcoal mb-4">
              Contact notes
            </h2>
            <p className="text-sm font-display text-charcoal-soft leading-relaxed">
              Direct phone numbers, email addresses and office locations have not been supplied by
              the organisation and are intentionally not published here. Use the enquiry form to
              get in touch; we will respond with the appropriate contact details.
            </p>
            <p className="mt-4 text-sm font-display text-charcoal-soft leading-relaxed">
              We do not share or sell your details. Enquiries are used only to respond to your trip
              request.
            </p>
          </div>
          <Link
            href="/enquiry"
            className="btn-tertiary"
          >
            Send an enquiry <span aria-hidden="true">→</span>
          </Link>
        </section>
      </Container>
    </PageShell>
  );
}
