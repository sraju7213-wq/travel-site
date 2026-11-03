"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { HERO_VIDEOS, HeroVideo, generateShuffledPlaylist } from "@/data/heroVideos";

const ROTATION_SECONDS = 5;
const TICK_INTERVAL_MS = 50; // smooth 20fps progress update
const TOTAL_TICKS = (ROTATION_SECONDS * 1000) / TICK_INTERVAL_MS;

export default function HeroVideoShuffler() {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [playlist, setPlaylist] = useState<HeroVideo[]>(HERO_VIDEOS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");

  // Dual-buffer video sources
  const [videoSrcA, setVideoSrcA] = useState<string>(HERO_VIDEOS[0]?.videoUrl || "");
  const [videoSrcB, setVideoSrcB] = useState<string>(
    HERO_VIDEOS.length > 1 ? HERO_VIDEOS[1].videoUrl : HERO_VIDEOS[0]?.videoUrl || ""
  );

  // Track if current video is actively rendering frames
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Video element references
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);
  const progressTickRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);

  // Initialize diverse non-repeating shuffled playlist on client mount
  useEffect(() => {
    let lastSeenId: string | null = null;
    try {
      lastSeenId = sessionStorage.getItem("last_hero_video_id");
    } catch {
      // safe fallback if storage unavailable
    }

    const shuffled = generateShuffledPlaylist(HERO_VIDEOS, lastSeenId || undefined);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlaylist(shuffled);
    setCurrentIndex(0);
    setActiveLayer("A");
    setVideoSrcA(shuffled[0].videoUrl);
    setVideoSrcB(shuffled.length > 1 ? shuffled[1].videoUrl : shuffled[0].videoUrl);

    // Ensure audio is muted to comply with browser autoplay policies
    if (videoRefA.current) {
      videoRefA.current.muted = true;
      videoRefA.current.defaultMuted = true;
      videoRefA.current.playsInline = true;
      videoRefA.current.play().catch(() => {});
    }
    if (videoRefB.current) {
      videoRefB.current.muted = true;
      videoRefB.current.defaultMuted = true;
      videoRefB.current.playsInline = true;
    }

    try {
      sessionStorage.setItem("last_hero_video_id", shuffled[0].id);
    } catch {
      // ignore
    }
  }, []);

  const currentVideo = playlist[currentIndex] || HERO_VIDEOS[0];

  // Helper to switch to target index with smooth dual-buffer crossfade
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      let nextList = playlist;
      let finalIndex = targetIndex;

      // When reaching the end of the 23-item cycle, generate a NEW diverse cycle
      // guaranteed not to repeat the previous cycle's final video place.
      if (targetIndex >= playlist.length) {
        const lastId = playlist[playlist.length - 1]?.id;
        nextList = generateShuffledPlaylist(HERO_VIDEOS, lastId);
        setPlaylist(nextList);
        finalIndex = 0;
      } else if (targetIndex < 0) {
        finalIndex = playlist.length - 1;
      }

      const subsequentIndex = (finalIndex + 1) % nextList.length;
      const subsequentVideo = nextList[subsequentIndex] || HERO_VIDEOS[0];

      if (activeLayer === "A") {
        // Switch to Layer B
        if (videoRefB.current) {
          videoRefB.current.muted = true;
          videoRefB.current.defaultMuted = true;
          videoRefB.current.currentTime = 0;
          videoRefB.current.play().catch(() => {});
        }
        setActiveLayer("B");

        // After crossfade completes (1000ms), pause outgoing A and pre-arm it with subsequent video
        setTimeout(() => {
          if (videoRefA.current) {
            videoRefA.current.pause();
          }
          setVideoSrcA(subsequentVideo.videoUrl);
          isTransitioningRef.current = false;
        }, 1100);
      } else {
        // Switch to Layer A
        if (videoRefA.current) {
          videoRefA.current.muted = true;
          videoRefA.current.defaultMuted = true;
          videoRefA.current.currentTime = 0;
          videoRefA.current.play().catch(() => {});
        }
        setActiveLayer("A");

        // After crossfade completes (1000ms), pause outgoing B and pre-arm it with subsequent video
        setTimeout(() => {
          if (videoRefB.current) {
            videoRefB.current.pause();
          }
          setVideoSrcB(subsequentVideo.videoUrl);
          isTransitioningRef.current = false;
        }, 1100);
      }

      setCurrentIndex(finalIndex);
      progressTickRef.current = 0;

      try {
        sessionStorage.setItem("last_hero_video_id", nextList[finalIndex].id);
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

      if (progressTickRef.current >= TOTAL_TICKS) {
        progressTickRef.current = 0;
        handleNext();
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [isMounted, handleNext]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black select-none">
      {/* Underlying Instant High-Res Poster Layer — never shows black void */}
      <Image
        src={currentVideo.posterUrl}
        alt={currentVideo.title}
        fill
        priority
        sizes="100vw"
        className={`object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ${
          isVideoPlaying ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* Layer A Video */}
      <video
        ref={videoRefA}
        src={videoSrcA}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        onPlaying={() => {
          if (activeLayer === "A") setIsVideoPlaying(true);
        }}
        className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
          activeLayer === "A" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
        }`}
        onError={() => {
          handleNext();
        }}
      />

      {/* Layer B Video */}
      <video
        ref={videoRefB}
        src={videoSrcB}
        autoPlay
        playsInline
        muted
        loop
        preload="auto"
        onPlaying={() => {
          if (activeLayer === "B") setIsVideoPlaying(true);
        }}
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

      {/* Place Details Card — minimal, top-right, below fixed header */}
      <div className="hidden sm:block pointer-events-none absolute top-[76px] sm:top-[92px] right-3 sm:right-8 md:right-12 z-30 max-w-[240px]">
        <div className="pointer-events-auto rounded-lg border border-white/15 bg-black/25 p-3 backdrop-blur-sm shadow-[0_2px_12px_rgba(0,0,0,0.45)] text-left transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brass animate-pulse shrink-0" />
            <span className="font-accent text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.2em] text-brass-soft">
              {currentVideo.region}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-[10px] sm:text-[12px] font-light tracking-wide text-white leading-tight drop-shadow-md">
            {currentVideo.title}
          </h2>
          <p className="mt-0.5 font-sans text-[9px] sm:text-[11px] font-light text-white/70 drop-shadow">
            {currentVideo.location}
          </p>
        </div>
      </div>
    </div>
  );
}
