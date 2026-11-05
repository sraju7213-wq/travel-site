"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Image from "next/image";
import { HERO_VIDEOS, HeroVideo, generateShuffledPlaylist } from "@/data/heroVideos";

const ROTATION_SECONDS = 5;
const TICK_INTERVAL_MS = 50; // smooth 20fps progress update
const TOTAL_TICKS = (ROTATION_SECONDS * 1000) / TICK_INTERVAL_MS;
interface HeroVideoShufflerProps {
  onVideoChange?: (video: HeroVideo) => void;
}

export default function HeroVideoShuffler({ onVideoChange }: HeroVideoShufflerProps = {}) {
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
    const shuffled = generateShuffledPlaylist();
    setPlaylist(shuffled);
    setCurrentIndex(0);
    setVideoSrcA(shuffled[0]?.videoUrl || "");
    setVideoSrcB(shuffled.length > 1 ? shuffled[1].videoUrl : shuffled[0]?.videoUrl || "");
  }, []);

  const currentVideo = playlist[currentIndex] || HERO_VIDEOS[0];
  useEffect(() => {
    onVideoChange?.(currentVideo);
  }, [currentVideo, onVideoChange]);


  // Helper to switch to target index with smooth dual-buffer crossfade
  const goToIndex = useCallback(
    (targetIndex: number) => {
      if (isTransitioningRef.current) return;
      const clamped = targetIndex >= playlist.length ? 0 : targetIndex;
      if (clamped === currentIndex) return;

      isTransitioningRef.current = true;
      const nextLayer = activeLayer === "A" ? "B" : "A";
      const nextSrc = playlist[clamped]?.videoUrl || HERO_VIDEOS[0].videoUrl;

      if (nextLayer === "A") {
        setVideoSrcA(nextSrc);
      } else {
        setVideoSrcB(nextSrc);
      }

      setActiveLayer(nextLayer);
      setCurrentIndex(clamped);
      setIsVideoPlaying(false);

      const nextVideoEl = nextLayer === "A" ? videoRefA.current : videoRefB.current;
      const onPlayingHandler = () => {
        setIsVideoPlaying(true);
        isTransitioningRef.current = false;
        nextVideoEl?.removeEventListener("playing", onPlayingHandler);
      };
      if (nextVideoEl) {
        nextVideoEl.addEventListener("playing", onPlayingHandler);
      }
    },
    [playlist, currentIndex, activeLayer]
  );

  const handleNext = useCallback(() => {
    goToIndex(currentIndex + 1);
  }, [goToIndex, currentIndex]);

  // Main 5-second rotation ticker
  useEffect(() => {
    if (!isMounted) return;
    progressTickRef.current = 0;
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

    </div>
  );
}