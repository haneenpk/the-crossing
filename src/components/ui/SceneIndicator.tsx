"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const SCENES = ["hero", "overview", "beginning", "moonwalk", "beyond", "missions", "return"];

/**
 * Quiet telemetry in the corner: `03 / 07`.
 * Watches which scene currently crosses the middle of the viewport.
 */
export default function SceneIndicator() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = SCENES.indexOf(entry.target.id);
            if (i !== -1) setCurrent(i);
          }
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const id of SCENES) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <motion.aside
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6, ease: EASE, delay: 2.4 }}
      className="telemetry fixed bottom-6 left-6 z-50 hidden select-none sm:block"
    >
      {String(current + 1).padStart(2, "0")}
      <span className="text-ivory/25"> / {String(SCENES.length).padStart(2, "0")}</span>
    </motion.aside>
  );
}
