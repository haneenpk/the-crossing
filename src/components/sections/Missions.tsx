"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useAnimationFrame, useScroll } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import StatCounter from "@/components/ui/StatCounter";
import CubeField from "@/components/ui/CubeField";
import { DUR, EASE, fade } from "@/lib/motion";
import {
  useMediaQuery,
  useMounted,
  useNearViewport,
  useTouchVideoUnlock,
} from "@/lib/hooks";

/**
 * The silver-fabric film, presented as a framed gallery object.
 * Scroll owns its playhead 1:1, exactly like the hero and the moonrise:
 * scrolling down flows the fabric forward, scrolling up reverses it,
 * and it freezes the instant the page stops. Reduced motion gets the
 * still. Never full-bleed — the frame flatters the source far more
 * than fullscreen would.
 */
function FabricPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mounted = useMounted();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  // 6.6 MB, seven scenes down the page — it waits its turn.
  const near = useNearViewport(ref, "150% 0px");
  useTouchVideoUnlock(videoRef);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  useAnimationFrame(() => {
    const video = videoRef.current;
    if (!video || video.readyState < 2 || !video.duration) return;
    const target = scrollYProgress.get() * (video.duration - 0.05);
    if (Math.abs(target - video.currentTime) > 0.01) {
      video.currentTime = target;
    }
  });

  return (
    <motion.div
      ref={ref}
      {...fade(0.15)}
      className="relative aspect-1920/1000 overflow-hidden rounded-2xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)]"
    >
      {reduced || !mounted || !near ? (
        <Image
          src="/media/fabric-poster.jpg"
          alt="A slow wave of liquid silver fabric — an abstraction of the invisible structure of the universe"
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          src="/media/fabric.mp4"
          muted
          playsInline
          preload="auto"
          poster="/media/fabric-poster.jpg"
          aria-label="A slow wave of liquid silver fabric — an abstraction of the invisible structure of the universe"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </motion.div>
  );
}

const MISSIONS = [
  {
    tag: "NASA · Lunar south pole · NET 2027",
    name: "Artemis III",
    line: "The return. A crew descends to the Moon's south pole — the first bootprints since 1972, on ice that may fuel the journeys after.",
    destination: "The Moon",
  },
  {
    tag: "NASA · Jovian system · Arrives 2030",
    name: "Europa Clipper",
    line: "Beneath twenty kilometres of ice, Europa hides an ocean with more water than all of Earth's seas. Clipper flies fifty passes to ask if anything is home.",
    destination: "Europa, Jupiter",
  },
  {
    tag: "NASA · Titan · Arrives 2034",
    name: "Dragonfly",
    line: "A nuclear-powered rotorcraft that will fly across the orange haze of Titan — a world with rivers of methane and the chemistry of a young Earth.",
    destination: "Titan, Saturn",
  },
];

const STATS = [
  {
    label: "Age of the universe",
    value: 13.8,
    format: (v: number) => v.toFixed(1),
    suffix: "B yrs",
  },
  {
    label: "Galaxies, at least",
    value: 2,
    format: (v: number) => Math.round(v).toString(),
    suffix: " trillion",
  },
  {
    label: "Confirmed exoplanets",
    value: 5900,
    format: (v: number) => Math.round(v).toLocaleString("en-US"),
    suffix: "+",
  },
  {
    label: "Humans who have flown",
    value: 700,
    format: (v: number) => Math.round(v).toString(),
    suffix: "+",
  },
];

/**
 * Scene 05 — what comes next.
 * Three glass mission cards and a band of numbers large enough
 * to feel like landscape rather than data.
 */
export default function Missions() {
  return (
    <section
      id="missions"
      aria-label="Future missions and the universe in numbers"
      className="relative mx-auto max-w-7xl px-6 py-40 sm:px-10 sm:py-56"
    >
      <SectionLabel index="06">What comes next</SectionLabel>

      <h2 className="mt-10 font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.05] tracking-tight text-ivory">
        <RevealLines lines={[<>The next</>, <>giant <span className="italic">leaps.</span></>]} />
      </h2>

      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        {MISSIONS.map((mission, i) => (
          <motion.article
            key={mission.name}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: DUR.base, ease: EASE, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className="glass group flex flex-col rounded-2xl p-8 transition-shadow duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.75)]"
          >
            <p className="telemetry">{mission.tag}</p>
            <h3 className="mt-5 font-display text-3xl tracking-tight text-ivory">
              {mission.name}
            </h3>
            <p className="mt-4 flex-1 text-[14px] leading-[1.75] text-ivory/60 sm:text-[15px]">
              {mission.line}
            </p>
            <p className="mt-8 flex items-center gap-3 text-[13px] text-silver">
              <span
                aria-hidden
                className="inline-block size-[7px] rounded-full bg-ember/90 transition-shadow duration-500 group-hover:shadow-[0_0_10px_rgba(217,142,95,0.6)]"
              />
              {mission.destination}
            </p>
          </motion.article>
        ))}
      </div>

      {/* Interlude — the part of the universe no mission can photograph.
          Deliberately framed, never full-bleed: a bright object held in the void. */}
      <div className="mt-36 grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <FabricPanel />
          <motion.p {...fade(0.35)} className="telemetry mt-6">
            Dark matter &amp; dark energy — 95% of everything, still unseen
          </motion.p>
        </div>
        <div className="lg:col-span-5">
          <h3 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12] tracking-tight text-ivory">
            <RevealLines
              lines={[<>Most of it,</>, <>we cannot <span className="italic">see.</span></>]}
            />
          </h3>
          <motion.p
            {...fade(0.25)}
            className="mt-8 max-w-[38ch] text-[14px] leading-[1.75] text-ivory/60 sm:text-[15px]"
          >
            Everything every telescope has ever photographed — every star,
            galaxy and world — is less than five percent of what exists. The
            rest is dark matter and dark energy: an invisible fabric the
            cosmos moves on, bending light around it, holding galaxies
            together, pushing space apart.
          </motion.p>
        </div>
      </div>

      {/* The universe in numbers */}
      <div className="mt-36 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div key={stat.label} {...fade(i * 0.1)}>
            <p className="font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none tracking-tight text-ivory">
              <StatCounter to={stat.value} format={stat.format} />
              <span className="text-ivory/50">{stat.suffix}</span>
            </p>
            <p className="telemetry mt-4">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* The grid — a quantized wall of spacetime that answers the cursor. */}
      <motion.div
        {...fade(0.2)}
        className="relative left-1/2 mt-40 w-screen -translate-x-1/2"
      >
        {/* alpha mask dissolves the tiles into the void at both edges */}
        <div className="relative h-[52svh] min-h-90 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]">
          <CubeField />
        </div>
        <p className="telemetry mt-6 px-6 text-center">
          Spacetime, quantized — trace it and watch it answer
        </p>
      </motion.div>
    </section>
  );
}
