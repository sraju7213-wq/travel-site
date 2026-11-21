"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import DesignSwitcher, { type DesignMode } from "./DesignSwitcher";
import "./modern.css";

const STORAGE_KEY = "jy-design-mode";
const REVEAL_MS = 340;
const FILTER_KEYS = ["category", "region", "activity", "q", "duration", "sort"] as const;

/** Does the current URL ask for the Orbit view's filterable catalogue? */
function urlWantsCatalogue(): boolean {
  if (typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  return (
    window.location.hash === "#catalogue" ||
    FILTER_KEYS.some((key) => params.has(key))
  );
}

/**
 * The catalogue only exists in the Orbit tree. A hash navigation can fire
 * before that tree has mounted, so retry until the anchor is available.
 */
function scrollToCatalogue(): void {
  let attempts = 0;
  const attempt = () => {
    const catalogue = document.getElementById("catalogue");
    if (catalogue) {
      catalogue.scrollIntoView({ block: "start" });
      return;
    }
    if (attempts++ < 6) requestAnimationFrame(attempt);
  };
  requestAnimationFrame(attempt);
}

interface JourneyLandingPageProps {
  /** The existing Orbit landing page, rendered unchanged. */
  orbit: React.ReactNode;
  /** Destination cards the Modern experience needs. */
  modern: React.ReactNode;
}

/**
 * JourneyLandingPage
 * ------------------
 * Owns the active design mode for /journeys and crossfades between the two
 * experiences. Navigation links target the Orbit catalogue with
 * `?category=…`, `?region=…`, `?activity=…`, `?q=…` or `#catalogue`; those URLs
 * are honoured by switching to Orbit, whichever design was saved locally.
 */
export default function JourneyLandingPage({ orbit, modern }: JourneyLandingPageProps) {
  const [mode, setMode] = useState<DesignMode>("modern");
  const [outgoing, setOutgoing] = useState<DesignMode | null>(null);
  const timer = useRef<number | null>(null);
  const searchParams = useSearchParams();
  // Mirrors `mode` so the change handler stays side-effect free.
  const modeRef = useRef<DesignMode>("modern");

  const showCatalogue = useCallback(() => {
    if (modeRef.current !== "orbit") {
      modeRef.current = "orbit";
      setOutgoing(null);
      setMode("orbit");
    }
    scrollToCatalogue();
  }, []);

  // Query-driven navigation (header dropdowns, footer, destination cards).
  useEffect(() => {
    if (!FILTER_KEYS.some((key) => searchParams.has(key))) return;
    showCatalogue();
  }, [searchParams, showCatalogue]);

  // Hash-only navigation when the URL is already on /journeys.
  useEffect(() => {
    const onHashChange = () => {
      if (window.location.hash === "#catalogue") showCatalogue();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [showCatalogue]);

  // Restore the visitor's last choice after hydration (localStorage is client-only).
  // A URL that asks for the catalogue wins over the saved design.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (urlWantsCatalogue()) {
        showCatalogue();
        return;
      }
      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved === "orbit" || saved === "modern") {
          modeRef.current = saved;
          setMode(saved);
        }
      } catch {
        /* storage blocked — stay on Modern */
      }
    });
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer.current ?? undefined);
    };
  }, [showCatalogue]);

  const change = useCallback((next: DesignMode) => {
    const current = modeRef.current;
    if (current === next) return;

    modeRef.current = next;
    setOutgoing(current);
    setMode(next);

    clearTimeout(timer.current ?? undefined);
    timer.current = window.setTimeout(() => setOutgoing(null), REVEAL_MS);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage blocked — mode still applies for this visit */
    }
  }, []);

  const outgoingNode = outgoing && outgoing !== mode
    ? outgoing === "orbit"
      ? orbit
      : modern
    : null;

  return (
    <>
      <DesignSwitcher mode={mode} onChange={change} />

      <div className="jy-viewport">
        {outgoingNode && (
          <div
            key={`out-${outgoing}`}
            className="jy-view--out"
            aria-hidden="true"
            inert
          >
            {outgoingNode}
          </div>
        )}
        <div key={`in-${mode}`} className="jy-view--in">
          {mode === "orbit" ? orbit : modern}
        </div>
      </div>
    </>
  );
}
