"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * A number that counts up once when it enters the viewport.
 * Formatting stays in the caller's hands via `format`.
 */
export default function StatCounter({
  to,
  format = (v) => Math.round(v).toLocaleString("en-US"),
  duration = 2,
  className = "",
}: {
  to: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, to, duration, format]);

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  );
}
