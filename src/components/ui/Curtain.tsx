"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { openCurtain, startPatience, useBoot } from "@/lib/boot";
import { useMediaQuery } from "@/lib/hooks";

const R = 34;
const CIRCUMFERENCE = 2 * Math.PI * R;

/**
 * The curtain — held down until the opening film can be scrubbed.
 *
 * This site hands the projector to the scroll wheel, which means an
 * unbuffered film looks exactly like a page that won't scroll. So the
 * page is locked and the loading is made visible: the porthole rim fills
 * as the film arrives, and the way in opens when it's there.
 *
 * Reduced motion never sees this — those visitors get stills, and stills
 * need no projector.
 */
export default function Curtain() {
  const { progress, open } = useBoot();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (reduced) {
      openCurtain();
      return;
    }
    startPatience();
  }, [reduced]);

  // Hold the page still while the curtain is down. Lenis is stopped in
  // parallel; this covers the native scroll it doesn't own (and touch).
  useEffect(() => {
    if (reduced || gone) return;
    const html = document.documentElement;
    html.classList.add("is-booting");

    // `overflow: hidden` takes away the scrollbar, not scrollTo — and a
    // reload restores wherever the visitor was, which for a scrubbed film
    // means opening onto a frame that hasn't arrived. Hold the exact
    // position the page opened at until the projector is ready.
    const held = window.scrollY;
    const pin = () => {
      if (window.scrollY !== held) window.scrollTo(0, held);
    };
    window.addEventListener("scroll", pin, { passive: true });

    return () => {
      window.removeEventListener("scroll", pin);
      html.classList.remove("is-booting");
    };
  }, [reduced, gone]);

  if (reduced || gone) return null;

  const percent = Math.round(progress * 100);

  return (
    <motion.div
      className="curtain fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-void"
      initial={{ opacity: 1 }}
      animate={{ opacity: open ? 0 : 1 }}
      transition={{ duration: open ? 0.9 : 0, ease: EASE }}
      onAnimationComplete={() => open && setGone(true)}
      style={{ pointerEvents: open ? "none" : "auto" }}
      role="status"
      aria-live="polite"
      aria-label={`Loading the opening scene, ${percent} percent`}
    >
      {/* The porthole, drawing itself */}
      <div className="relative h-[84px] w-[84px]">
        <svg viewBox="0 0 84 84" className="h-full w-full -rotate-90">
          <circle cx="42" cy="42" r={R} fill="none" stroke="rgba(138,148,166,0.18)" strokeWidth="1.5" />
          <motion.circle
            cx="42"
            cy="42"
            r={R}
            fill="none"
            stroke="rgba(232,234,237,0.9)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center pb-[2px] font-display text-3xl text-ivory">
          C
        </span>
      </div>

      <p className="telemetry">
        Preparing the crossing · {percent}%
      </p>
    </motion.div>
  );
}
