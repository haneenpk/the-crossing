"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import SectionLabel from "@/components/ui/SectionLabel";
import RevealLines from "@/components/ui/RevealLines";
import { DUR, EASE } from "@/lib/motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const EVENTS = [
  {
    year: "1957",
    title: "Sputnik 1",
    line: "A 58-centimetre sphere beeps from orbit, and the ceiling of the world quietly moves.",
  },
  {
    year: "1961",
    title: "Vostok 1",
    line: "Yuri Gagarin becomes the first human to see the whole planet from outside it.",
  },
  {
    year: "1969",
    title: "Apollo 11",
    line: "Two people stand on the Moon while six hundred million watch from home.",
  },
  {
    year: "1977",
    title: "Voyager 1 & 2",
    line: "Twin probes leave for the outer planets. Half a century on, both are still calling back.",
  },
  {
    year: "1990",
    title: "Hubble",
    line: "An eye lifted above the atmosphere rewrites every textbook it touches.",
  },
  {
    year: "1998",
    title: "International Space Station",
    line: "A home in orbit — continuously inhabited for more than a quarter of a century.",
  },
  {
    year: "2021",
    title: "James Webb Space Telescope",
    line: "A mirror cold enough to watch the first galaxies switch on.",
  },
  {
    year: "2027",
    title: "Artemis III",
    line: "The next bootprints on the Moon — the first since 1972.",
  },
];

/**
 * Scene 02 — the beginning.
 * A vertical line draws itself down the page as you scroll, threading
 * eight glass cards. History as a single continuous gesture.
 */
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 62%",
            end: "bottom 78%",
            scrub: 0.6,
          },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beginning"
      aria-label="Timeline of exploration"
      className="relative mx-auto max-w-6xl px-6 py-40 sm:px-10 sm:py-56"
    >
      <SectionLabel index="02">The beginning</SectionLabel>

      <h2 className="mt-10 max-w-3xl font-display text-[clamp(2.4rem,6vw,5.2rem)] leading-[1.05] tracking-tight text-ivory">
        <RevealLines lines={[<>We learned</>, <>to <span className="italic">leave.</span></>]} />
      </h2>

      <div className="relative mt-24 sm:mt-32">
        {/* The thread */}
        <div
          aria-hidden
          className="absolute left-[7px] top-0 h-full w-px bg-ivory/10 sm:left-1/2"
        />
        <div
          ref={lineRef}
          aria-hidden
          className="absolute left-[7px] top-0 h-full w-px origin-top bg-linear-to-b from-ember/80 to-ember/30 sm:left-1/2"
        />

        <ol className="space-y-16 sm:space-y-24">
          {EVENTS.map((event, i) => {
            const right = i % 2 === 1;
            return (
              <li
                key={event.year}
                className={`relative pl-12 sm:w-[calc(50%-3rem)] sm:pl-0 ${
                  right ? "sm:ml-auto" : ""
                }`}
              >
                {/* Node on the thread */}
                <span
                  aria-hidden
                  className={`absolute top-2 left-[3px] size-[9px] rounded-full bg-ember shadow-[0_0_12px_rgba(217,142,95,0.5)] ${
                    right ? "sm:-left-[52.5px]" : "sm:left-auto sm:-right-[52.5px]"
                  }`}
                />
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-18% 0px" }}
                  transition={{ duration: DUR.base, ease: EASE }}
                  className="glass rounded-2xl p-7 sm:p-8"
                >
                  <p className="telemetry text-ember/90">{event.year}</p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight text-ivory sm:text-[1.7rem]">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-ivory/60 sm:text-[15px]">
                    {event.line}
                  </p>
                </motion.div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
