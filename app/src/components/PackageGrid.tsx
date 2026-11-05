import PackageCard from "./PackageCard";
import type { PackageViewModel } from "@/types/travel";

interface PackageGridProps {
  packages: PackageViewModel[];
  heading?: string;
  className?: string;
}

export default function PackageGrid({
  packages,
  heading,
  className,
}: PackageGridProps) {
  if (!packages || packages.length === 0) {
    return (
      <section className={className ?? "my-12"}>
        {heading && <h2 className="text-h3 font-serif font-bold text-white mb-8">{heading}</h2>}
        <div className="flex flex-col items-center gap-6 py-20 text-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/30">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
              <line x1="9" y1="15" x2="15" y2="9" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h3 className="font-serif text-xl font-light text-white">No journeys match</h3>
            <p className="mt-2 font-display text-white/50">Try adjusting your filters or search terms</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={className ?? "my-12"}>
      {heading && <h2 className="text-h3 font-serif font-bold text-white mb-8">{heading}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10 xl:gap-x-8 xl:gap-y-12">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(index * 0.05, 0.4)}s` }}>
            <PackageCard pkg={pkg} />
          </div>
        ))}
      </div>
    </section>
  );
}
