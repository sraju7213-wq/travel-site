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
          <h1 className="text-h2 mb-6 uppercase text-charcoal">Contact us</h1>
          <p className="mb-10 max-w-2xl font-display text-lg leading-relaxed text-charcoal">
            Use the enquiry form to tell us which journey interests you, your dates, party size and any
            preferences.
          </p>

          <div className="mb-12 space-y-4 rounded-[1rem] border border-border bg-white p-8 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-charcoal">Contact notes</h2>
            <p className="font-display leading-relaxed text-charcoal-soft">
              Direct phone numbers, email addresses and office locations have not been supplied by the
              organisation and are therefore not published here. The brochure directs travellers to
              contact India Nepal Travel Centre or their travel agent, and those details will be
              published here once they are confirmed.
            </p>
            <p className="font-display leading-relaxed text-charcoal-soft">
              The enquiry form on this site is not yet connected to a receiving system, so anything
              submitted through it is not transmitted or stored. A full privacy notice is being
              prepared by the organisation and will be published here before launch.
            </p>
          </div>

          <Link href="/enquiry" className="btn-primary">
            Send an enquiry <span aria-hidden="true">&rarr;</span>
          </Link>
        </section>
      </Container>
    </PageShell>
  );
}
