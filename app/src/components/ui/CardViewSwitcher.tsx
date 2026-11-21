"use client";

export type CardViewMode = "coverflow" | "grid";

interface CardViewSwitcherProps {
  mode: CardViewMode;
  onChange: (mode: CardViewMode) => void;
  label?: string;
}

/**
 * CardViewSwitcher
 * ----------------
 * Shared segmented control for the journey catalogues. Lets visitors choose
 * between the rotating 3D coverflow cards and the plain grid cards.
 */
export default function CardViewSwitcher({
  mode,
  onChange,
  label = "Journey card view",
}: CardViewSwitcherProps) {
  const optionClass = (active: boolean) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 font-sans text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer sm:flex-none min-h-[46px] ${
      active
        ? "bg-gradient-to-r from-brass to-[var(--color-wild-orange)] text-[#0C1617] shadow-[0_4px_12px_rgba(212,147,104,0.3)]"
        : "text-white/60 hover:text-white"
    }`;

  return (
    <div
      className="inline-flex w-full items-center rounded-xl border border-white/10 bg-black/40 p-1 backdrop-blur-md shadow-inner sm:w-auto"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange("coverflow")}
        aria-pressed={mode === "coverflow"}
        className={optionClass(mode === "coverflow")}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <line x1="8" y1="3" x2="8" y2="21" />
          <line x1="16" y1="3" x2="16" y2="21" />
        </svg>
        <span>3D Coverflow</span>
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
        className={optionClass(mode === "grid")}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
        <span>Grid View</span>
      </button>
    </div>
  );
}
