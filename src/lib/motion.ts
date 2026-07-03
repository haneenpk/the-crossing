/**
 * Shared motion language.
 * One easing curve, slow cinematic durations, no bounce — ever.
 */
export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const DUR = {
  fast: 0.6,
  base: 1,
  slow: 1.6,
} as const;

/** Fade + rise used for most in-view reveals. */
export const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15% 0px" },
  transition: { duration: DUR.base, ease: EASE, delay },
});

/** Simple fade for atmosphere layers. */
export const fade = (delay = 0, duration: number = DUR.slow) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration, ease: EASE, delay },
});
