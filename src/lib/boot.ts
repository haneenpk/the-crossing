"use client";

import { useSyncExternalStore } from "react";

/**
 * How ready the opening scene is.
 *
 * The hero is a scrubbed film: scroll sets the playhead. Until the video
 * has data, seeking is a no-op — the page scrolls, the frame doesn't move,
 * and a first-time visitor reads that as a broken site. So the curtain
 * stays down until enough of the film is in hand, and the scroll is held
 * with it. The hero reports what it has; the curtain watches.
 */

/** Fraction of the film that must be buffered before we open. The visitor
 *  spends several seconds crossing the pin, so the tail arrives in time. */
const TARGET = 0.55;

/** Never trap anyone behind the curtain — a thin line still gets in. */
const PATIENCE = 18_000;

export type Boot = { progress: number; open: boolean };

const CLOSED: Boot = { progress: 0, open: false };
let state: Boot = CLOSED;
let timer: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();

function commit(next: Boot) {
  if (next.progress === state.progress && next.open === state.open) return;
  state = next;
  for (const notify of listeners) notify();
}

/** The hero film reporting how much of its duration it holds (0…1). */
export function reportFilm(buffered: number) {
  const progress = Math.min(1, Math.max(0, buffered) / TARGET);
  commit({
    // monotonic: a progress bar that retreats reads worse than one that waits
    progress: Math.max(state.progress, progress),
    open: state.open || progress >= 1,
  });
}

/** Open now — reduced motion, a failed fetch, or out of patience. */
export function openCurtain() {
  commit({ progress: 1, open: true });
}

export function startPatience() {
  timer ??= setTimeout(openCurtain, PATIENCE);
}

function subscribe(notify: () => void) {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

export function useBoot(): Boot {
  return useSyncExternalStore(
    subscribe,
    () => state,
    () => CLOSED,
  );
}
