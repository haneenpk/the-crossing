"use client";

import { motion } from "framer-motion";
import { fade } from "@/lib/motion";

/**
 * Mono telemetry line that opens every scene:
 * `SCENE 03 — SEA OF TRANQUILITY`
 */
export default function SectionLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.p {...fade(0, 1)} className={`telemetry flex items-center gap-4 ${className}`}>
      <span aria-hidden className="inline-block h-px w-10 bg-silver/40" />
      <span>
        Scene {index} — {children}
      </span>
    </motion.p>
  );
}
