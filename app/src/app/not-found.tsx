import Link from "next/link";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";

export const metadata = {
  title: "Journey not found — India Nepal Travel Organisation",
  description:
    "The journey you are looking for is not in our catalogue. Browse all India and Nepal tours, or send us an enquiry.",
};

export default function NotFound() {
  return (
    <PageShell>
      <Container>
        <section className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center md:py-28">
          <p className="subtitle-large mb-5 text-brass">404</p>
          <h1 className="text-h2 mb-6 text-charcoal">Journey not found</h1>
          <p className="mb-10 max-w-xl font-display text-lg leading-relaxed text-charcoal-soft">
            This journey is not in our catalogue of 27 brochure packages. It may have been renamed,
            or the link may be incomplete.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/explore" className="btn-primary">
              Browse all journeys <span aria-hidden="true">→</span>
            </Link>
            <Link href="/enquiry" className="btn-tertiary">
              Send an enquiry
            </Link>
          </div>
        </section>
      </Container>
    </PageShell>
  );
}
