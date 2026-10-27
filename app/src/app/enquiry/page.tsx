"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { getPackageBySlug } from "@/data/catalogue";
import PageShell from "@/components/PageShell";
import Container from "@/components/Container";

interface EnquiryFormData {
  enquiryType: "package" | "custom";
  packageId: string | null;
  packageTitle: string | null;
  fullName: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone";
  travelDates: string;
  travellers: string;
  message: string;
}

const EMPTY: EnquiryFormData = {
  enquiryType: "custom",
  packageId: null,
  packageTitle: null,
  fullName: "",
  email: "",
  phone: "",
  preferredContact: "email",
  travelDates: "",
  travellers: "",
  message: "",
};

export default function EnquiryPage() {
  const [data, setData] = useState<EnquiryFormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [didInit] = useState(false);
  const packageId =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("package") : null;
  const preselected = packageId ? getPackageBySlug(packageId) : null;

  const initialised = useCallback(() => {
    if (preselected && !data.packageId) {
      setData((d) => ({
        ...d,
        enquiryType: "package",
        packageId: preselected.id,
        packageTitle: preselected.title,
      }));
    }
  }, [data.packageId, preselected]);
  if (!didInit && typeof window !== "undefined") initialised();

  const setField = (field: keyof EnquiryFormData, value: string) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!data.fullName.trim()) next.fullName = "Please enter your full name.";
    if (!data.email.trim()) next.email = "Please enter an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) next.email = "Please enter a valid email address.";
    if (!data.phone.trim()) next.phone = "Please enter a phone number.";
    if (!data.travelDates.trim()) next.travelDates = "Please let us know your intended travel dates.";
    if (!data.travellers.trim()) next.travellers = "Please let us know the number of travellers.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("submitting");
    setStatusMessage("");

    // --- INTEGRATION BOUNDARY ---
    // No backend is configured in this repository. Submissions are not sent anywhere.
    // Replace this block with a real endpoint (server action / API route) before launch.
    // Required environment variables (example): ENQUIRY_API_URL, ENQUIRY_API_KEY (never in client bundle).
    const { promise } = Promise.withResolvers<void>();
    setTimeout(() => {
      setStatus("success");
      setStatusMessage(
        "Thank you — your enquiry has been received. We will reply to confirm your journey. (This is a development placeholder; no message was actually sent.)"
      );
    }, 1200);
    await promise;
    // --- END INTEGRATION BOUNDARY ---
  };

  return (
    <PageShell>
      <Container>
        {status === "success" ? (
          <section className="px-4 py-16 md:px-8 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-4 uppercase">
                Enquiry received
              </h2>
              <p className="text-lg font-display text-charcoal-soft leading-relaxed">
                {statusMessage}
              </p>
              {data.packageTitle && (
                <p className="mt-6 text-sm font-display text-charcoal-soft">
                  Journey: <strong className="text-charcoal">{data.packageTitle}</strong>
                </p>
              )}
              <Link
                href="/explore"
                className="mt-8 btn-tertiary"
              >
                Browse more journeys <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        ) : (
          <section className="px-4 py-16 md:px-8 lg:px-12">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-serif font-bold text-charcoal mb-6 uppercase">
                {data.enquiryType === "package"
                  ? "Enquire about this journey"
                  : "Plan a tailor-made trip"}
              </h2>
              {data.enquiryType === "package" && data.packageTitle && (
                <div className="mb-10 p-6 rounded-image border border-wild-border-light bg-wild-dark text-wild-white">
                  <p className="text-sm font-display text-white/80">
                    Journey: <strong className="text-wild-orange">{data.packageTitle}</strong>
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <fieldset
                  disabled={status === "submitting"}
                  className="mb-8 border-b border-wild-border-light pb-6"
                >
                  <legend className="text-sm font-display font-semibold uppercase tracking-wider text-wild-sand mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-wild-accent text-[12px] font-bold text-wild-accent">
                      1
                    </span>
                    Your details
                  </legend>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-display font-medium text-charcoal">
                        Full name <span className="text-wild-orange">*</span>
                      </label>
                      <input
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => setField("fullName", e.target.value)}
                        className={`w-full rounded-button border px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                          errors.fullName ? "border-wild-orange" : "border-wild-border-light"
                        }`}
                        aria-invalid={!!errors.fullName}
                        aria-describedby={errors.fullName ? "fullName-error" : undefined}
                      />
                      {errors.fullName && (
                        <p id="fullName-error" className="text-[0.8rem] font-display text-wild-orange mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-display font-medium text-charcoal">
                        Email <span className="text-wild-orange">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={`w-full rounded-button border px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                          errors.email ? "border-wild-orange" : "border-wild-border-light"
                        }`}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? "email-error" : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-[0.8rem] font-display text-wild-orange mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-display font-medium text-charcoal">
                      Phone <span className="text-wild-orange">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      className={`w-full rounded-button border px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                        errors.phone ? "border-wild-orange" : "border-wild-border-light"
                      }`}
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-[0.8rem] font-display text-wild-orange mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-display font-medium text-charcoal">
                      Preferred contact method
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className="flex items-center gap-2 rounded-button border border-wild-border-light px-3 py-2 cursor-pointer hover:bg-wild-dark/5 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-wild-orange"
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={data.preferredContact === "email"}
                          onChange={() => setField("preferredContact", "email")}
                          className="text-charcoal"
                        />
                        Email
                      </label>
                      <label
                        className="flex items-center gap-2 rounded-button border border-wild-border-light px-3 py-2 cursor-pointer hover:bg-wild-dark/5 transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-wild-orange"
                      >
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={data.preferredContact === "phone"}
                          onChange={() => setField("preferredContact", "phone")}
                          className="text-charcoal"
                        />
                        Phone
                      </label>
                    </div>
                  </div>
                </fieldset>

                <fieldset
                  disabled={status === "submitting"}
                  className="mb-8 border-b border-wild-border-light pb-6"
                >
                  <legend className="text-sm font-display font-semibold uppercase tracking-wider text-wild-sand mb-4 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-wild-accent text-[12px] font-bold text-wild-accent">
                      2
                    </span>
                    Your trip
                  </legend>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-display font-medium text-charcoal">
                        Intended travel dates <span className="text-wild-orange">*</span>
                      </label>
                      <input
                        id="travelDates"
                        value={data.travelDates}
                        onChange={(e) => setField("travelDates", e.target.value)}
                        placeholder="e.g. October 2026, flexible"
                        className={`w-full rounded-button border px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                          errors.travelDates ? "border-wild-orange" : "border-wild-border-light"
                        }`}
                        aria-invalid={!!errors.travelDates}
                        aria-describedby={errors.travelDates ? "travelDates-error" : undefined}
                      />
                      {errors.travelDates && (
                        <p id="travelDates-error" className="text-[0.8rem] font-display text-wild-orange mt-1">
                          {errors.travelDates}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-display font-medium text-charcoal">
                        Number of travellers <span className="text-wild-orange">*</span>
                      </label>
                      <input
                        id="travellers"
                        type="number"
                        min="1"
                        value={data.travellers}
                        onChange={(e) => setField("travellers", e.target.value)}
                        placeholder="1"
                        className={`w-full rounded-button border px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange ${
                          errors.travellers ? "border-wild-orange" : "border-wild-border-light"
                        }`}
                        aria-invalid={!!errors.travellers}
                        aria-describedby={errors.travellers ? "travellers-error" : undefined}
                      />
                      {errors.travellers && (
                        <p id="travellers-error" className="text-[0.8rem] font-display text-wild-orange mt-1">
                          {errors.travellers}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8 space-y-2">
                    <label className="block text-sm font-display font-medium text-charcoal">
                      Your preferences or questions
                    </label>
                    <textarea
                      id="message"
                      value={data.message}
                      onChange={(e) => setField("message", e.target.value)}
                      rows={4}
                      className="w-full rounded-button border border-wild-border-light px-3 py-2 text-sm font-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange"
                      placeholder="Any dates, regions or interests you have in mind…"
                    />
                  </div>

                  <div className="mt-8 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={data.enquiryType === "package"}
                        onChange={() =>
                          setData((d) => ({
                            ...d,
                            enquiryType: d.enquiryType === "package" ? "custom" : "package",
                          }))
                        }
                        className="text-charcoal"
                      />
                      {data.enquiryType === "package"
                        ? "I want a tailor-made itinerary instead"
                        : "I am enquiring about a listed journey"}
                    </label>
                  </div>
                </fieldset>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="flex sm:inline-flex items-center justify-center gap-2 btn-primary"
                  >
                    {status === "submitting" ? "Sending…" : "Send enquiry"}
                  </button>
                  <button
                    type="button"
                    disabled={status === "submitting"}
                    onClick={() => {
                      setData(EMPTY);
                      setErrors({});
                      setStatus("idle");
                      setStatusMessage("");
                    }}
                    className="flex sm:inline-flex items-center justify-center gap-2 rounded-button border border-wild-border-light px-6 py-3 text-sm font-display font-medium text-charcoal bg-transparent hover:bg-wild-dark/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wild-orange focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Clear
                  </button>
                </div>
                {status === "error" && (
                  <div className="mt-6 p-6 rounded-image border border-wild-orange bg-wild-orange/10 text-wild-orange">
                    {statusMessage}
                  </div>
                )}
              </form>
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  );
}
