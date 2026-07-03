"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import StatCounter from "@/components/ui/StatCounter";
import { DUR, EASE, fade } from "@/lib/motion";

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
      <SectionLabel index="05">What comes next</SectionLabel>

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
    </section>
  );
}
