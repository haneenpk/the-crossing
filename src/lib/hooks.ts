"use client";

import {
  useCallback,
  useEffect,
  useSyncExternalStore,
  type RefObject,
} from "react";

/**
 * Hydration-safe media query: renders the server fallback first,
 * then snaps to the real value without a setState-in-effect.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const noopSubscribe = () => () => {};

/** True only after hydration — for client-only media elements. */
export function useMounted(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * iOS Safari won't decode a muted video for currentTime seeking until a
 * user gesture has "touched" it. On the first touch anywhere, play+pause
 * the video once to unlock scrubbing. No-op on non-touch devices.
 */
export function useTouchVideoUnlock(ref: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const unlock = () => {
      const video = ref.current;
      if (!video) return;
      video
        .play()
        .then(() => video.pause())
        .catch(() => {});
    };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", unlock);
  }, [ref]);
}
