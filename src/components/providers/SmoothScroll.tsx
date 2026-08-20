"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useBoot } from "@/lib/boot";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Lenis smooth scroll driven by the GSAP ticker so ScrollTrigger,
 * Lenis and every scrubbed animation share a single clock.
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const { open } = useBoot();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    // Nothing moves until the curtain lifts — see lib/boot.
    if (!open) lenis.stop();

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
    // `open` is read once at setup; the effect below handles the release.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hand the scroll back, and re-measure: the pins were laid out while the
  // films were still arriving.
  useEffect(() => {
    if (!open) return;
    lenisRef.current?.start();
    ScrollTrigger.refresh();
  }, [open]);

  return <>{children}</>;
}
