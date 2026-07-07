"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Scene 06 — the return.
 * The 4K still that the film was born from closes the loop: the section
 * opens like an iris — a circle of light widening from the dark, echoing
 * the hatch you left through in scene zero.
 */
export default function Return() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (irisRef.current) irisRef.current.style.clipPath = "circle(120% at 50% 50%)";
      if (contentRef.current) {
        contentRef.current.style.opacity = "1";
        contentRef.current.style.pointerEvents = "auto";
      }
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
      tl.fromTo(
        irisRef.current,
        { clipPath: "circle(9% at 50% 52%)" },
        { clipPath: "circle(120% at 50% 52%)", duration: 0.62 },
        0,
      )
        .fromTo(
          irisRef.current!.firstElementChild,
          { scale: 1.1 },
          { scale: 1, duration: 1 },
          0,
        )
        .fromTo(
          contentRef.current,
          { opacity: 0, y: 44 },
          { opacity: 1, y: 0, duration: 0.3 },
          0.55,
        )
        // The CTA only accepts clicks once it is actually visible.
        .set(contentRef.current, { pointerEvents: "auto" }, 0.55);
    }, wrapRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="return" aria-label="The return">
      <div ref={wrapRef} className="relative h-[260svh]">
        <div className="sticky top-0 h-svh overflow-hidden">
          <div ref={irisRef} className="absolute inset-0 [clip-path:circle(9%_at_50%_52%)]">
            <div className="absolute inset-0 will-change-transform">
              <Image
                src="/media/hatch-4k.jpg"
                alt="The astronaut at the open hatch once more, Earth's city lights below"
                fill
                sizes="100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-void/45" />
          </div>

          <div
            ref={contentRef}
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center opacity-0"
          >
            <p className="telemetry">Scene 07 — The return</p>
            <h2 className="mt-8 max-w-4xl font-display text-[clamp(2.6rem,7vw,6rem)] leading-[1.04] tracking-tight text-ivory">
              Every journey out is a journey <span className="italic">back.</span>
            </h2>
            <p className="mt-8 max-w-md text-balance text-[15px] leading-[1.75] text-ivory/70 sm:text-base">
              We cross the dark so we can turn around — and finally see home.
            </p>

            <Link
              href="https://spotthestation.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="glass group mt-12 inline-flex items-center gap-3 rounded-full px-8 py-4 text-sm text-ivory transition-transform duration-500 ease-out hover:scale-[1.03]"
            >
              Look up tonight — track the station
              <ArrowUpRight
                size={16}
                className="text-ember transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
