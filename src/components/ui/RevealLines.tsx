"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DUR, EASE } from "@/lib/motion";

/**
 * Line-by-line mask reveal. Each line lives in an overflow-hidden strip
 * and rises into view with an 80ms stagger — the site's signature text move.
 *
 * The in-view observer sits on the WRAPPER: the moving lines start fully
 * clipped by their strips, and IntersectionObserver respects ancestor
 * clipping, so observing the lines themselves would never fire.
 */
export default function RevealLines({
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        // pb/-mb give descenders room inside the clip strip without shifting layout
        <span key={i} className="block overflow-hidden pb-[0.18em] mb-[-0.18em]">
          <motion.span
            className={`block will-change-transform ${lineClassName}`}
            initial={{ y: "130%" }}
            animate={inView ? { y: "0%" } : undefined}
            transition={{ duration: DUR.base, ease: EASE, delay: delay + i * 0.08 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
