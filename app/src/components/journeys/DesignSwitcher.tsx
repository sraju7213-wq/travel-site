"use client";

import { useEffect, useRef } from "react";
import "./modern.css";

export type DesignMode = "orbit" | "modern";

interface DesignSwitcherProps {
  mode: DesignMode;
  onChange: (mode: DesignMode) => void;
}

const OPTIONS: { id: DesignMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "orbit",
    label: "Orbit",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="3.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.6" transform="rotate(-28 12 12)" />
      </svg>
    ),
  },
  {
    id: "modern",
    label: "Modern",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2.5 14.6 9.4 21.5 12 14.6 14.6 12 21.5 9.4 14.6 2.5 12 9.4 9.4Z" />
      </svg>
    ),
  },
];

/**
 * DesignSwitcher
 * --------------
 * Pill-shaped segmented toggle that swaps the Journey landing page between the
 * Orbit and Modern experiences. Fixed under the header on the right so it never
 * collides with the brand mark, the navigation or hero copy.
 */
export default function DesignSwitcher({ mode, onChange }: DesignSwitcherProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  // Keep focus on the selected segment after a keyboard switch.
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement && refs.current[0]?.parentElement?.contains(document.activeElement)) {
      const index = refs.current.findIndex((el) => el === document.activeElement);
      if (index >= 0) refs.current[OPTIONS.findIndex((o) => o.id === mode)]?.focus();
    }
  }, [mode]);

  return (
    <div className="jy-switch" role="radiogroup" aria-label="Journey page design">
      <span className="jy-switch__thumb" data-mode={mode} aria-hidden="true" />
      {OPTIONS.map((option, index) => {
        const active = option.id === mode;
        return (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={option.label}
            tabIndex={active ? 0 : -1}
            className="jy-switch__opt"
            onClick={() => {
              if (!active) onChange(option.id);
            }}
            onKeyDown={(event) => {
              const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
              if (!keys.includes(event.key)) return;
              event.preventDefault();
              const next = OPTIONS[index === 0 ? 1 : 0];
              onChange(next.id);
            }}
          >
            <span className="jy-switch__icon">{option.icon}</span>
            <span className="jy-switch__label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}