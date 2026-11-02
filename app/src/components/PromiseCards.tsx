import { PROMISES } from "@/data/siteContent";

/**
 * Promise cards styled in the unified luxury dark Wilderness palette.
 */
export default function PromiseCards() {
  return (
    <section className="bg-[#0C1617] py-12 text-white md:py-16 border-t border-white/5">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <p className="subtitle-large mb-4 text-brass font-accent">The Traveller Promise</p>
          <h2 className="text-h2 mb-4 text-white font-serif font-light">What Travelling With Us Is Really Like</h2>
          <p className="font-serif italic font-light text-base md:text-lg leading-relaxed text-brass-soft/90">
            Taken from how we operate across the subcontinent, in our own words.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PROMISES.map((p) => (
            <article
              key={p.title}
              className="group rounded-[1.25rem] border border-white/10 bg-[#132325] p-5 shadow-xl md:p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brass/50 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.6)]"
            >
              <h3 className="mb-4 text-h4 font-serif font-light text-white transition-colors group-hover:text-brass">
                {p.title}
              </h3>
              <p className="font-sans font-light text-sm leading-relaxed text-white/75">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
