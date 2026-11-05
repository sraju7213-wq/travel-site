"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to manage body overflow locking.
 * Prevents scroll on the body when a modal/overlay is open.
 * Handles cleanup and restoration properly.
 */
export function useBodyOverflowLock(isLocked: boolean) {
  const previousOverflowRef = useRef<string>("");

  useEffect(() => {
    if (!isLocked) return;

    // Save current overflow state
    previousOverflowRef.current = document.body.style.overflow;
    // Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      // Restore previous overflow state
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, [isLocked]);
}

/**
 * Custom hook to manage body overflow locking with custom cleanup.
 * Use when you need more control over the lock/unlock behavior.
 */
export function useBodyOverflow() {
  const [isLocked, setIsLocked] = useState(false);
  const previousOverflowRef = useRef<string>("");
  const isLockedRef = useRef(isLocked);

  // Keep ref in sync with state
  useEffect(() => {
    isLockedRef.current = isLocked;
  }, [isLocked]);

  const lock = () => {
    if (isLockedRef.current) return;
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setIsLocked(true);
  };

  const unlock = () => {
    if (!isLockedRef.current) return;
    document.body.style.overflow = previousOverflowRef.current;
    setIsLocked(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isLockedRef.current) {
        document.body.style.overflow = previousOverflowRef.current;
      }
    };
  }, []);

  return { lock, unlock, isLocked };
}