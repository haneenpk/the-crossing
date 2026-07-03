"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";
import { useMediaQuery, useMounted } from "@/lib/hooks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scene 00 — the hero.
 *
 * The section pins for four viewport heights while scroll position drives
 * the video's playhead: scrolling pushes the camera through the hatch.
 * The playhead is lerped inside the GSAP ticker so seeking never stutters.
 * Nothing plays on its own — the film waits on its first frame until the
 * visitor moves, because in this site the scroll is the camera.
 */
export default function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);

  const [videoReady, setVideoReady] = useState(false);
  const mounted = useMounted();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const src = isMobile ? "/media/hero-960.mp4" : "/media/hero-1600.mp4";

  useEffect(() => {
    if (reduced || !mounted) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const progress = { value: 0 };

    // The film waits on its first frame — only scroll moves the camera.
    // It tracks the Lenis-smoothed scroll position 1:1 (no extra easing),
    // so the frame freezes the instant the page stops moving.
    const seek = () => {
      if (video.readyState < 2 || Number.isNaN(video.duration)) return;
      const target = progress.value * (video.duration - 0.06);
      if (Math.abs(target - video.currentTime) > 0.01) {
        video.currentTime = target;
      }
    };
    gsap.ticker.add(seek);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.value = self.progress;
        },
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
      tl.to(titleRef.current, { opacity: 0, y: -90, scale: 0.97, duration: 0.28 }, 0.02)
        .to(cueRef.current, { opacity: 0, duration: 0.08 }, 0)
        .fromTo(fadeRef.current, { opacity: 0 }, { opacity: 1, duration: 0.16 }, 0.84);
    }, wrap);

    return () => {
      gsap.ticker.remove(seek);
      ctx.revert();
    };
  }, [reduced, mounted, src]);

  return (
    <section id="hero" aria-label="The Crossing — opening scene">
      <div ref={wrapRef} className={reduced ? "h-svh" : "h-[400svh]"}>
        <div className="sticky top-0 h-svh overflow-hidden">
          {/* Poster paints instantly; the film crossfades in over it. */}
          <Image
            src="/media/hero-poster.jpg"
            alt="An astronaut standing in the open hatch of a spacecraft, looking down at Earth glowing at night"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {!reduced && mounted && (
            <video
              ref={videoRef}
              src={src}
              muted
              playsInline
              preload="auto"
              aria-hidden
              onLoadedData={() => setVideoReady(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Legibility: a breath of darkness at top and bottom, never a slab. */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-void/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-void/80 to-transparent" />

          {/* Title block */}
          <div
            ref={titleRef}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.p
              className="telemetry"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: DUR.slow, ease: EASE, delay: 0.4 }}
            >
              A journey in seven scenes
            </motion.p>
            <h1 className="mt-6 font-display text-[clamp(3.5rem,12vw,9.5rem)] leading-[0.95] tracking-tight text-ivory">
              {/* pb/-mb keep the italic descenders inside the clip strip */}
              <span className="block overflow-hidden pb-[0.18em] mb-[-0.18em]">
                <motion.span
                  className="block"
                  initial={{ y: "130%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.7 }}
                >
                  The <span className="italic">Crossing</span>
                </motion.span>
              </span>
            </h1>
            <motion.p
              className="mt-8 max-w-md text-balance text-sm leading-relaxed text-ivory/70 sm:text-base"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: DUR.base, ease: EASE, delay: 1.3 }}
            >
              A short film about leaving home — told at the speed of your scroll.
            </motion.p>
          </div>

          {/* Scroll cue */}
          {!reduced && (
            <div
              ref={cueRef}
              className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-4"
            >
              <motion.span
                className="telemetry"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: DUR.slow, ease: EASE, delay: 2 }}
              >
                Scroll to push through the hatch
              </motion.span>
              <motion.span
                aria-hidden
                className="block h-10 w-px overflow-hidden bg-ivory/15"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.2, duration: DUR.base }}
              >
                <motion.span
                  className="block h-full w-full bg-ivory/70"
                  animate={{ y: ["-100%", "100%"] }}
                  transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
                />
              </motion.span>
            </div>
          )}

          {/* Hand-off into the void of scene 01 */}
          <div ref={fadeRef} className="pointer-events-none absolute inset-0 bg-void opacity-0" />
        </div>
      </div>
    </section>
  );
}
