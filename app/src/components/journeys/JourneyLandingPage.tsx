"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DesignSwitcher, { type DesignMode } from "./DesignSwitcher";
import "./modern.css";

const STORAGE_KEY = "jy-design-mode";
const REVEAL_MS = 340;

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
 * experiences. The Orbit tree is rendered exactly as before — it is only
 * wrapped, never rewritten.
 */
export default function JourneyLandingPage({ orbit, modern }: JourneyLandingPageProps) {
  const [mode, setMode] = useState<DesignMode>("modern");
  const [outgoing, setOutgoing] = useState<DesignMode | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Mirrors `mode` so the change handler stays side-effect free.
  const modeRef = useRef<DesignMode>("modern");

  // Restore the visitor's last choice after hydration (localStorage is client-only).
  // Deferred a frame so the server-rendered markup hydrates before the
  // stored mode is applied — avoids a hydration mismatch.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
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
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const change = useCallback((next: DesignMode) => {
    const current = modeRef.current;
    if (current === next) return;

    modeRef.current = next;
    setOutgoing(current);
    setMode(next);

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOutgoing(null), REVEAL_MS);

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