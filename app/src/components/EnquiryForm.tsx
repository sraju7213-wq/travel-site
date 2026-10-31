"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  todayIso,
  validateEnquiry,
  type EnquiryPayload,
} from "@/lib/enquiryValidation";

export interface PackageOption {
  slug: string;
  title: string;
  code: string;
  duration: string;
  category: string;
}

const CUSTOM = "__custom__";

type Status = "idle" | "submitting" | "sent" | "failed";

interface EnquiryFormProps {
  packages: PackageOption[];
  initialPackageSlug: string | null;
  configured: boolean;
}

function buildSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function EnquiryForm({
  packages,
  initialPackageSlug,
  configured,
}: EnquiryFormProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, PackageOption[]>();
    for (const pkg of packages) {
      const list = map.get(pkg.category) ?? [];
      list.push(pkg);
      map.set(pkg.category, list);
    }
    return [...map.entries()];
  }, [packages]);

  const initial = initialPackageSlug
    ? packages.find((p) => p.slug === initialPackageSlug) ?? null
    : null;

  const [selected, setSelected] = useState<string>(initial?.slug ?? CUSTOM);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredContact: "email" as "email" | "phone",
    travelDate: "",
    datesFlexible: false,
    travellers: "2",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const submissionIdRef = useRef<string>("");
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstInvalidRef = useRef<string | null>(null);

  const chosen = selected === CUSTOM ? null : packages.find((p) => p.slug === selected) ?? null;

  useEffect(() => {
    if (status !== "failed") return;
    const target = firstInvalidRef.current
      ? document.getElementById(firstInvalidRef.current)
      : null;
    if (target instanceof HTMLElement) {
      target.focus();
    } else {
      errorSummaryRef.current?.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === "sent") successHeadingRef.current?.focus();
  }, [status]);

  const setField = (field: string, value: string | boolean) => {
    setData((d) => ({ ...d, [field]: value }));
    if (errors[field]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  };

  const buildPayload = (): EnquiryPayload => ({
    enquiryType: chosen ? "package" : "custom",
    packageSlug: chosen?.slug ?? null,
    packageTitle: chosen?.title ?? null,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    preferredContact: data.preferredContact,
    travelDate: data.travelDate,
    datesFlexible: data.datesFlexible,
    travellers: data.travellers,
    message: data.message,
    consent: data.consent,
    website: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("");
    setServerErrors({});
    firstInvalidRef.current = null;

    const validationErrors = validateEnquiry(buildPayload());
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("failed");
      setStatusMessage("Please correct the highlighted fields and try again.");
      firstInvalidRef.current = Object.keys(validationErrors)[0];
      return;
    }

    setErrors({});
    setStatus("submitting");
    if (!submissionIdRef.current) submissionIdRef.current = buildSubmissionId();

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...buildPayload(),
          submissionId: submissionIdRef.current,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && result.ok) {
        setStatus("sent");
        setStatusMessage("Enquiry sent.");
        return;
      }

      if (result.code === "validation_failed" && result.errors) {
        setServerErrors(result.errors);
        setErrors(result.errors);
        setStatus("failed");
        setStatusMessage("Please correct the highlighted fields and try again.");
        firstInvalidRef.current = Object.keys(result.errors)[0] ?? null;
        return;
      }

      if (response.status === 503) {
        setStatus("failed");
        setStatusMessage(
          chosen
            ? `Not sent. This form is not connected to a receiving system yet, so nothing was transmitted or stored. Please contact India Nepal Travel Centre or your travel agent, quoting ${chosen.title} (${chosen.code}).`
            : "Not sent. This form is not connected to a receiving system yet, so nothing was transmitted or stored. Please contact India Nepal Travel Centre or your travel agent.",
        );
        return;
      }

      if (response.status === 409) {
        setStatus("failed");
        setStatusMessage(
          "This enquiry was already submitted. Please wait for our reply, or contact India Nepal Travel Centre or your travel agent.",
        );
        return;
      }

      setStatus("failed");
      setStatusMessage(
        result.message ??
          "The enquiry could not be delivered. Please try again, or contact India Nepal Travel Centre or your travel agent.",
      );
    } catch {
      setStatus("failed");
      setStatusMessage(
        "The enquiry could not be delivered because of a network problem. Please try again, or contact India Nepal Travel Centre or your travel agent.",
      );
    }
  };

  const fieldError = (name: string) => errors[name] ?? serverErrors[name];

  if (status === "sent") {
    return (
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center rounded-[1.5rem] bg-white border border-border/80 p-10 md:p-14 shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-forest text-brass shadow-lg">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="stroke-current stroke-[2.5]">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="subtitle-large mb-3 text-brass">Enquiry Received</p>
          <h1
            ref={successHeadingRef}
            tabIndex={-1}
            className="text-h2 font-serif text-charcoal focus-visible:outline-none mb-4"
          >
            Thank You, {data.fullName.split(" ")[0] || "Traveller"}
          </h1>
          <p className="font-display text-base text-charcoal-soft leading-relaxed max-w-lg mx-auto">
            Your enquiry has been recorded. Our travel designers will review your dates and party requirements and contact you via your preferred channel ({data.preferredContact}).
          </p>
          {chosen && (
            <div className="mt-8 rounded-[1rem] border border-border/80 bg-ivory-soft p-5 text-left flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-image overflow-hidden flex-shrink-0 bg-charcoal">
                <Image
                  src={`/images/packages/${chosen.slug}.jpg`}
                  alt={chosen.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-xs font-display uppercase tracking-wider text-brass font-semibold">
                  {chosen.category}
                </p>
                <p className="font-serif text-base font-bold text-charcoal">{chosen.title}</p>
                <p className="text-xs font-display text-charcoal-soft">{chosen.duration} · Code {chosen.code}</p>
              </div>
            </div>
          )}
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href="/explore" className="btn-primary">
              Explore more journeys &rarr;
            </Link>
            <Link href="/" className="btn-tertiary">
              Return to home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-20" aria-label="Trip enquiry section">
      {/* 1. Header Banner */}
      <div className="mb-12">
        <p className="subtitle-large mb-3 text-brass">Tailor-Made Concierge</p>
        <h1 className="text-h2 font-serif text-charcoal mb-4">
          {chosen ? "Enquire About This Journey" : "Plan Your Tailor-Made Trip"}
        </h1>
        <p className="font-display text-base md:text-lg text-charcoal-soft leading-relaxed max-w-3xl">
          Tell us your preferred dates, party size and travel pace. Our subcontinent specialists will shape an itinerary around you, drawing on nearly a century of exploration across India and Nepal.
        </p>
      </div>

      {/* 2. Modern 2-Column Luxury Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column — Summary & Specialist Trust Cards */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
          {/* Dynamic Journey Card */}
          <div className="overflow-hidden rounded-[1.25rem] border border-border/80 bg-white shadow-xl transition-all duration-300">
            <div className="relative aspect-[16/10] overflow-hidden bg-charcoal">
              <Image
                src={chosen ? `/images/packages/${chosen.slug}.jpg` : "/images/hero/hero-pangong.jpg"}
                alt={chosen ? chosen.title : "Himalayan landscape"}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute inset-x-5 bottom-4 text-white">
                <span className="text-[0.65rem] font-display font-semibold uppercase tracking-[0.25em] text-brass block mb-1">
                  {chosen ? chosen.category : "Bespoke Expedition"}
                </span>
                <h3 className="font-serif text-xl font-bold leading-tight">
                  {chosen ? chosen.title : "Tailor-Made India & Nepal"}
                </h3>
              </div>
            </div>

            <div className="p-6">
              {chosen ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-display">
                    <span className="rounded-button border border-border bg-ivory-soft px-3 py-1 font-semibold text-charcoal">
                      Duration: {chosen.duration}
                    </span>
                    <span className="rounded-button border border-border bg-ivory-soft px-3 py-1 font-semibold text-charcoal">
                      Code: {chosen.code}
                    </span>
                  </div>
                  <p className="text-xs font-display text-charcoal-soft leading-relaxed">
                    Personalized departures and tailored accommodation arranged around your schedule.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs font-display text-charcoal-soft leading-relaxed">
                  <p>
                    Combine Himalayan trekking, Kashmir houseboats, Rajasthan heritage forts, or Kerala backwaters into a seamless private itinerary.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Specialist Trust Card */}
          <div className="rounded-[1.25rem] border border-white/10 bg-forest p-7 text-white shadow-xl">
            <p className="text-xs font-display uppercase tracking-[0.25em] text-brass font-semibold mb-3">
              Why Travel With KS World Adventure
            </p>
            <ul className="space-y-3.5 text-xs font-display text-white/80 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass/20 text-brass mt-0.5">
                  ✓
                </span>
                <span><strong>Guaranteed Departures:</strong> Small groups up to 15 travellers, or bespoke solo arrangements.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass/20 text-brass mt-0.5">
                  ✓
                </span>
                <span><strong>Specialist Guidance:</strong> Experienced English-speaking guides, support crews, and local trackers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brass/20 text-brass mt-0.5">
                  ✓
                </span>
                <span><strong>Direct Concierge:</strong> All quotes, bookings, and dates confirmed directly by our travel planners.</span>
              </li>
            </ul>
          </div>

          {/* Quiet Operational Notice */}
          <div className="rounded-[1rem] border border-border/80 bg-ivory-soft p-5 text-[0.75rem] font-display text-charcoal-soft leading-relaxed">
            <strong className="text-charcoal block mb-1">Direct Brochure Inquiry:</strong>
            {!configured ? (
              <span>
                All dates, pricing, and custom itineraries are confirmed by direct specialist consultation. Quotes are shaped individually without obligation.
              </span>
            ) : (
              <span>
                Prices, seasonal departures, and room classifications are confirmed individually by consultation. No payment is required to enquire.
              </span>
            )}
          </div>
        </div>

        {/* Right Column — Modern Form Card */}
        <div className="lg:col-span-7">
          <div className="rounded-[1.5rem] border border-border/80 bg-white p-7 sm:p-10 shadow-2xl">
            {status === "failed" && statusMessage && (
              <div
                ref={errorSummaryRef}
                role="alert"
                tabIndex={-1}
                className="mb-8 rounded-image border border-brass bg-brass/10 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              >
                <div className="flex items-start gap-3">
                  <span className="text-brass text-lg leading-none mt-0.5">⚠️</span>
                  <p className="font-display text-sm leading-relaxed text-charcoal font-medium">
                    {statusMessage}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-8">
              {/* Step 1: Select Journey */}
              <div className="border-b border-border/80 pb-8">
                <label
                  htmlFor="journey"
                  className="block text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal mb-3"
                >
                  Selected Journey or Itinerary
                </label>
                <div className="relative">
                  <select
                    id="journey"
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="w-full appearance-none rounded-button border border-border bg-ivory/30 px-4 py-3.5 text-sm font-display text-charcoal font-medium transition-colors hover:border-brass/60 focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                  >
                    <option value={CUSTOM}>Tailor-made trip (no specific journey)</option>
                    {grouped.map(([category, items]) => (
                      <optgroup key={category} label={category}>
                        {items.map((pkg) => (
                          <option key={pkg.slug} value={pkg.slug}>
                            {pkg.title} ({pkg.code}) — {pkg.duration}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-charcoal-soft">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="stroke-current stroke-2">
                      <path d="M1 1.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Step 2: Traveller Details */}
              <fieldset disabled={status === "submitting"} className="border-b border-border/80 pb-8">
                <legend className="mb-5 flex items-center gap-2.5 text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass text-white text-[11px] font-bold shadow-sm">
                    1
                  </span>
                  Your Details
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label htmlFor="fullName" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                      Full Name <span className="text-brass">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      autoComplete="name"
                      placeholder="e.g. Eleanor Vance"
                      required
                      value={data.fullName}
                      onChange={(e) => setField("fullName", e.target.value)}
                      aria-invalid={!!fieldError("fullName")}
                      aria-describedby={fieldError("fullName") ? "fullName-error" : undefined}
                      className={`w-full rounded-button border px-4 py-3 text-sm font-display transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                        fieldError("fullName") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                      }`}
                    />
                    {fieldError("fullName") && (
                      <p id="fullName-error" className="mt-1 text-xs font-display text-brass font-medium">
                        {fieldError("fullName")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                      Email Address <span className="text-brass">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@domain.com"
                      required
                      value={data.email}
                      onChange={(e) => setField("email", e.target.value)}
                      aria-invalid={!!fieldError("email")}
                      aria-describedby={fieldError("email") ? "email-error" : undefined}
                      className={`w-full rounded-button border px-4 py-3 text-sm font-display transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                        fieldError("email") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                      }`}
                    />
                    {fieldError("email") && (
                      <p id="email-error" className="mt-1 text-xs font-display text-brass font-medium">
                        {fieldError("email")}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                      Phone Number <span className="text-brass">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+1 (555) 000-0000"
                      required
                      value={data.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      aria-invalid={!!fieldError("phone")}
                      aria-describedby={fieldError("phone") ? "phone-error" : undefined}
                      className={`w-full rounded-button border px-4 py-3 text-sm font-display transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                        fieldError("phone") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                      }`}
                    />
                    {fieldError("phone") && (
                      <p id="phone-error" className="mt-1 text-xs font-display text-brass font-medium">
                        {fieldError("phone")}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Method Chips */}
                <div className="mt-5">
                  <span className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft mb-2.5">
                    Preferred Contact Channel
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {(["email", "phone"] as const).map((method) => {
                      const isSelected = data.preferredContact === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setField("preferredContact", method)}
                          className={`flex items-center justify-center gap-2 rounded-button border px-4 py-2.5 text-xs font-display uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "border-brass bg-brass/10 text-brass shadow-sm"
                              : "border-border bg-ivory/20 text-charcoal-soft hover:bg-white hover:text-charcoal"
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-brass" : "bg-border"}`} />
                          {method === "email" ? "Email Correspondence" : "Phone Call"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </fieldset>

              {/* Step 3: Trip Timing & Party Size */}
              <fieldset disabled={status === "submitting"} className="border-b border-border/80 pb-8">
                <legend className="mb-5 flex items-center gap-2.5 text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass text-white text-[11px] font-bold shadow-sm">
                    2
                  </span>
                  Dates &amp; Party Size
                </legend>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="travelDate" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                      Target Departure Date <span className="text-brass">*</span>
                    </label>
                    <input
                      id="travelDate"
                      name="travelDate"
                      type="date"
                      min={todayIso()}
                      disabled={data.datesFlexible}
                      required={!data.datesFlexible}
                      value={data.travelDate}
                      onChange={(e) => setField("travelDate", e.target.value)}
                      aria-invalid={!!fieldError("travelDate")}
                      aria-describedby={fieldError("travelDate") ? "travelDate-error" : undefined}
                      className={`w-full rounded-button border px-4 py-3 text-sm font-display transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:opacity-40 ${
                        fieldError("travelDate") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                      }`}
                    />
                    {fieldError("travelDate") && (
                      <p id="travelDate-error" className="mt-1 text-xs font-display text-brass font-medium">
                        {fieldError("travelDate")}
                      </p>
                    )}
                    <label className="flex cursor-pointer items-center gap-2 pt-1.5 text-xs font-display font-medium text-charcoal-soft hover:text-charcoal">
                      <input
                        type="checkbox"
                        name="datesFlexible"
                        checked={data.datesFlexible}
                        onChange={(e) => {
                          setField("datesFlexible", e.target.checked);
                          if (e.target.checked) setField("travelDate", "");
                        }}
                        className="h-4 w-4 rounded accent-brass text-brass"
                      />
                      <span>My departure dates are flexible</span>
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="travellers" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                      Number of Guests <span className="text-brass">*</span>
                    </label>
                    <input
                      id="travellers"
                      name="travellers"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={50}
                      step={1}
                      required
                      value={data.travellers}
                      onChange={(e) => setField("travellers", e.target.value)}
                      aria-invalid={!!fieldError("travellers")}
                      aria-describedby={fieldError("travellers") ? "travellers-error" : undefined}
                      className={`w-full rounded-button border px-4 py-3 text-sm font-display transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                        fieldError("travellers") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                      }`}
                    />
                    {fieldError("travellers") && (
                      <p id="travellers-error" className="mt-1 text-xs font-display text-brass font-medium">
                        {fieldError("travellers")}
                      </p>
                    )}
                    {/* Quick Party Size Buttons */}
                    <div className="flex gap-2 pt-1">
                      {["1", "2", "4", "6", "10+"].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setField("travellers", count.replace("+", ""))}
                          className={`flex-1 rounded-button border py-1 text-xs font-display font-semibold transition-colors ${
                            data.travellers === count.replace("+", "")
                              ? "border-brass bg-brass text-white"
                              : "border-border bg-ivory/30 text-charcoal-soft hover:bg-white"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </fieldset>

              {/* Step 4: Special Wishes */}
              <fieldset disabled={status === "submitting"} className="border-b border-border/80 pb-8">
                <legend className="mb-4 flex items-center gap-2.5 text-xs font-display font-semibold uppercase tracking-[0.2em] text-charcoal">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brass text-white text-[11px] font-bold shadow-sm">
                    3
                  </span>
                  Preferences &amp; Interests
                </legend>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft">
                    Special Interests, Pacing, or Inquiries
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={data.message}
                    onChange={(e) => setField("message", e.target.value)}
                    aria-invalid={!!fieldError("message")}
                    aria-describedby={fieldError("message") ? "message-error" : undefined}
                    className={`w-full rounded-button border p-4 text-sm font-display leading-relaxed transition-colors focus:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass ${
                      fieldError("message") ? "border-brass bg-brass/5" : "border-border bg-ivory/20 hover:border-border/80"
                    }`}
                    placeholder="Tell us any specific requests: dietary preferences, preferred hotel categories, high-altitude trekking fitness, Dal Lake houseboat nights, or flight connections..."
                  />
                  {fieldError("message") && (
                    <p id="message-error" className="mt-1 text-xs font-display text-brass font-medium">
                      {fieldError("message")}
                    </p>
                  )}
                </div>
              </fieldset>

              {/* Honeypot anti-spam */}
              <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value="" readOnly />
              </div>

              {/* Consent checkbox */}
              <div className="space-y-2">
                <label className="flex cursor-pointer items-start gap-3 text-xs font-display text-charcoal-soft leading-relaxed">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={data.consent}
                    onChange={(e) => setField("consent", e.target.checked)}
                    aria-invalid={!!fieldError("consent")}
                    aria-describedby={fieldError("consent") ? "consent-error" : undefined}
                    className="mt-0.5 h-4 w-4 rounded accent-brass text-brass shrink-0"
                  />
                  <span>
                    I agree that KS World Adventure may contact me regarding this enquiry and provide tailored travel arrangements. <span className="text-brass">*</span>
                  </span>
                </label>
                {fieldError("consent") && (
                  <p id="consent-error" className="text-xs font-display text-brass font-medium">
                    {fieldError("consent")}
                  </p>
                )}
              </div>

              {/* Submit & Clear Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary w-full sm:flex-1 py-4 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg cursor-pointer"
                >
                  {status === "submitting" ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Transmitting Inquiry…
                    </span>
                  ) : (
                    <span>Send Enquiry &rarr;</span>
                  )}
                </button>
                <button
                  type="button"
                  disabled={status === "submitting"}
                  onClick={() => {
                    setData({
                      fullName: "",
                      email: "",
                      phone: "",
                      preferredContact: "email",
                      travelDate: "",
                      datesFlexible: false,
                      travellers: "2",
                      message: "",
                      consent: false,
                    });
                    setSelected(initial?.slug ?? CUSTOM);
                    setErrors({});
                    setServerErrors({});
                    setStatus("idle");
                    setStatusMessage("");
                    submissionIdRef.current = "";
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-button border border-border bg-ivory/30 text-xs font-display font-semibold uppercase tracking-wider text-charcoal-soft transition-colors hover:bg-white hover:text-charcoal cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
