"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  useMediaQuery,
  useMounted,
  useNearViewport,
  useTouchVideoUnlock,
} from "@/lib/hooks";

/** The dawn completes over this fraction of the passage; beyond it the
 *  lit Moon simply holds. Scrolling back rewinds the sunrise. */
const DAWN_SPAN = 0.4;

/**
 * The moonrise passage — one continuous piece of scenery under two scenes.
 *
 * The video layer is sticky for the full height of everything placed inside
 * (Overview statement + Timeline), and scroll position owns its playhead:
 * scrolling down plays the dawn forward, scrolling up reverses it. The
 * playhead is lerped once per frame so seeking stays smooth, and the
 * backdrop dims back into the void as the passage ends.
 */
export default function MoonPassage({ children }: { children: ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mounted = useMounted();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Hold the download until the scroll is a viewport away: fetching it at
  // mount starves the hero, which is the film actually on screen.
  const near = useNearViewport(wrapRef, "100% 0px");
  useTouchVideoUnlock(videoRef);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end end"],
  });

  // Scroll owns the playhead 1:1 — Lenis already smooths the scroll itself,
  // so the dawn freezes the instant the page stops moving.
  useAnimationFrame(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.duration) return;
    const dawn = Math.min(1, scrollYProgress.get() / DAWN_SPAN);
    const target = dawn * (video.duration - 0.05);
    if (Math.abs(target - video.currentTime) > 0.01) {
      video.currentTime = target;
    }
  });

  // Quietly hand the scenery back to the void as the passage ends.
  const dim = useTransform(scrollYProgress, [0.55, 0.9], [0, 1]);

  return (
    <div ref={wrapRef} className="relative">
      {/* Sticky scenery under the scrolling story */}
      <div aria-hidden className="sticky top-0 h-svh overflow-hidden">
        {/* The still sits under the film at all times: the passage is two
            hundred viewport-heights below the front door, so it may still
            be arriving when the scroll gets here, and a held frame reads
            far better than a black rectangle. */}
        <Image
          src="/media/moonrise-poster.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover brightness-[0.85]"
        />
        {!reduced && mounted && near && (
          <video
            ref={videoRef}
            src="/media/moonrise.mp4"
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover brightness-[0.85]"
          />
        )}

        {/* Editorial shade on the reading side; the Moon stays clean on the right. */}
        <div className="absolute inset-0 bg-linear-to-r from-void/70 via-void/25 to-transparent" />
        {/* Seam out of the hero's darkness */}
        <div className="absolute inset-x-0 top-0 h-[18vh] bg-linear-to-b from-void to-transparent" />
        {/* Scroll-linked dusk — fully dark before the sticky layer releases */}
        <motion.div className="absolute inset-0 bg-void" style={{ opacity: dim }} />
      </div>

      {/* The story scrolls over the scenery */}
      <div className="relative mt-[-100svh]">{children}</div>
    </div>
  );
}
