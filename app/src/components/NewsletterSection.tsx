"use client";

import { useState } from "react";

const COUNTRIES = [
  "India",
  "Nepal",
  "United Kingdom",
  "United States",
  "Australia",
  "Canada",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "Other",
];

/** Newsletter sign-up on the cream panel, mirroring the reference site's closing form. */
export default function NewsletterSection() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    // --- INTEGRATION BOUNDARY ---
    // No mailing-list service is configured in this repository, so nothing is sent.
    // Point this at the operator's ESP before launch (server action / API route only).
    const { promise } = Promise.withResolvers<void>();
    setTimeout(() => {
      setStatus("success");
      setMessage(
        "Thank you. (This is a development placeholder — no subscription was actually recorded.)",
      );
    }, 900);
    await promise;
    // --- END INTEGRATION BOUNDARY ---
  };

  return (
    <section className="bg-wild-cream py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-10 rounded-image bg-wild-white p-6 shadow-subtle md:p-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="subtitle-large mb-5 text-wild-orange">Need some inspiration?</p>
            <h2 className="text-h3 mb-4 text-charcoal">Be inspired by our latest journeys</h2>
            <p className="font-display leading-relaxed text-charcoal-soft">
              Subscribe to receive new itineraries, seasonal openings and travel notes from our
              specialists.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="nl-first" className="sr-only">
                  First name
                </label>
                <input
                  id="nl-first"
                  name="firstName"
                  type="text"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full rounded-button border border-black/25 bg-transparent px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                />
              </div>
              <div>
                <label htmlFor="nl-surname" className="sr-only">
                  Surname
                </label>
                <input
                  id="nl-surname"
                  name="surname"
                  type="text"
                  autoComplete="family-name"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder="Surname"
                  className="w-full rounded-button border border-black/25 bg-transparent px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                />
              </div>
              <div>
                <label htmlFor="nl-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="nl-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-button border border-black/25 bg-transparent px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                />
              </div>
              <div>
                <label htmlFor="nl-country" className="sr-only">
                  Country of residence
                </label>
                <select
                  id="nl-country"
                  name="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full rounded-button border border-black/25 bg-transparent px-4 py-3 font-display text-sm text-charcoal transition-colors focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                >
                  <option value="">Country of residence</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === "submitting"} className="btn-primary">
                {status === "submitting" ? "Subscribing…" : "Submit"}
              </button>
              {status === "success" && (
                <p role="status" className="font-display text-sm text-charcoal-soft">
                  {message}
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="font-display text-sm text-wild-orange">
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
