"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { HERO_VIDEOS, HeroVideo, generateShuffledPlaylist } from "@/data/heroVideos";

const ROTATION_SECONDS = 5;
const TICK_INTERVAL_MS = 50; // smooth 20fps progress update
const TOTAL_TICKS = (ROTATION_SECONDS * 1000) / TICK_INTERVAL_MS;

export default function HeroVideoShuffler() {
  const [isMounted, setIsMounted] = useState(false);
  const [playlist, setPlaylist] = useState<HeroVideo[]>(HERO_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");

  // Video sources for dual-buffer cross-fader
  const [videoSrcA, setVideoSrcA] = useState<string>(HERO_VIDEOS[0].videoUrl);
  const [videoSrcB, setVideoSrcB] = useState<string>(
    HERO_VIDEOS.length > 1 ? HERO_VIDEOS[1].videoUrl : HERO_VIDEOS[0].videoUrl
  );

  const [progress, setProgress] = useState(0); // 0 to 100 percent

  // Video element references
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const progressTickRef = useRef<number>(0);

  // Initialize randomized shuffler on client mount (never repeating last seen)
  useEffect(() => {
    setIsMounted(true);
    let lastSeenId: string | null = null;
    try {
      lastSeenId = sessionStorage.getItem("last_hero_video_id");
    } catch {
      // safe fallback if storage unavailable
    }

    const shuffled = generateShuffledPlaylist(HERO_VIDEOS, lastSeenId || undefined);
    setPlaylist(shuffled);
    setCurrentIndex(0);
    setActiveLayer("A");
    setVideoSrcA(shuffled[0].videoUrl);
    setVideoSrcB(shuffled.length > 1 ? shuffled[1].videoUrl : shuffled[0].videoUrl);
    // Ensure video A plays immediately on mount
    if (videoRefA.current) {
      videoRefA.current.muted = true;
      videoRefA.current.play().catch(() => {});
    }

    try {
      sessionStorage.setItem("last_hero_video_id", shuffled[0].id);
    } catch {
      // ignore
    }
  }, []);
  const currentVideo = playlist[currentIndex] || HERO_VIDEOS[0];

  // Helper to switch to target index
  const goToIndex = useCallback(
    (targetIndex: number) => {
      let nextList = playlist;
      let finalIndex = targetIndex;

      // When reaching the end of the current cycle, generate a NEW shuffled cycle
      // guaranteed not to repeat the previous cycle's final video.
      if (targetIndex >= playlist.length) {
        const lastId = playlist[playlist.length - 1]?.id;
        nextList = generateShuffledPlaylist(HERO_VIDEOS, lastId);
        setPlaylist(nextList);
        finalIndex = 0;
      } else if (targetIndex < 0) {
        finalIndex = playlist.length - 1;
      }

      const targetVideo = nextList[finalIndex];
      const subsequentVideo =
        nextList[(finalIndex + 1) % nextList.length] || HERO_VIDEOS[0];

      // Cross-fade to other layer
      if (activeLayer === "A") {
        setVideoSrcB(targetVideo.videoUrl);
        if (videoRefB.current) {
          videoRefB.current.currentTime = 0;
          videoRefB.current.play().catch(() => {});
        }
        setActiveLayer("B");
        // Pre-arm layer A with the video that will follow next
        setTimeout(() => {
          setVideoSrcA(subsequentVideo.videoUrl);
        }, 1200);
      } else {
        setVideoSrcA(targetVideo.videoUrl);
        if (videoRefA.current) {
          videoRefA.current.currentTime = 0;
          videoRefA.current.play().catch(() => {});
        }
        setActiveLayer("A");
        // Pre-arm layer B with the video that will follow next
        setTimeout(() => {
          setVideoSrcB(subsequentVideo.videoUrl);
        }, 1200);
      }

      setCurrentIndex(finalIndex);
      setProgress(0);
      progressTickRef.current = 0;

      try {
        sessionStorage.setItem("last_hero_video_id", targetVideo.id);
      } catch {
        // ignore
      }
    },
    [playlist, activeLayer]
  );

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [goToIndex, currentIndex]);

  // Main 5-second rotation ticker
  useEffect(() => {
    if (!isMounted) return;

    const timer = setInterval(() => {
      progressTickRef.current += 1;
      const pct = Math.min(100, (progressTickRef.current / TOTAL_TICKS) * 100);
      setProgress(pct);

      if (progressTickRef.current >= TOTAL_TICKS) {
        progressTickRef.current = 0;
        setProgress(0);
        handleNext();
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isMounted, handleNext]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black select-none">
      {/* Underlying Instant High-Res Poster Layer */}
      <Image
        src={currentVideo.posterUrl}
        alt={currentVideo.title}
        fill
        priority
        sizes="100vw"
        className="object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000"
      />

      {/* Layer A Dual-Buffer Video */}
      <video
        ref={videoRefA}
        src={videoSrcA}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
          activeLayer === "A" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        }`}
        onError={() => {
          handleNext();
        }}
      />

      {/* Layer B Dual-Buffer Video */}
      <video
        ref={videoRefB}
        src={videoSrcB}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
          activeLayer === "B" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        }`}
        onError={() => {
          handleNext();
        }}
      />

      {/* Filmic Contrast Overlays ensuring content is 100% visible across bright scenes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.25)_0%,rgba(0,0,0,0.65)_100%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/75 via-black/20 to-black/60"
      />

      {/* Enhanced Place Details — Positioned on the Right Side with Balanced Glass Contrast */}
      <div className="pointer-events-none absolute bottom-6 sm:bottom-10 right-4 sm:right-8 md:right-12 z-30 max-w-sm sm:max-w-md">
        <div className="pointer-events-auto rounded-2xl border border-white/20 bg-black/60 p-4 sm:p-5 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-left transition-all duration-500">
          {/* Header Row: Live pulse + region + coordinates */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-2 truncate">
              <span className="h-2 w-2 rounded-full bg-brass animate-pulse shrink-0" />
              <span className="font-accent text-[10px] font-semibold uppercase tracking-[0.22em] text-brass-soft truncate">
                {currentVideo.region}
              </span>
            </div>
            <span className="font-mono text-[10px] text-white/50 shrink-0">
              {currentVideo.coordinates}
            </span>
          </div>

          {/* Place title and specific location */}
          <h2 className="mt-2.5 font-serif text-lg sm:text-xl font-light tracking-wide text-white leading-snug drop-shadow-md">
            {currentVideo.title}
          </h2>
          <p className="font-sans text-xs font-light text-white/75 drop-shadow mt-0.5">
            {currentVideo.location}
          </p>

          {/* Extra Place Details / Highlight Note */}
          <p className="mt-2 font-serif italic font-light text-xs sm:text-[13px] leading-relaxed text-brass-soft/95">
            &ldquo;{currentVideo.highlights}&rdquo;
          </p>

          {/* Micro Expedition Badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/80">
              <span className="text-brass">Alt:</span> {currentVideo.altitude}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-white/80">
              <span className="text-brass">Best:</span> {currentVideo.bestSeason}
            </span>
          </div>

          {/* 5-Second Linear Progress Bar */}
          <div className="mt-3.5 h-0.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-gradient-to-r from-brass via-brass-soft to-brass transition-all ease-linear"
              style={{
                width: `${progress}%`,
                transitionDuration: `${TICK_INTERVAL_MS}ms`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
