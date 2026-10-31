import Image from "next/image";
import Link from "next/link";

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

export default function BrandMark({ className = "", compact = false }: BrandMarkProps) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-button ${className}`}
      aria-label="KS World Adventure — Home"
    >
      <div className={`relative ${compact ? "h-10 w-16" : "h-12 w-20 md:h-14 md:w-24"} transition-transform duration-300 group-hover:scale-105`}>
        <Image
          src="/images/logo.png"
          alt="KS World Adventure"
          fill
          priority
          sizes="(min-width: 768px) 96px, 80px"
          className="object-contain object-center"
        />
      </div>
      {!compact && (
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="font-serif text-sm font-bold tracking-wider text-white md:text-base uppercase">
            KS World
          </span>
          <span className="text-[0.55rem] font-display uppercase tracking-[0.25em] text-brass md:text-[0.6rem]">
            Adventure
          </span>
        </span>
      )}
    </Link>
  );
}
