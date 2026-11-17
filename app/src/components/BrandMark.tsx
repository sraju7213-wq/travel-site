import Image from "next/image";
import Link from "next/link";
import { BRAND } from "@/data/brandConfig";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

/**
 * The brand lockup is a single white-on-transparent artwork (monuments, flight
 * path and the "INDIA NEPAL / TRAVEL CENTER" wordmark), so the wordmark is
 * carried by the image itself rather than duplicated as HTML text.
 *
 * The source asset is 3:1 — the wrapper pins that ratio so the artwork never
 * letterboxes or crops, and reserves its own space to avoid layout shift.
 */
export default function BrandMark({ className = "", compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={`group inline-flex min-h-[44px] items-center transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-none ${className}`}
      aria-label={`${BRAND.name} — Home`}
    >
      <span
        className={`relative block aspect-[3/1] ${compact ? "h-7" : "h-9 md:h-11"} transition-transform duration-300 group-hover:scale-105`}
      >
        <Image
          src="/logo.png"
          alt={BRAND.name}
          fill
          priority
          sizes="(min-width: 768px) 132px, 108px"
          className="object-contain object-center"
        />
      </span>
    </Link>
  );
}
