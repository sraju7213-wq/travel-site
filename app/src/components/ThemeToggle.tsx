"use client";

import { useSyncExternalStore } from "react";
import {
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  type Theme,
} from "@/lib/theme";

/**
 * Tiny shared store so every toggle on the page shows the same value. The root
 * layout has already applied the saved/system theme before first paint; the
 * store simply reads that attribute and keeps the buttons in sync on change.
 */
let currentTheme: Theme =
  typeof document !== "undefined" &&
  document.documentElement.getAttribute(THEME_ATTRIBUTE) === "light"
    ? "light"
    : "dark";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Theme {
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "dark";
}

function applyTheme(next: Theme) {
  currentTheme = next;
  const root = document.documentElement;
  root.setAttribute(THEME_ATTRIBUTE, next);
  root.style.colorScheme = next;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage can be blocked (private mode); the switch still works for the session.
  }
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", next === "light" ? "#F6F2E9" : "#0C1617");
  listeners.forEach((listener) => listener());
}

/**
 * Light/dark switch used in the desktop header, mobile actions and the drawer.
 */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => applyTheme(theme === "light" ? "dark" : "light");
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/20 text-white transition-colors hover:border-[var(--color-wild-orange)] hover:text-[var(--color-wild-orange)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-wild-orange)] ${className}`}
    >
      {isLight ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
      )}
    </button>
  );
}
