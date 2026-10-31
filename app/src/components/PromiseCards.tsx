import { PROMISES } from "@/data/siteContent";

/**
 * White-panel promise cards, occupying the same slot the reference site gives to guest
 * testimonials. The copy is taken from the organisation's own brochure rather than from
 * invented reviews, which we have no way of verifying.
 */
export default function PromiseCards() {
  return (
    <section className="bg-white py-20 text-charcoal md:py-28">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="subtitle-large mb-5 text-brass-ink">Guest experiences</p>
          <h2 className="text-h2 mb-6">What travelling with us is really like</h2>
          <p className="font-display text-lg leading-relaxed text-charcoal-soft">
            Taken from how we work, in our own words.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PROMISES.map((p) => (
            <article
              key={p.title}
              className="group rounded-[1rem] border border-border bg-white p-6 shadow-subtle md:p-10 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-15px_rgba(18,52,56,0.15)] hover:border-brass/50"
            >
              <h3 className="mb-4 text-h4 font-serif text-forest transition-colors group-hover:text-brass">{p.title}</h3>
              <p className="font-display text-sm leading-relaxed text-charcoal-soft opacity-80">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
