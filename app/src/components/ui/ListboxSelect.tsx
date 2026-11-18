"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export interface ListboxOption {
  value: string;
  /** Primary, user-facing text. */
  label: string;
  /** Short secondary token, e.g. a journey code. */
  meta?: string;
  /** Section heading; consecutive options sharing a group render under one heading. */
  group?: string;
}

type ListboxVariant = "form" | "pill" | "drawer" | "compact";

interface ListboxSelectProps {
  id: string;
  value: string;
  options: ListboxOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  /** Accessible name for the popup when no visible label is associated. */
  listLabel?: string;
  /** Accessible name for the trigger button, for controls labelled visually. */
  triggerLabel?: string;
  className?: string;
  /**
   * Visual treatment. `form` is the dark panel control, `pill` is the compact
   * desktop filter chip, `drawer` is the full-width mobile filter control, and
   * `compact` matches the small inputs inside the enquiry dialog.
   */
  variant?: ListboxVariant;
  /** Pill variant only: whether the filter currently holds a non-default value. */
  active?: boolean;
}

const TYPEAHEAD_RESET_MS = 500;
/** Gap between the trigger and the popup, and the minimum usable popup height. */
const POPUP_GAP = 8;
const POPUP_MIN_HEIGHT = 160;
const POPUP_MAX_HEIGHT = 320;
/** Keep the popup a comfortable read width even when the trigger is a chip. */
const PILL_MIN_WIDTH = 220;

const optionId = (id: string, index: number) => `${id}-option-${index}`;

const SHARED_TRIGGER =
  "group flex items-center gap-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass disabled:cursor-not-allowed disabled:opacity-40";

const TRIGGER_CLASS: Record<ListboxVariant, string> = {
  form: "w-full rounded-button border border-white/15 bg-black/40 px-4 py-3.5 hover:border-brass/60",
  drawer:
    "h-12 w-full rounded-xl border border-white/15 bg-black/40 px-4 hover:border-white/30",
  pill:
    "h-10 rounded-xl border px-4 pr-9 font-sans text-xs font-medium uppercase tracking-wider hover:border-white/25",
  compact:
    "h-[42px] w-full rounded-lg border border-white/10 bg-[#0C1617] px-3 font-display text-sm hover:border-brass/60",
};

const LABEL_CLASS: Record<ListboxVariant, string> = {
  form: "font-sans text-sm font-medium text-white",
  drawer: "font-sans text-sm text-white",
  pill: "font-sans text-xs font-medium uppercase tracking-wider",
  compact: "font-display text-sm text-white",
};

const CHEVRON_CLASS: Record<ListboxVariant, string> = {
  form: "text-white/50 group-hover:text-white/80",
  drawer: "text-white/60",
  pill: "opacity-70 group-hover:opacity-100",
  compact: "text-white/50 group-hover:text-white/80",
};

const POPUP_CLASS: Record<ListboxVariant, string> = {
  form: "border border-white/15 bg-[#0A1213]",
  drawer: "rounded-xl border border-white/15 bg-[#121B20]",
  pill: "rounded-xl border border-white/10 bg-[#121B20]",
  compact: "rounded-lg border border-white/15 bg-[#0A1213]",
};

interface Placement {
  side: "top" | "bottom";
  top: number;
  bottom: number;
  left: number;
  width: number;
  maxHeight: number;
}

export default function ListboxSelect({
  id,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Select an option",
  listLabel = "Options",
  triggerLabel,
  className = "",
  variant = "form",
  active = false,
}: ListboxSelectProps) {
  const [openState, setOpenState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [placement, setPlacement] = useState<Placement>({
    side: "bottom",
    top: 0,
    bottom: 0,
    left: 0,
    width: 0,
    maxHeight: POPUP_MAX_HEIGHT,
  });

  // Mirror of activeIndex so key handlers never act on a stale render value.
  const activeIndexRef = useRef(-1);
  const setActive = (next: number | ((current: number) => number)) => {
    const resolved = typeof next === "function" ? next(activeIndexRef.current) : next;
    activeIndexRef.current = resolved;
    setActiveIndex(resolved);
  };

  // A disabled control must never show its popup, even if it was open beforehand.
  const open = openState && !disabled;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const typeaheadRef = useRef({ buffer: "", timer: 0 as unknown as ReturnType<typeof setTimeout> });

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;
  const listboxId = `${id}-listbox`;

  const commit = (index: number) => {
    const option = options[index];
    setOpenState(false);
    setActive(index);
    triggerRef.current?.focus();
    if (option && option.value !== value) onChange(option.value);
  };

  /**
   * Anchor the popup to the trigger in viewport coordinates. The list is
   * portalled to the body, so it is never clipped by a scrolling or
   * overflow-hidden ancestor (filter drawer, dialog, form panel).
   */
  const measure = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const spaceBelow = viewportHeight - rect.bottom - POPUP_GAP;
    const spaceAbove = rect.top - POPUP_GAP;
    // Flip upward whenever the space below cannot show a usable list and the
    // space above is roomier (typical for controls near the viewport bottom).
    const side: "top" | "bottom" =
      spaceBelow < Math.min(POPUP_MAX_HEIGHT, POPUP_MIN_HEIGHT) && spaceAbove > spaceBelow
        ? "top"
        : "bottom";
    const available = side === "bottom" ? spaceBelow : spaceAbove;

    const width = Math.min(
      Math.max(rect.width, variant === "pill" ? PILL_MIN_WIDTH : 0),
      viewportWidth - 16
    );
    const left = Math.min(Math.max(rect.left, 8), viewportWidth - width - 8);

    setPlacement({
      side,
      width,
      left,
      top: rect.bottom + POPUP_GAP,
      bottom: viewportHeight - rect.top + POPUP_GAP,
      // Never exceed the space actually available on that side, and keep a
      // little breathing room at the far edge.
      maxHeight: Math.max(
        0,
        Math.min(POPUP_MAX_HEIGHT, Math.max(96, available - POPUP_GAP), available)
      ),
    });
  };

  const openList = () => {
    if (disabled) return;
    measure();
    setActive(selectedIndex >= 0 ? selectedIndex : 0);
    setOpenState(true);
  };

  const closeList = () => {
    setOpenState(false);
    triggerRef.current?.focus();
  };

  // Move focus into the popup so keys and screen readers land on the list.
  useEffect(() => {
    if (open) listRef.current?.focus({ preventScroll: true });
  }, [open]);

  // Keep the highlighted row visible inside the scroll container.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(optionId(id, activeIndex))?.scrollIntoView({ block: "nearest" });
  }, [id, open, activeIndex]);

  // Dismiss on outside pointer or when focus leaves the widget. The popup lives
  // in a portal, so it must be checked separately from the trigger root.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target) || listRef.current?.contains(target)) return;
      setOpenState(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Re-anchor the popup when the viewport or any ancestor scrolls.
  useEffect(() => {
    if (!open) return;
    const onReflow = () => measure();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
    // measure is recreated per render but reads only refs and viewport values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const move = (delta: number) => {
    setActive((index) => {
      const next = index + delta;
      if (next < 0) return options.length - 1;
      if (next > options.length - 1) return 0;
      return next;
    });
  };

  const typeahead = (key: string) => {
    const state = typeaheadRef.current;
    clearTimeout(state.timer);
    state.buffer += key.toLowerCase();
    state.timer = setTimeout(() => {
      state.buffer = "";
    }, TYPEAHEAD_RESET_MS);

    const start = activeIndexRef.current < 0 ? 0 : activeIndexRef.current;
    for (let offset = 0; offset < options.length; offset += 1) {
      const index = (start + offset) % options.length;
      if (options[index].label.toLowerCase().startsWith(state.buffer)) {
        setActive(index);
        return;
      }
    }
  };

  const triggerClassName =
    variant === "pill"
      ? active
        ? "border-[var(--color-wild-orange)]/60 bg-[var(--color-wild-orange)]/15 text-white shadow-[0_0_15px_rgba(212,147,104,0.2)]"
        : "border-white/10 bg-black/30 text-white/75 hover:text-white"
      : "";

  const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(options.length - 1);
        break;
      case "PageDown":
        event.preventDefault();
        setActive((index) => Math.min(index + 5, options.length - 1));
        break;
      case "PageUp":
        event.preventDefault();
        setActive((index) => Math.max(index - 5, 0));
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (activeIndexRef.current >= 0) commit(activeIndexRef.current);
        break;
      case "Escape":
        event.preventDefault();
        // Keep Escape scoped to the list even when a dialog or drawer also
        // listens for it on the document.
        event.stopPropagation();
        closeList();
        break;
      case "Tab":
        // Hand focus back to the trigger before the browser advances, so Tab
        // continues from the control rather than from the portalled list.
        setOpenState(false);
        triggerRef.current?.focus();
        break;
      default:
        if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          typeahead(event.key);
        }
    }
  };

  const popup = (
    <div
      ref={listRef}
      id={listboxId}
      role="listbox"
      aria-label={listLabel}
      tabIndex={-1}
      aria-activedescendant={activeIndex >= 0 ? optionId(id, activeIndex) : undefined}
      onKeyDown={handleListKeyDown}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (next && (rootRef.current?.contains(next) || listRef.current?.contains(next))) return;
        setOpenState(false);
      }}
      style={{
        position: "fixed",
        left: placement.left,
        width: placement.width,
        maxHeight: placement.maxHeight,
        ...(placement.side === "bottom"
          ? { top: placement.top }
          : { bottom: placement.bottom }),
      }}
      className={`z-[120] overflow-y-auto overscroll-contain py-1.5 shadow-2xl shadow-black/60 outline-none [scrollbar-color:rgba(255,255,255,0.2)_transparent] [scrollbar-width:thin] ${POPUP_CLASS[variant]}`}
    >
      {options.map((option, index) => {
        const showHeading =
          Boolean(option.group) && (index === 0 || options[index - 1].group !== option.group);
        const isActive = index === activeIndex;
        const isSelected = option.value === value;

        return (
          <div key={option.value} role="presentation">
            {showHeading && (
              <div
                aria-hidden="true"
                className="px-4 pt-3 pb-1.5 text-[0.6rem] font-display font-semibold uppercase tracking-[0.2em] text-brass/70"
              >
                {option.group}
              </div>
            )}
            <div
              id={optionId(id, index)}
              role="option"
              aria-selected={isSelected}
              onMouseEnter={() => setActive(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => commit(index)}
              className={`relative flex cursor-pointer items-start gap-3 py-2.5 pl-4 pr-10 transition-colors ${
                isActive ? "bg-brass/15" : ""
              } ${isSelected ? "text-white" : "text-white/75"}`}
            >
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-0.5 transition-colors ${
                  isActive ? "bg-brass" : "bg-transparent"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-sans text-sm leading-snug line-clamp-2">
                  {option.label}
                </span>
                {option.meta && (
                  <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brass/70">
                    {option.meta}
                  </span>
                )}
              </span>
              {isSelected && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  className="mt-1 shrink-0 stroke-current stroke-[2.5] text-brass"
                >
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={triggerLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        onClick={() => (open ? closeList() : openList())}
        onKeyDown={(event) => {
          if (disabled) return;
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!open) {
              openList();
            } else {
              move(event.key === "ArrowDown" ? 1 : -1);
            }
          } else if ((event.key === "Enter" || event.key === " ") && !open) {
            event.preventDefault();
            openList();
          }
        }}
        className={`${SHARED_TRIGGER} ${TRIGGER_CLASS[variant]} ${triggerClassName}`}
      >
        <span className={`min-w-0 flex-1 truncate ${LABEL_CLASS[variant]}`}>
          {selected ? selected.label : <span className="text-white/50">{placeholder}</span>}
        </span>
        {selected?.meta && variant !== "pill" && (
          <span className="hidden shrink-0 border border-brass/30 bg-brass/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brass sm:inline-block">
            {selected.meta}
          </span>
        )}
        <svg
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          aria-hidden="true"
          className={`shrink-0 stroke-current stroke-2 transition-transform duration-200 ${CHEVRON_CLASS[variant]} ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M1 1.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && typeof document !== "undefined" && createPortal(popup, document.body)}
    </div>
  );
}
