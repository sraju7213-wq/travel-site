"use client";

import Link from "next/link";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { BRAND } from "@/data/brandConfig";
import { useBodyOverflowLock } from "@/hooks/useBodyOverflowLock";
import { validateEnquiry, type EnquiryPayload } from "@/lib/enquiryValidation";
import ListboxSelect, { type ListboxOption } from "@/components/ui/ListboxSelect";

export interface EnquiryPackageInfo {
  slug: string;
  title: string;
  code: string;
  duration: string;
}

interface EnquiryContextValue {
  /** Opens the concierge enquiry dialog, optionally pre-filling the message field. */
  openEnquiry: (options?: { message?: string }) => void;
}

const EnquiryContext = createContext<EnquiryContextValue | null>(null);

export function useEnquiryModal(): EnquiryContextValue {
  const ctx = useContext(EnquiryContext);
  if (!ctx) {
    throw new Error("useEnquiryModal must be used within an EnquiryModalProvider");
  }
  return ctx;
}

const TRAVELLER_OPTIONS: ListboxOption[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "12", "15", "20"].map(
  (n) => ({ value: n, label: `${n} traveller${n === "1" ? "" : "s"}` })
);

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  datesFlexible: boolean;
  travellers: string;
  message: string;
  consent: boolean;
};

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  phone: "",
  travelDate: "",
  datesFlexible: false,
  travellers: "2",
  message: "",
  consent: false,
};

type Status = "idle" | "submitting" | "sent" | "failed";

function buildSubmissionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `sub-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function EnquiryModalProvider({
  children,
  packageInfo,
}: {
  children: React.ReactNode;
  packageInfo: EnquiryPackageInfo;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [reference, setReference] = useState("");

  const triggerRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string>("");

  useBodyOverflowLock(open);

  const openEnquiry = useCallback((options?: { message?: string }) => {
    if (typeof document !== "undefined") {
      triggerRef.current = document.activeElement as HTMLElement | null;
    }
    if (options?.message) {
      setForm((f) => ({ ...f, message: options.message ?? "" }));
    }
    setErrors({});
    setStatus("idle");
    setStatusMessage("");
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => {
    setOpen(false);
    const trigger = triggerRef.current;
    if (trigger && typeof trigger.focus === "function") {
      trigger.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => firstFieldRef.current?.focus(), 30);
    return () => window.clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // The listbox popup is portalled outside the dialog and swallows its
        // own Escape, so never close the whole dialog from inside it.
        const target = event.target as Element | null;
        if (target?.closest?.('[role="listbox"]')) return;
        event.preventDefault();
        closeEnquiry();
        return;
      }
      if (event.key !== "Tab") return;

      // Keep focus inside the dialog while it is open.
      const dialog = dialogRef.current;
      if (!dialog) return;
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeEnquiry]);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  const setField = useCallback((field: keyof FormState, value: string | boolean) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  }, []);

  const buildPayload = useCallback(
    (): EnquiryPayload => ({
      enquiryType: "package",
      packageSlug: packageInfo.slug,
      packageTitle: packageInfo.title,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      preferredContact: "email",
      travelDate: form.travelDate,
      datesFlexible: form.datesFlexible,
      travellers: form.travellers,
      message: form.message,
      consent: form.consent,
      website: "",
    }),
    [form, packageInfo.slug, packageInfo.title]
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatusMessage("");
    setErrors({});

    const validationErrors = validateEnquiry(buildPayload());
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("failed");
      setStatusMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setStatus("submitting");
    if (!submissionIdRef.current) submissionIdRef.current = buildSubmissionId();

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...buildPayload(), submissionId: submissionIdRef.current }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && result.ok) {
        setReference(submissionIdRef.current.slice(0, 8).toUpperCase());
        setStatus("sent");
        setStatusMessage("Your enquiry has been received.");
        return;
      }

      if (result.code === "validation_failed" && result.errors) {
        setErrors(result.errors);
        setStatus("failed");
        setStatusMessage("Please correct the highlighted fields and try again.");
        return;
      }

      if (response.status === 503) {
        setStatus("failed");
        setStatusMessage(
          `This form is not connected to a receiving system yet, so nothing was transmitted or stored. Please contact our concierge desk (${BRAND.name}) or your travel agent, quoting ${packageInfo.title} (${packageInfo.code}).`
        );
        return;
      }

      if (response.status === 409) {
        setStatus("failed");
        setStatusMessage(
          `This enquiry was already submitted. Please wait for our reply, or contact our concierge desk (${BRAND.name}).`
        );
        return;
      }

      setStatus("failed");
      setStatusMessage(
        result.message ??
          `The enquiry could not be delivered. Please try again, or contact our concierge desk (${BRAND.name}).`
      );
    } catch {
      setStatus("failed");
      setStatusMessage(
        `The enquiry could not be delivered because of a network problem. Please try again, or contact our concierge desk (${BRAND.name}).`
      );
    }
  };

  const fieldError = (name: keyof FormState) => errors[name];

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-[#0C1617] px-3 py-2.5 font-display text-sm text-white placeholder:text-white/25 transition-colors focus:border-brass focus:outline-none focus:ring-1 focus:ring-brass";

  return (
    <EnquiryContext.Provider value={{ openEnquiry }}>
      {children}

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm animate-fade-in"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEnquiry();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="enquiry-modal-title"
            className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#132325] p-6 shadow-2xl"
          >
            <button
              type="button"
              onClick={closeEnquiry}
              aria-label="Close enquiry form"
              className="absolute right-4 top-4 rounded-none border border-white/10 p-1 text-white/50 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
              Direct Concierge Booking
            </p>
            <h2 id="enquiry-modal-title" className="mt-1 font-serif text-xl font-bold text-white">
              Enquire About: {packageInfo.title}
            </h2>
            <p className="mt-1 font-display text-xs text-white/50">
              Brochure Code: {packageInfo.code} • {packageInfo.duration}
            </p>

            {status === "sent" ? (
              <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-6 text-center">
                <h3
                  ref={successRef}
                  tabIndex={-1}
                  className="font-serif text-lg font-bold text-emerald-200 outline-none"
                >
                  Thank you — enquiry received
                </h3>
                <p className="mt-2 font-display text-sm leading-relaxed text-white/70">
                  A {BRAND.name} travel designer will contact you to confirm dates,
                  availability and tailor-made details.
                </p>
                {reference && (
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-emerald-300/80">
                    Reference: {reference}
                  </p>
                )}
                <button
                  type="button"
                  onClick={closeEnquiry}
                  className="mt-5 w-full rounded-lg bg-brass px-4 py-2.5 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#0C1617] transition hover:bg-brass-soft"
                >
                  Close
                </button>
              </div>
            ) : (
              <form className="mt-6 space-y-3.5" onSubmit={handleSubmit} noValidate>
                {statusMessage && (
                  <p
                    role="alert"
                    className={`rounded-lg border px-3 py-2.5 font-display text-xs leading-relaxed ${
                      status === "failed"
                        ? "border-rose-500/30 bg-rose-950/30 text-rose-200"
                        : "border-white/10 bg-white/5 text-white/70"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}

                <div>
                  <label htmlFor="enq-name" className="mb-1.5 block font-display text-xs text-white/75">
                    Your Full Name <span className="text-brass">*</span>
                  </label>
                  <input
                    ref={firstFieldRef}
                    id="enq-name"
                    type="text"
                    value={form.fullName}
                    onChange={(e) => setField("fullName", e.target.value)}
                    aria-invalid={Boolean(fieldError("fullName"))}
                    aria-describedby={fieldError("fullName") ? "enq-name-error" : undefined}
                    className={inputClass}
                    placeholder="e.g. Alexander Wright"
                    required
                  />
                  {fieldError("fullName") && (
                    <p id="enq-name-error" className="mt-1 font-display text-[11px] text-rose-300">
                      {fieldError("fullName")}
                    </p>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enq-email" className="mb-1.5 block font-display text-xs text-white/75">
                      Email Address <span className="text-brass">*</span>
                    </label>
                    <input
                      id="enq-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                      aria-invalid={Boolean(fieldError("email"))}
                      aria-describedby={fieldError("email") ? "enq-email-error" : undefined}
                      className={inputClass}
                      placeholder="name@domain.com"
                      required
                    />
                    {fieldError("email") && (
                      <p id="enq-email-error" className="mt-1 font-display text-[11px] text-rose-300">
                        {fieldError("email")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="enq-phone" className="mb-1.5 block font-display text-xs text-white/75">
                      Phone / WhatsApp <span className="text-brass">*</span>
                    </label>
                    <input
                      id="enq-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value)}
                      aria-invalid={Boolean(fieldError("phone"))}
                      aria-describedby={fieldError("phone") ? "enq-phone-error" : undefined}
                      className={inputClass}
                      placeholder="+44 20 7000 0000"
                      required
                    />
                    {fieldError("phone") && (
                      <p id="enq-phone-error" className="mt-1 font-display text-[11px] text-rose-300">
                        {fieldError("phone")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="enq-date" className="mb-1.5 block font-display text-xs text-white/75">
                      Estimated Travel Date
                    </label>
                    <input
                      id="enq-date"
                      type="date"
                      value={form.travelDate}
                      onChange={(e) => setField("travelDate", e.target.value)}
                      aria-invalid={Boolean(fieldError("travelDate"))}
                      aria-describedby={fieldError("travelDate") ? "enq-date-error" : undefined}
                      className={inputClass}
                    />
                    {fieldError("travelDate") && (
                      <p id="enq-date-error" className="mt-1 font-display text-[11px] text-rose-300">
                        {fieldError("travelDate")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="enq-travellers" className="mb-1.5 block font-display text-xs text-white/75">
                      Party Size
                    </label>
                    <ListboxSelect
                      id="enq-travellers"
                      value={form.travellers}
                      options={TRAVELLER_OPTIONS}
                      onChange={(next) => setField("travellers", next)}
                      variant="compact"
                      listLabel="Party size"
                    />
                    {fieldError("travellers") && (
                      <p className="mt-1 font-display text-[11px] text-rose-300">{fieldError("travellers")}</p>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2 font-display text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={form.datesFlexible}
                    onChange={(e) => setField("datesFlexible", e.target.checked)}
                    className="h-4 w-4 rounded border-white/20 bg-[#0C1617] text-brass focus:ring-brass"
                  />
                  My travel dates are flexible
                </label>

                <div>
                  <label htmlFor="enq-message" className="mb-1.5 block font-display text-xs text-white/75">
                    Specific Requests or Tailoring Details
                  </label>
                  <textarea
                    id="enq-message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setField("message", e.target.value)}
                    className={inputClass}
                    placeholder="Hotel preferences, dietary needs, extensions..."
                  />
                </div>

                <label className="flex items-start gap-2 font-display text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => setField("consent", e.target.checked)}
                    aria-invalid={Boolean(fieldError("consent"))}
                    aria-describedby={fieldError("consent") ? "enq-consent-error" : undefined}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-[#0C1617] text-brass focus:ring-brass"
                  />
                  <span>
                    I agree that {BRAND.name} may contact me about this enquiry. <span className="text-brass">*</span>
                  </span>
                </label>
                {fieldError("consent") && (
                  <p id="enq-consent-error" className="font-display text-[11px] text-rose-300">
                    {fieldError("consent")}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full rounded-none bg-brass px-4 py-3 font-display text-xs font-bold uppercase tracking-[0.18em] text-[#0C1617] transition-colors hover:bg-brass-soft disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending…" : "Submit Expedition Enquiry"}
                </button>

                <p className="text-center font-display text-[11px] text-white/60">
                  Prefer email?{" "}
                  <Link href="/contact" className="text-brass hover:underline">
                    Contact the concierge desk
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </EnquiryContext.Provider>
  );
}
