"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import { fade } from "@/lib/motion";

/**
 * Scene 03 — the walk.
 * The lunar image is presented as a framed editorial panel (it is not a
 * 4K asset — the frame is the honest, art-directed answer). Inside the
 * frame: scroll parallax plus a ±1° pointer tilt, barely perceptible.
 */
export default function Moonwalk() {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const tiltX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 });

  const onPointerMove = (e: React.PointerEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    tiltY.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    tiltX.set(((e.clientY - rect.top) / rect.height - 0.5) * -2);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  return (
    <section
      ref={ref}
      id="moonwalk"
      aria-label="Standing on the Moon"
      className="relative mx-auto max-w-7xl px-6 py-40 sm:px-10 sm:py-56"
    >
      <div className="grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionLabel index="03">Sea of Tranquility</SectionLabel>
          <h2 className="mt-10 font-display text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.06] tracking-tight text-ivory">
            <RevealLines
              lines={[<>Twelve people</>, <>have <span className="italic">stood here.</span></>]}
            />
          </h2>
          <motion.p
            {...fade(0.25)}
            className="mt-10 max-w-[36ch] text-[15px] leading-[1.75] text-ivory/65"
          >
            Between 1969 and 1972, twelve humans walked on another world. Their
            bootprints are still there — no wind, no rain, nothing to erase
            them for a million years. The Moon keeps a perfect memory of the
            briefest visit we ever paid.
          </motion.p>
        </div>

        <div className="lg:col-span-8" style={{ perspective: "1200px" }}>
          <motion.div
            ref={frameRef}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={{ rotateX: tiltX, rotateY: tiltY }}
            {...fade(0.15)}
            className="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-[0_40px_80px_-24px_rgba(0,0,0,0.8)]"
          >
            <motion.div className="absolute inset-0 scale-[1.16]" style={{ y: imageY }}>
              <Image
                src="/media/moonwalk.jpg"
                alt="An astronaut standing on the lunar surface, an enormous Earth rising over the horizon"
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            </motion.div>
            {/* Atmosphere held at the frame's lower edge */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-void/60 to-transparent" />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </motion.div>
          <motion.p {...fade(0.45)} className="telemetry mt-6 text-right">
            384,400 km from home
          </motion.p>
        </div>
      </div>
    </section>
  );
}
