"use client";

import { useEnquiryModal } from "./EnquiryModal";

interface EnquireCtaProps {
  label?: string;
  /** Pre-fills the enquiry message field, e.g. "Request the full brochure". */
  message?: string;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  withArrow?: boolean;
}

const VARIANTS: Record<NonNullable<EnquireCtaProps["variant"]>, string> = {
  solid:
    "enquire-fill",
  outline:
    "border border-white/15 bg-transparent text-white/80 hover:border-brass hover:text-brass",
  ghost: "bg-transparent text-brass hover:text-brass-soft",
};

export default function EnquireCta({
  label = "Enquire Now",
  message,
  variant = "solid",
  className = "",
  withArrow = false,
}: EnquireCtaProps) {
  const { openEnquiry } = useEnquiryModal();

  return (
    <button
      type="button"
      onClick={() => openEnquiry(message ? { message } : undefined)}
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-none px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C1617] ${VARIANTS[variant]} ${className}`}
    >
      <span>{label}</span>
      {withArrow && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M17 8l4 4m0 0l-4 4m4-4H3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
