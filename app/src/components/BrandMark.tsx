import Link from "next/link";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

/** The organisation's "IN" monogram and wordmark, styled for the fixed black header. */
export default function BrandMark({ className = "", compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={`flex items-center gap-3 ${className}`}
      aria-label="India Nepal Travel Organisation — home"
    >
      <span
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-wild-white/40 font-serif text-sm font-bold text-wild-white md:h-10 md:w-10 md:text-base"
      >
        IN
      </span>
      {!compact && (
        <span className="hidden flex-col leading-none sm:flex">
          <span className="font-serif text-base font-bold tracking-tight text-wild-white md:text-lg">
            India Nepal
          </span>
          <span className="mt-1 text-[0.55rem] font-display uppercase tracking-[0.3em] text-white/70 md:text-[0.6rem]">
            Travel Organisation
          </span>
        </span>
      )}
    </Link>
  );
}
