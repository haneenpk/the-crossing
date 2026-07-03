"use client";

import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import { fade } from "@/lib/motion";

/**
 * Scene 01 — the overview effect.
 * Pure typography: the statement is typeset into the dark sky while the
 * moonrise scenery (owned by MoonPassage) wakes up behind it.
 */
export default function Overview() {
  return (
    <section
      id="overview"
      aria-label="The overview effect"
      className="relative flex min-h-[130svh] items-center"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-40 sm:px-10">
        <SectionLabel index="01">The overview effect</SectionLabel>

        <h2 className="mt-10 font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.08] tracking-tight text-ivory">
          <RevealLines
            lines={[
              <>From here, there are no borders.</>,
              <>No noise. Only a thin blue line</>,
              <>
                holding everything you&rsquo;ve <span className="italic">ever loved.</span>
              </>,
            ]}
          />
        </h2>

        <motion.p
          {...fade(0.3)}
          className="mt-12 max-w-[38ch] text-[15px] leading-[1.75] text-ivory/65 sm:text-base"
        >
          Astronauts call it the overview effect — the quiet rearrangement that
          happens when you see Earth hanging in the dark, whole, and small
          enough to cover with your thumb. No one comes back the same. The
          journey out, it turns out, was always a journey inward.
        </motion.p>
      </div>
    </section>
  );
}
