"use client";

import { useEffect, useRef, useState } from "react";
import { validateNewsletter } from "@/lib/enquiryValidation";

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

type Status = "idle" | "submitting" | "subscribed" | "failed";

export default function NewsletterSection() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstInvalidRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "failed") return;
    const target = firstInvalidRef.current
      ? document.getElementById(firstInvalidRef.current)
      : null;
    if (target instanceof HTMLElement) target.focus();
    else errorSummaryRef.current?.focus();
  }, [status]);

  useEffect(() => {
    if (status === "subscribed") successHeadingRef.current?.focus();
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const validationErrors = validateNewsletter({ firstName, surname, email, country, consent });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("failed");
      setMessage("Please correct the highlighted fields and try again.");
      firstInvalidRef.current = Object.keys(validationErrors)[0] ?? null;
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName, surname, email, country, consent, website: "" }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && result.ok) {
        setStatus("subscribed");
        setMessage("You are subscribed to our travel notes.");
        return;
      }

      if (result.code === "validation_failed" && result.errors) {
        setErrors(result.errors);
        setStatus("failed");
        setMessage("Please correct the highlighted fields and try again.");
        firstInvalidRef.current = Object.keys(result.errors)[0] ?? null;
        return;
      }

      setStatus("failed");
      setMessage(
        result.message ??
          "Your subscription could not be recorded. Please try again later.",
      );
    } catch {
      setStatus("failed");
      setMessage("Your subscription could not be recorded because of a network problem.");
    }
  };

  const fieldError = (name: string) => errors[name];

  if (status === "subscribed") {
    return (
      <section className="bg-ivory-soft py-16 md:py-24">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="rounded-image bg-white p-6 shadow-subtle md:p-12">
            <p className="subtitle-large mb-4 text-brass-ink">Travel notes</p>
            <h2 ref={successHeadingRef} tabIndex={-1} className="text-h3 mb-4 text-charcoal">
              Subscribed
            </h2>
            <p className="font-display leading-relaxed text-charcoal-soft">{message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-ivory-soft py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-10 rounded-image bg-white p-6 shadow-subtle md:p-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="subtitle-large mb-5 text-brass-ink">Travel notes</p>
            <h2 className="text-h3 mb-4 text-charcoal">Subscribe for updates</h2>
            <p className="font-display leading-relaxed text-charcoal-soft">
              Receive new itineraries and travel notes from our specialists.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {status === "failed" && message && (
              <div
                ref={errorSummaryRef}
                role="alert"
                tabIndex={-1}
                className="mb-6 rounded-image border border-brass-ink bg-brass-ink/10 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <p className="font-display text-sm text-charcoal">{message}</p>
              </div>
            )}
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
                  aria-invalid={!!fieldError("firstName")}
                  aria-describedby={fieldError("firstName") ? "nl-first-error" : undefined}
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("firstName") ? "border-brass" : "border-black/25"
                  }`}
                />
                {fieldError("firstName") && (
                  <p id="nl-first-error" className="mt-1 text-[0.8rem] font-display text-brass-ink">
                    {fieldError("firstName")}
                  </p>
                )}
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
                  aria-invalid={!!fieldError("surname")}
                  aria-describedby={fieldError("surname") ? "nl-surname-error" : undefined}
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("surname") ? "border-brass" : "border-black/25"
                  }`}
                />
                {fieldError("surname") && (
                  <p id="nl-surname-error" className="mt-1 text-[0.8rem] font-display text-brass-ink">
                    {fieldError("surname")}
                  </p>
                )}
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  aria-invalid={!!fieldError("email")}
                  aria-describedby={fieldError("email") ? "nl-email-error" : undefined}
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-charcoal transition-colors placeholder:text-charcoal-soft/70 focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("email") ? "border-brass" : "border-black/25"
                  }`}
                />
                {fieldError("email") && (
                  <p id="nl-email-error" className="mt-1 text-[0.8rem] font-display text-brass-ink">
                    {fieldError("email")}
                  </p>
                )}
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
                  className="w-full rounded-button border border-black/25 bg-transparent px-4 py-3 font-display text-sm text-charcoal transition-colors focus:border-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
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

            <div className="mt-4 space-y-2">
              <label className="flex cursor-pointer items-start gap-2 text-sm font-display text-charcoal-soft">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!fieldError("consent")}
                  aria-describedby={fieldError("consent") ? "nl-consent-error" : undefined}
                  className="mt-0.5 text-charcoal"
                />
                <span>
                  I would like to receive travel notes from India Nepal Travel Organisation by email.{" "}
                  <span className="text-brass-ink">*</span>
                </span>
              </label>
              {fieldError("consent") && (
                <p id="nl-consent-error" className="text-[0.8rem] font-display text-brass-ink">
                  {fieldError("consent")}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button type="submit" disabled={status === "submitting"} className="btn-primary">
                {status === "submitting" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
