"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const QUOTES = [
  {
    text: "We used to look up and wonder about our place among the stars.",
    source: null,
  },
  {
    text: "Out here, distance is measured in lifetimes and light.",
    source: null,
  },
  {
    text: "The cosmos is within us. We are made of star-stuff.",
    source: "Carl Sagan",
  },
];

/**
 * Scene 04 — beyond the map.
 * The section pins while the tesseract image slowly accelerates toward
 * the viewer (its baked-in motion blur sells the speed). Three quotes
 * pass through the fall. The one warm chapter in a cold site.
 */
export default function Beyond() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const quoteRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      quoteRefs.current.forEach((q, i) => {
        if (q) q.style.opacity = i === 2 ? "1" : "0";
      });
      return;
    }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        },
      });

      // The fall: one slow continuous push, total duration normalised to 1.
      tl.fromTo(imageRef.current, { scale: 1 }, { scale: 1.22, duration: 1 }, 0);

      // Three quotes pass through the frame.
      QUOTES.forEach((_, i) => {
        const q = quoteRefs.current[i];
        if (!q) return;
        const start = 0.04 + i * 0.32;
        tl.fromTo(q, { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.1 }, start);
        if (i < QUOTES.length - 1) {
          tl.to(q, { opacity: 0, y: -28, duration: 0.1 }, start + 0.2);
        }
      });
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="beyond" aria-label="Deep space">
      <div ref={wrapRef} className="relative h-[320svh]">
        <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
          <div ref={imageRef} className="absolute inset-0 will-change-transform">
            <Image
              src="/media/tesseract.jpg"
              alt="An astronaut free-falling through a vast golden lattice of shifting geometry"
              fill
              sizes="100vw"
              className="object-cover brightness-[0.85]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-void/35" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[22vh] bg-linear-to-b from-void to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22vh] bg-linear-to-t from-void to-transparent" />

          <div className="absolute top-14 left-6 sm:left-10">
            <SectionLabel index="04">Beyond the map</SectionLabel>
          </div>

          {QUOTES.map((quote, i) => (
            <div
              key={i}
              ref={(el) => {
                quoteRefs.current[i] = el;
              }}
              className="absolute mx-auto max-w-3xl px-8 text-center opacity-0"
            >
              <p className="font-display text-[clamp(1.8rem,4.4vw,3.6rem)] leading-[1.2] tracking-tight text-ivory [text-shadow:0_2px_24px_rgba(5,5,5,0.6)]">
                &ldquo;{quote.text}&rdquo;
              </p>
              {quote.source && <p className="telemetry mt-8">— {quote.source}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
