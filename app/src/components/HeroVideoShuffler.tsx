"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { HERO_VIDEOS, HeroVideo } from "@/data/heroVideos";

// Declare optional mobileVideoUrl property on HeroVideo in case it has not yet landed in heroVideos.ts
declare module "@/data/heroVideos" {
  interface HeroVideo {
    mobileVideoUrl?: string;
  }
}

const ROTATION_SECONDS = 5;
const TICK_INTERVAL_MS = 50; // smooth 20fps progress update
const TOTAL_TICKS = (ROTATION_SECONDS * 1000) / TICK_INTERVAL_MS;

interface HeroVideoShufflerProps {
  onVideoChange?: (video: HeroVideo) => void;
  videos?: HeroVideo[];
}

// Subscribe to viewport width (<= 767px) for phone layout decisions
function subscribePhone(callback: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mql = window.matchMedia("(max-width: 767px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getPhoneSnapshot(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function getPhoneServerSnapshot(): boolean {
  return false;
}

// Subscribe to reduced motion and data-saver / slow connection preferences
function subscribeBlockVideo(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  mql?.addEventListener("change", callback);
  const conn = (
    navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  conn?.addEventListener?.("change", callback);

  return () => {
    mql?.removeEventListener("change", callback);
    conn?.removeEventListener?.("change", callback);
  };
}

function getBlockVideoSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  const reduced = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  const conn = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;
  const cheap = !!conn?.saveData || /^(slow-)?2g/.test(conn?.effectiveType ?? "");
  return reduced || cheap;
}

function getBlockVideoServerSnapshot(): boolean {
  return false;
}

export default function HeroVideoShuffler({ onVideoChange, videos }: HeroVideoShufflerProps = {}) {
  const availableVideos = videos?.length ? videos : HERO_VIDEOS;
  const containerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Separated display modes:
   *
   * Previously, "lite" conflated phone screens with reduced motion and slow connections,
   * completely suppressing video on mobile while creating a first-paint flash on desktop
   * as state flipped from true to false after mounting.
   *
   * We now cleanly separate:
   * 1. isPhone: renders exactly ONE phone-optimized video stream on <= 767px.
   * 2. blockVideo: renders ZERO video elements when reduced motion or data saver is active.
   *
   * Synchronous store reading ensures server and client snapshots match on desktop,
   * eliminating the first-paint poster flash.
   */
  const isPhone = useSyncExternalStore(subscribePhone, getPhoneSnapshot, getPhoneServerSnapshot);
  const blockVideo = useSyncExternalStore(subscribeBlockVideo, getBlockVideoSnapshot, getBlockVideoServerSnapshot);

  const [playlist, setPlaylist] = useState<HeroVideo[]>(availableVideos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"A" | "B">("A");

  // Dual-buffer video sources for desktop crossfade
  const [videoSrcA, setVideoSrcA] = useState<string>(availableVideos[0]?.videoUrl || "");
  const [videoSrcB, setVideoSrcB] = useState<string>(
    availableVideos.length > 1 ? availableVideos[1].videoUrl : availableVideos[0]?.videoUrl || ""
  );

  // Track if current video is actively rendering frames
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [autoplayRefused, setAutoplayRefused] = useState(false);

  // Keep first paint poster-only: the priority JPEG becomes LCP instead of a
  // multi-megabyte remote video frame. Video elements mount one frame later.
  const [videosReady, setVideosReady] = useState(false);
  useEffect(() => {
    let timer = 0;
    const start = () => {
      timer = window.setTimeout(() => setVideosReady(true), 300);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  // Video element references
  const phoneVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRefA = useRef<HTMLVideoElement | null>(null);
  const videoRefB = useRef<HTMLVideoElement | null>(null);

  const progressTickRef = useRef<number>(0);
  const bufferingTicksRef = useRef<number>(0);
  const isTransitioningRef = useRef<boolean>(false);
  const transitionCleanupRef = useRef<(() => void) | null>(null);

  // Mirror state to refs so ticker and event callbacks never suffer from stale closures
  const currentIndexRef = useRef(currentIndex);
  const playlistRef = useRef(playlist);
  const activeLayerRef = useRef(activeLayer);
  const isVideoPlayingRef = useRef(isVideoPlaying);
  const autoplayRefusedRef = useRef(autoplayRefused);
  const isPhoneRef = useRef(isPhone);
  const blockVideoRef = useRef(blockVideo);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  useEffect(() => {
    playlistRef.current = playlist;
  }, [playlist]);

  useEffect(() => {
    activeLayerRef.current = activeLayer;
  }, [activeLayer]);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  useEffect(() => {
    autoplayRefusedRef.current = autoplayRefused;
  }, [autoplayRefused]);

  useEffect(() => {
    isPhoneRef.current = isPhone;
  }, [isPhone]);

  useEffect(() => {
    blockVideoRef.current = blockVideo;
  }, [blockVideo]);

  // Visibility tracking for playback hygiene
  const isHeroVisibleRef = useRef<boolean>(true);
  const isDocumentVisibleRef = useRef<boolean>(true);

  const pauseAllVideos = useCallback(() => {
    if (phoneVideoRef.current && !phoneVideoRef.current.paused) {
      phoneVideoRef.current.pause();
    }
    if (videoRefA.current && !videoRefA.current.paused) {
      videoRefA.current.pause();
    }
    if (videoRefB.current && !videoRefB.current.paused) {
      videoRefB.current.pause();
    }
  }, []);

  const resumeActiveVideo = useCallback(() => {
    if (blockVideoRef.current || autoplayRefusedRef.current) return;
    if (isPhoneRef.current) {
      const el = phoneVideoRef.current;
      if (el && el.paused) {
        const p = el.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    } else {
      const activeEl = activeLayerRef.current === "A" ? videoRefA.current : videoRefB.current;
      if (activeEl && activeEl.paused) {
        const p = activeEl.play();
        if (p !== undefined) {
          p.catch(() => {});
        }
      }
    }
  }, []);

  // Playback hygiene 1: IntersectionObserver on hero root (threshold ~0.1)
  // Pause videos and rotation ticker when hero is <10% visible; resume when back
  useEffect(() => {
    const heroEl = containerRef.current;
    if (!heroEl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        isHeroVisibleRef.current = visible;

        if (!visible) {
          pauseAllVideos();
        } else if (isDocumentVisibleRef.current) {
          resumeActiveVideo();
        }
      },
      { threshold: [0, 0.1] }
    );

    observer.observe(heroEl);

    return () => {
      observer.disconnect();
    };
  }, [pauseAllVideos, resumeActiveVideo]);

  // Playback hygiene 2: document.visibilitychange
  // Pause video and ticker on hidden tab; resume when tab is active
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      const isDocVisible = document.visibilityState === "visible";
      isDocumentVisibleRef.current = isDocVisible;

      if (!isDocVisible) {
        pauseAllVideos();
      } else if (isHeroVisibleRef.current) {
        resumeActiveVideo();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pauseAllVideos, resumeActiveVideo]);

  // Initialize diverse non-repeating shuffled playlist on client mount
  useEffect(() => {
    const timer = window.setTimeout(() => {
      // Keep the first clip (and its server-rendered poster) stable so the
      // initial LCP image is never replaced by a late client-side candidate.
      // Everything after it is still shuffled, so rotations stay non-repeating.
      const first = availableVideos[0];
      const rest = [...availableVideos.slice(1)].sort(() => Math.random() - 0.5);
      const shuffled = first ? [first, ...rest] : rest;
      setPlaylist(shuffled);
      playlistRef.current = shuffled;
      setCurrentIndex(0);
      currentIndexRef.current = 0;
      setVideoSrcA(shuffled[0]?.videoUrl || "");
      setVideoSrcB(shuffled.length > 1 ? shuffled[1].videoUrl : shuffled[0]?.videoUrl || "");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [availableVideos]);

  const currentVideo = playlist[currentIndex] || availableVideos[0];
  useEffect(() => {
    onVideoChange?.(currentVideo);
  }, [currentVideo, onVideoChange]);

  // Autoplay robustness for phone video (iOS Safari target):
  // Set DOM properties el.muted=true, defaultMuted=true, disableRemotePlayback=true.
  // Call el.play() in an effect and retry on loadeddata / canplay.
  // Catch any rejection (e.g. iOS Low Power Mode) to keep poster visible without throwing.
  useEffect(() => {
    if (!isPhone || blockVideo) return;
    const el = phoneVideoRef.current;
    if (!el) return;

    el.muted = true;
    el.defaultMuted = true;
    el.playsInline = true;
    if ("disableRemotePlayback" in el) {
      (el as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    }

    let isCancelled = false;

    const attemptPlay = () => {
      if (isCancelled || !el) return;
      const playPromise = el.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            if (!isCancelled) {
              setAutoplayRefused(false);
              autoplayRefusedRef.current = false;
            }
          })
          .catch(() => {
            if (!isCancelled) {
              // iOS Low Power Mode refuses autoplay — keep poster visible, never throw
              setAutoplayRefused(true);
              autoplayRefusedRef.current = true;
              setIsVideoPlaying(false);
              isVideoPlayingRef.current = false;
              isTransitioningRef.current = false;
            }
          });
      }
    };

    attemptPlay();

    const handleCanPlay = () => {
      if (el.paused) {
        attemptPlay();
      }
    };

    el.addEventListener("loadeddata", handleCanPlay);
    el.addEventListener("canplay", handleCanPlay);

    return () => {
      isCancelled = true;
      el.removeEventListener("loadeddata", handleCanPlay);
      el.removeEventListener("canplay", handleCanPlay);
    };
  }, [isPhone, blockVideo, currentVideo]);

  // Autoplay robustness for desktop active layer
  useEffect(() => {
    if (isPhone || blockVideo) return;
    const activeEl = activeLayer === "A" ? videoRefA.current : videoRefB.current;
    const idleEl = activeLayer === "A" ? videoRefB.current : videoRefA.current;
    if (idleEl && !idleEl.paused) idleEl.pause();
    if (!activeEl) return;

    activeEl.muted = true;
    activeEl.defaultMuted = true;
    activeEl.playsInline = true;
    if ("disableRemotePlayback" in activeEl) {
      (activeEl as HTMLVideoElement & { disableRemotePlayback?: boolean }).disableRemotePlayback = true;
    }

    const playPromise = activeEl.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Desktop autoplay policy catch
      });
    }
  }, [isPhone, blockVideo, activeLayer, videoSrcA, videoSrcB]);

  // Helper to switch to target index with smooth dual-buffer crossfade on desktop
  // or single-video poster-underlay transition on phone.
  const goToIndex = useCallback((targetIndex: number) => {
    if (isTransitioningRef.current) return;
    const currentList = playlistRef.current;
    const currentIdx = currentIndexRef.current;
    const clamped = targetIndex >= currentList.length ? 0 : targetIndex;
    if (clamped === currentIdx) return;

    isTransitioningRef.current = true;
    setCurrentIndex(clamped);
    currentIndexRef.current = clamped;
    setIsVideoPlaying(false);
    isVideoPlayingRef.current = false;
    setAutoplayRefused(false);
    autoplayRefusedRef.current = false;
    bufferingTicksRef.current = 0;

    // Clean up any existing transition listener from previous cycle
    if (transitionCleanupRef.current) {
      transitionCleanupRef.current();
      transitionCleanupRef.current = null;
    }

    if (blockVideoRef.current) {
      // Reduced motion or data-saver: no video element to wait for, poster rotates immediately
      isTransitioningRef.current = false;
      return;
    }

    if (isPhoneRef.current) {
      // Phone path: exactly ONE video element.
      // Changing currentIndex updates currentVideo and its src.
      const phoneEl = phoneVideoRef.current;
      if (!phoneEl) {
        isTransitioningRef.current = false;
        return;
      }

      const cleanup = () => {
        phoneEl.removeEventListener("playing", onPlaying);
        phoneEl.removeEventListener("error", onError);
        if (transitionCleanupRef.current === wrappedCleanup) {
          transitionCleanupRef.current = null;
        }
      };

      const onPlaying = () => {
        setIsVideoPlaying(true);
        isVideoPlayingRef.current = true;
        isTransitioningRef.current = false;
        cleanup();
      };

      const onError = () => {
        isTransitioningRef.current = false;
        cleanup();
      };

      phoneEl.addEventListener("playing", onPlaying);
      phoneEl.addEventListener("error", onError);

      // Timeout fallback: if phone clip takes >6s to start, unlock transition so rotation never hangs
      const safetyTimer = window.setTimeout(() => {
        if (isTransitioningRef.current) {
          isTransitioningRef.current = false;
          cleanup();
        }
      }, 6000);

      const wrappedCleanup = () => {
        window.clearTimeout(safetyTimer);
        cleanup();
      };
      transitionCleanupRef.current = wrappedCleanup;
      return;
    }

    // Desktop path: dual-buffer A/B crossfade on full-size videoUrl
    const nextLayer = activeLayerRef.current === "A" ? "B" : "A";
    const nextSrc = currentList[clamped]?.videoUrl || availableVideos[0]?.videoUrl || "";

    if (nextLayer === "A") {
      setVideoSrcA(nextSrc);
    } else {
      setVideoSrcB(nextSrc);
    }

    setActiveLayer(nextLayer);
    activeLayerRef.current = nextLayer;

    const nextVideoEl = nextLayer === "A" ? videoRefA.current : videoRefB.current;
    if (!nextVideoEl) {
      isTransitioningRef.current = false;
      return;
    }

    const cleanup = () => {
      nextVideoEl.removeEventListener("playing", onPlaying);
      nextVideoEl.removeEventListener("error", onError);
      if (transitionCleanupRef.current === wrappedCleanup) {
        transitionCleanupRef.current = null;
      }
    };

    const onPlaying = () => {
      setIsVideoPlaying(true);
      isVideoPlayingRef.current = true;
      isTransitioningRef.current = false;
      cleanup();
    };

    const onError = () => {
      isTransitioningRef.current = false;
      cleanup();
    };

    nextVideoEl.addEventListener("playing", onPlaying);
    nextVideoEl.addEventListener("error", onError);

    const safetyTimer = window.setTimeout(() => {
      if (isTransitioningRef.current) {
        isTransitioningRef.current = false;
        cleanup();
      }
    }, 6000);

    const wrappedCleanup = () => {
      window.clearTimeout(safetyTimer);
      cleanup();
    };
    transitionCleanupRef.current = wrappedCleanup;
  }, [availableVideos]);

  const handleNext = useCallback(() => {
    goToIndex(currentIndexRef.current + 1);
  }, [goToIndex]);

  // Clean up any pending transition listeners on unmount
  useEffect(() => {
    return () => {
      if (transitionCleanupRef.current) {
        transitionCleanupRef.current();
        transitionCleanupRef.current = null;
      }
    };
  }, []);

  // Main 5-second rotation ticker with playback hygiene and buffering guards
  useEffect(() => {
    progressTickRef.current = 0;
    bufferingTicksRef.current = 0;

    const timer = setInterval(() => {
      // 1. Hygiene: pause when hero root is <10% visible or document is hidden
      if (!isHeroVisibleRef.current || !isDocumentVisibleRef.current) {
        return;
      }

      // 2. Buffering guard: if video is enabled, but clip is still buffering,
      // skip advancing until it is actually playing so a clip is never cut mid-buffer.
      const isActivelyDisplaying =
        blockVideoRef.current || autoplayRefusedRef.current || isVideoPlayingRef.current;

      if (!isActivelyDisplaying) {
        bufferingTicksRef.current += 1;
        // Safety: if stuck buffering for >8 seconds, advance to next video to prevent hanging
        if (bufferingTicksRef.current >= TOTAL_TICKS * 1.6) {
          bufferingTicksRef.current = 0;
          progressTickRef.current = 0;
          handleNext();
        }
        return;
      }

      bufferingTicksRef.current = 0;
      progressTickRef.current += 1;

      if (progressTickRef.current >= TOTAL_TICKS) {
        // Double check: never cut rotation if currently buffering
        if (!blockVideoRef.current && !isVideoPlayingRef.current && !autoplayRefusedRef.current) {
          return;
        }
        progressTickRef.current = 0;
        handleNext();
      }
    }, TICK_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [handleNext]);

  // Poster is visible when video is blocked, when autoplay is refused, or while video is buffering
  const posterOnly = blockVideo || autoplayRefused || !isVideoPlaying;

  // Phone video source: preferred CDN-verified mobile URL if present, otherwise full video URL
  const mobileSrc = currentVideo.mobileVideoUrl ?? currentVideo.videoUrl;

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-black select-none">
      {/* Underlying Instant High-Res Poster Layer — never shows black void */}
      {/* Direct local WebP: already optimised, so skip the /_next/image hop. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={availableVideos[0]?.posterUrl ?? ""}
        alt={availableVideos[0]?.title ?? ""}
        fetchPriority="high"
        decoding="async"
        style={{
          position: "absolute",
          width: "calc(100% + 2px)",
          height: "calc(100% + 2px)",
          top: "-1px",
          left: "-1px",
        }}
        className={`object-cover transition-opacity duration-1000 ${
          posterOnly ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Phone path: exactly ONE video element, phone-sized src, no dual-buffer preload */}
      {isPhone && !blockVideo && videosReady && (
        <video
          ref={phoneVideoRef}
          key="hero-mobile-video"
          src={mobileSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disableRemotePlayback
          onPlaying={() => {
            setIsVideoPlaying(true);
            isVideoPlayingRef.current = true;
          }}
          onWaiting={() => {
            setIsVideoPlaying(false);
            isVideoPlayingRef.current = false;
          }}
          onError={() => {
            handleNext();
          }}
          className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
            isVideoPlaying && !autoplayRefused
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        />
      )}

      {/* Desktop path: Layer A Video (dual buffer) */}
      {!isPhone && !blockVideo && videosReady && (
        <video
          ref={videoRefA}
          src={videoSrcA}
          autoPlay={activeLayer === "A"}
          playsInline
          muted
          loop
          preload={activeLayer === "A" ? "metadata" : "none"}
          disableRemotePlayback
          onPlaying={() => {
            if (activeLayer === "A") {
              setIsVideoPlaying(true);
              isVideoPlayingRef.current = true;
            }
          }}
          onWaiting={() => {
            if (activeLayer === "A") {
              setIsVideoPlaying(false);
              isVideoPlayingRef.current = false;
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
            activeLayer === "A" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          onError={() => {
            handleNext();
          }}
        />
      )}

      {/* Desktop path: Layer B Video (dual buffer) */}
      {!isPhone && !blockVideo && videosReady && (
        <video
          ref={videoRefB}
          src={videoSrcB}
          autoPlay={activeLayer === "B"}
          playsInline
          muted
          loop
          preload={activeLayer === "B" ? "metadata" : "none"}
          disableRemotePlayback
          onPlaying={() => {
            if (activeLayer === "B") {
              setIsVideoPlaying(true);
              isVideoPlayingRef.current = true;
            }
          }}
          onWaiting={() => {
            if (activeLayer === "B") {
              setIsVideoPlaying(false);
              isVideoPlayingRef.current = false;
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover filter brightness-[0.76] contrast-[1.08] transition-opacity duration-1000 ease-in-out ${
            activeLayer === "B" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
          onError={() => {
            handleNext();
          }}
        />
      )}

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
