"use client";

import {
  useCallback,
  useEffect,
  useState,
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

/**
 * True once the element is within `margin` of the viewport, and stays true.
 *
 * The films below the fold are several megabytes each. Fetching them at
 * mount starves the one film the visitor is actually looking at, so they
 * wait until the scroll is nearly on them — with enough margin that the
 * first frame is decoded before it's seen.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  margin = "100% 0px",
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      { rootMargin: margin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin, near]);

  return near;
}

type ThinConnection = {
  saveData?: boolean;
  effectiveType?: string;
  addEventListener?: (type: "change", fn: () => void) => void;
  removeEventListener?: (type: "change", fn: () => void) => void;
};

const connection = (): ThinConnection | undefined =>
  (navigator as Navigator & { connection?: ThinConnection }).connection;

/**
 * True when the visitor has asked for less data or is on a slow radio.
 * Chromium-only, so an absent API means "assume a fat pipe" — the same
 * assumption we made before the API existed.
 */
export function useThinConnection(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const c = connection();
      c?.addEventListener?.("change", onChange);
      return () => c?.removeEventListener?.("change", onChange);
    },
    () => {
      const c = connection();
      if (!c) return false;
      return Boolean(c.saveData) || /(^|-)([23]g|slow-2g)$/.test(c.effectiveType ?? "");
    },
    () => false,
  );
}
