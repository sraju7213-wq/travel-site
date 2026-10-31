"use client";

import React, { useEffect } from "react";

interface VideoTheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamId?: string;
  title?: string;
  subtitle?: string;
}

const CLOUDFLARE_STREAM_ID = "eed4e42ee04b928636db671c94812677";
const CUSTOMER_SUBDOMAIN = "customer-27c2ml6fadzjjsib.cloudflarestream.com";

export default function VideoTheaterModal({
  isOpen,
  onClose,
  streamId = CLOUDFLARE_STREAM_ID,
  title = "India & Nepal — The Expedition Experience",
  subtitle = "27.7172° N, 85.3240° E • High Himalaya, Pangong Tso & Royal Valleys",
}: VideoTheaterModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = `https://${CUSTOMER_SUBDOMAIN}/${streamId}/iframe?autoplay=true&controls=true&preload=auto`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cinematic Video Theater"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-3 sm:p-6 md:p-10 transition-opacity duration-300"
    >
      {/* Close button in top-right */}
      <button
        onClick={onClose}
        aria-label="Close cinematic theater"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/80 transition-all hover:bg-brass hover:text-white hover:border-brass active:scale-95 shadow-xl cursor-pointer"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-5 w-5 fill-none stroke-current stroke-[2]"
        >
          <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Theater Frame with Antigravity Diffusion Shadow */}
      <div className="relative flex aspect-video w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.12)] sm:rounded-3xl">
        {/* Header Ribbon in Theater */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 sm:p-6">
          <div className="flex flex-col">
            <div className="mb-1 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/20 px-2.5 py-0.5 font-mono text-[10px] text-brass-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse" />
                CLOUDFLARE 1080P STREAM
              </span>
              <span className="font-mono text-[11px] text-white/60">
                1920×1080 • ADAPTIVE BITRATE
              </span>
            </div>
            <h3 className="font-serif text-sm font-semibold tracking-tight text-white sm:text-base">
              {title}
            </h3>
            <p className="font-mono text-[11px] text-white/60">{subtitle}</p>
          </div>
        </div>

        {/* Cloudflare Stream Smart Embed Iframe */}
        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="h-full w-full rounded-2xl border-0 sm:rounded-3xl"
        />
      </div>
    </div>
  );
}
