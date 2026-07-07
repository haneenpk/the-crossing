"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import { fade } from "@/lib/motion";

/**
 * Scene 05 — the traveler.
 * The film's only close-up. The portrait's own darkness is the page's
 * darkness, so the helmet simply materializes out of the void — no frame,
 * no panel, just presence. A soft edge mask guarantees the seam.
 */
export default function Traveler() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section
      ref={ref}
      id="traveler"
      aria-label="The traveler — inside the suit"
      className="relative mx-auto max-w-7xl px-6 py-40 sm:px-10 sm:py-56"
    >
      <div className="grid items-center gap-16 lg:grid-cols-12">
        <motion.div
          {...fade(0.15)}
          className="relative mx-auto w-full max-w-105 lg:col-span-5"
          style={{ y: imageY }}
        >
          <div className="[mask-image:radial-gradient(120%_115%_at_50%_45%,black_58%,transparent_92%)]">
            <Image
              src="/media/traveler.jpg"
              alt="A close portrait of an astronaut's helmet, the visor black and reflective, every panel of the white suit in sharp detail"
              width={756}
              height={1344}
              sizes="(min-width: 1024px) 32vw, 80vw"
              className="h-auto w-full"
            />
          </div>
          <motion.p {...fade(0.45)} className="telemetry mt-2 text-center">
            EVA suit — 14 layers · internal pressure 4.3 psi
          </motion.p>
        </motion.div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionLabel index="05">The traveler</SectionLabel>
          <h2 className="mt-10 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.06] tracking-tight text-ivory">
            <RevealLines
              lines={[<>Inside the machine,</>, <>a <span className="italic">heartbeat.</span></>]}
            />
          </h2>
          <motion.p
            {...fade(0.25)}
            className="mt-10 max-w-[38ch] text-[15px] leading-[1.75] text-ivory/65"
          >
            Every mission is carried by something almost absurdly fragile — a
            person. The suit is a wearable spacecraft: fourteen layers, its own
            atmosphere, its own weather. But the only part that actually
            explores is the heartbeat inside it.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
