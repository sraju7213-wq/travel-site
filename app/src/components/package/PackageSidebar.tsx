import Image from "next/image";
import Link from "next/link";
import EnquireCta from "@/components/package/EnquireCta";
import type { PackageViewModel } from "@/types/travel";

interface PackageSidebarProps {
  pkg: PackageViewModel;
  related: PackageViewModel[];
}

export default function PackageSidebar({ pkg, related }: PackageSidebarProps) {
  const destinations = pkg.region.filter((r) => r !== "India" && r !== "Nepal");

  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Category", value: pkg.category },
    { label: "Duration", value: pkg.duration },
    { label: "Group size", value: "Small group (max 15) or solo" },
    {
      label: "Key destinations",
      value:
        destinations.length > 0 ? destinations.join(", ") : pkg.region.join(", "),
    },
    { label: "Brochure code", value: pkg.brochure_code },
    {
      label: "Departure",
      value: <span className="text-emerald-400">On request — no minimum group quota</span>,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Journey at a glance */}
      <div className="rounded-xl border border-white/10 bg-[#132325] p-5 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-brass">
              Expedition Summary
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold text-white">Journey at a Glance</h2>
          </div>
          <span className="shrink-0 rounded border border-brass/30 bg-brass/10 px-2 py-0.5 font-mono text-[11px] text-brass">
            {pkg.brochure_code}
          </span>
        </div>

        <dl className="space-y-3 font-display text-xs">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-start justify-between gap-4 border-b border-white/5 pb-2.5 last:border-0 last:pb-0"
            >
              <dt className="shrink-0 text-white/45">{row.label}</dt>
              <dd className="text-right font-medium text-white/90">{row.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 space-y-2.5">
          <EnquireCta
            label="Enquire About This Journey"
            withArrow
            className="w-full"
          />
          <EnquireCta
            label="Request Full Brochure"
            message="Please send me the full printed brochure for this journey."
            variant="outline"
            className="w-full"
          />
        </div>

        <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brass/40 font-serif text-xs font-bold text-brass">
            KS
          </span>
          <p className="font-display text-[11px] leading-tight text-white/50">
            <span className="block font-medium text-white">Personalised expedition planning</span>
            Every departure is confirmed personally by a travel consultant.
          </p>
        </div>
      </div>

      {/* Related journeys */}
      {related.length > 0 && (
        <div className="rounded-xl border border-white/10 bg-[#132325] p-4 shadow-md">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
              Related Journeys
            </h2>
            <Link
              href="/journeys"
              className="font-display text-[11px] text-brass transition hover:text-brass-soft hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {related.map((item) => {
              const stops = item.region.filter((r) => r !== "India" && r !== "Nepal");
              return (
                <Link
                  key={item.id}
                  href={`/packages/${item.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-2 transition hover:border-brass/60 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass will-change-transform"
                >
                  <span className="relative h-12 w-14 shrink-0 overflow-hidden rounded bg-[#0C1617]">
                    <Image
                      src={`/images/packages/${item.slug}.jpg`}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-xs font-semibold text-white transition-colors group-hover:text-brass">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block truncate font-display text-[11px] text-white/45">
                      {stops.length > 0 ? stops.slice(0, 3).join(", ") : item.primaryRegion} •{" "}
                      {item.duration.split(" ")[0]} nights
                    </span>
                    <span className="mt-0.5 block font-display text-[10px] uppercase tracking-[0.12em] text-brass">
                      {item.category} →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
