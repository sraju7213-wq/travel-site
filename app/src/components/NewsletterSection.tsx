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
      <section className="bg-[#0C1617] py-16 md:py-24 border-t border-white/5 text-white">
        <div className="mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="rounded-[1.25rem] bg-[#132325] border border-white/10 p-6 md:p-12 shadow-2xl">
            <p className="subtitle-large mb-4 text-brass">Travel notes</p>
            <h2 ref={successHeadingRef} tabIndex={-1} className="text-h3 mb-4 text-white">
              Subscribed
            </h2>
            <p className="font-display leading-relaxed text-white/75">{message}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0C1617] py-16 md:py-24 border-t border-white/5 text-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid gap-10 rounded-[1.25rem] bg-[#132325] border border-white/10 p-6 shadow-2xl md:p-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <p className="subtitle-large mb-5 text-brass">Travel notes</p>
            <h2 className="text-h3 mb-4 text-white">Subscribe for updates</h2>
            <p className="font-display leading-relaxed text-white/75">
              Receive new itineraries and travel notes from our specialists.
            </p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            {status === "failed" && message && (
              <div
                ref={errorSummaryRef}
                role="alert"
                tabIndex={-1}
                className="mb-6 rounded-image border border-brass/50 bg-brass/10 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <p className="font-display text-sm text-brass-soft">{message}</p>
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
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-white bg-black/40 backdrop-blur-sm transition-colors placeholder:text-white/40 focus:border-brass focus:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("firstName") ? "border-brass bg-brass/10" : "border-white/15"
                  }`}
                />
                {fieldError("firstName") && (
                  <p id="nl-first-error" className="mt-1 text-[0.8rem] font-display text-brass-soft">
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
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-white bg-black/40 backdrop-blur-sm transition-colors placeholder:text-white/40 focus:border-brass focus:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("surname") ? "border-brass bg-brass/10" : "border-white/15"
                  }`}
                />
                {fieldError("surname") && (
                  <p id="nl-surname-error" className="mt-1 text-[0.8rem] font-display text-brass-soft">
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
                  className={`w-full rounded-button border px-4 py-3 font-display text-sm text-white bg-black/40 backdrop-blur-sm transition-colors placeholder:text-white/40 focus:border-brass focus:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                    fieldError("email") ? "border-brass bg-brass/10" : "border-white/15"
                  }`}
                />
                {fieldError("email") && (
                  <p id="nl-email-error" className="mt-1 text-[0.8rem] font-display text-brass-soft">
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
                  className="w-full rounded-button border border-white/15 bg-[#101F21] px-4 py-3 font-display text-sm text-white transition-colors focus:border-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass cursor-pointer"
                >
                  <option value="" className="bg-[#101F21] text-white">Country of residence</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-[#101F21] text-white">
                      {c}
                    </option>
                  ))}
                </select>
            </div>
            </div>

            <div className="mt-4 space-y-2">
              <label className="flex cursor-pointer items-start gap-2 text-sm font-display text-white/75">
                <input
                  type="checkbox"
                  name="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  aria-invalid={!!fieldError("consent")}
                  aria-describedby={fieldError("consent") ? "nl-consent-error" : undefined}
                  className="mt-0.5 accent-brass"
                />
                <span>
                  I would like to receive travel notes from India Nepal Travel Organisation by email.{" "}
                  <span className="text-brass">*</span>
                </span>
              </label>
              {fieldError("consent") && (
                <p id="nl-consent-error" className="text-[0.8rem] font-display text-brass-soft">
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
