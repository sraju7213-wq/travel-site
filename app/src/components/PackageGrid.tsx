import PackageCard from "./PackageCard";
import type { PackageViewModel } from "@/types/travel";

interface PackageGridProps {
  packages: PackageViewModel[];
  heading?: string;
}

export default function PackageGrid({
  packages,
  heading,
}: PackageGridProps) {
  if (!packages || packages.length === 0) {
    return (
      <section className="my-12">
        {heading && <h2 className="text-xl font-serif font-semibold text-charcoal mb-8">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-ivory-soft">
            <p className="text-charcoal-soft">No trips match your selection.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="my-12">
      {heading && <h2 className="text-h3 font-serif font-bold text-charcoal mb-8">{heading}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}
      </div>
    </section>
  );
}
