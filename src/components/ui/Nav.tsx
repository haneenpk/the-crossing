"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { EASE } from "@/lib/motion";

const LINKS = [
  { href: "#overview", label: "Overview" },
  { href: "#beginning", label: "History" },
  { href: "#moonwalk", label: "The Moon" },
  { href: "#beyond", label: "Beyond" },
  { href: "#missions", label: "Missions" },
];

/**
 * Floating glass dock. Absent during the opening shot — it surfaces only
 * once the visitor has pushed through the hatch, so the film opens clean.
 */
export default function Nav() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setVisible(y > window.innerHeight * 1.4);
  });

  return (
    <motion.header
      initial={false}
      animate={{
        y: visible ? 0 : -24,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      transition={{ duration: 0.8, ease: EASE }}
      className="fixed inset-x-0 top-5 z-50 flex justify-center px-4"
    >
      <nav
        aria-label="Scenes"
        className="glass flex items-center gap-8 rounded-full py-3 pr-7 pl-6"
      >
        <a href="#hero" className="telemetry bright">
          The Crossing
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="group relative text-[13px] text-ivory/60 transition-colors duration-300 hover:text-ivory"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember/80 transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}
