"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/lib/hooks";

const CELL = 21; // grid pitch in CSS px — fine, like a wall of tiles
const GAP = 1.2;
const RADIUS = 130; // cursor influence radius — a tight, local response
const MAX_LIFT = 24; // peak extrusion in px

/**
 * A wall of dark cubes that extrude toward the viewer under the cursor
 * (or a moving finger), like pressure on a quantized surface. Pure 2D
 * canvas — the third dimension is drawn, not computed: each lifted cube
 * gets an offset front face plus shaded right/bottom side faces.
 *
 * The pointer position and its energy are lerped, so the bulge glides
 * after the cursor and settles when it stops. Rendering runs only while
 * the field is on screen and something is actually moving.
 */
export default function CubeField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let seeds: Float32Array = new Float32Array(0);

    // pointer state (lerped)
    const target = { x: -9999, y: -9999, energy: 0 };
    const soft = { x: -9999, y: -9999, energy: 0 };

    let raf = 0;
    let running = false;
    let inView = false;
    let needsRender = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL) + 1;
      rows = Math.ceil(height / CELL) + 1;
      // static per-cell character so the wall isn't sterile at rest
      seeds = new Float32Array(cols * rows);
      let s = 1234567;
      for (let i = 0; i < seeds.length; i++) {
        s = (s * 16807) % 2147483647;
        seeds[i] = s / 2147483647;
      }
      needsRender = true;
    };

    type Lifted = {
      x: number;
      y: number;
      ox: number;
      oy: number;
      lift: number;
      influence: number;
      seed: number;
    };
    const lifted: Lifted[] = [];

    const quad = (
      ax: number, ay: number, bx: number, by: number,
      cx2: number, cy2: number, dx2: number, dy2: number,
    ) => {
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.lineTo(cx2, cy2);
      ctx.lineTo(dx2, dy2);
      ctx.closePath();
      ctx.fill();
    };

    const draw = () => {
      // gap tone — slightly darker than the tiles, so the grid reads
      ctx.fillStyle = "hsl(220 8% 76%)";
      ctx.fillRect(0, 0, width, height);

      const size = CELL - GAP;
      lifted.length = 0;

      // pass 1 — resting tiles, and the dark sockets under lifted cubes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL;
          const y = r * CELL;
          const cx = x + size / 2;
          const cy = y + size / 2;

          const dx = cx - soft.x;
          const dy = cy - soft.y;
          const dist = Math.hypot(dx, dy);
          const falloff = Math.max(0, 1 - dist / RADIUS);
          // smooth bell instead of linear cone
          const influence = falloff * falloff * (3 - 2 * falloff) * soft.energy;

          const seed = seeds[r * cols + c] ?? 0.5;
          const lift = influence * MAX_LIFT * (0.8 + seed * 0.4);

          if (lift > 0.5) {
            // contact shadow: the socket the cube rose out of
            ctx.fillStyle = "hsl(221 9% 58%)";
            ctx.fillRect(x, y, size, size);
            // cubes lean radially away from the cursor; the one directly
            // underneath comes straight at the viewer
            // gentle lean — enough to read as tilt, never detaching
            // a cube from its socket
            const inv = dist > 1 ? 1 / dist : 0;
            lifted.push({
              x,
              y,
              ox: dx * inv * lift * 0.28,
              oy: dy * inv * lift * 0.28,
              lift,
              influence,
              seed,
            });
          } else {
            const rest = 84 + seed * 3.5;
            ctx.fillStyle = `hsl(220 12% ${rest}%)`;
            ctx.fillRect(x, y, size, size);
          }
        }
      }

      // pass 2 — painter's order: closest to the viewer drawn last
      lifted.sort((a, b) => a.lift - b.lift);

      for (const cube of lifted) {
        const { x, y, ox, oy, lift, influence, seed } = cube;
        const grow = lift * 0.22;
        const fs = size + grow;
        const fx = x + ox - grow / 2;
        const fy = y + oy - grow / 2;
        const front = 88 + influence * 7 + seed * 2;

        // flanks on the trailing edges (light from the top-left) —
        // on a white material, depth lives in the shadowed sides
        if (ox > 0.3) {
          ctx.fillStyle = `hsl(219 10% ${front * 0.86}%)`; // lit left flank
          quad(x, y, x, y + size, fx, fy + fs, fx, fy);
        } else if (ox < -0.3) {
          ctx.fillStyle = `hsl(220 9% ${front * 0.68}%)`; // shaded right flank
          quad(x + size, y, x + size, y + size, fx + fs, fy + fs, fx + fs, fy);
        }
        if (oy > 0.3) {
          ctx.fillStyle = `hsl(219 10% ${front * 0.92}%)`; // lit top flank
          quad(x, y, x + size, y, fx + fs, fy, fx, fy);
        } else if (oy < -0.3) {
          ctx.fillStyle = `hsl(220 9% ${front * 0.58}%)`; // dark bottom flank
          quad(x, y + size, x + size, y + size, fx + fs, fy + fs, fx, fy + fs);
        }

        // front face — subtle top-left sheen so it reads as a plane, not a dot
        const g = ctx.createLinearGradient(fx, fy, fx + fs, fy + fs);
        g.addColorStop(0, `hsl(219 14% ${Math.min(front * 1.06, 97)}%)`);
        g.addColorStop(1, `hsl(220 11% ${front * 0.94}%)`);
        ctx.fillStyle = g;
        ctx.fillRect(fx, fy, fs, fs);
      }
    };

    const tick = () => {
      raf = 0;
      soft.x += (target.x - soft.x) * 0.16;
      soft.y += (target.y - soft.y) * 0.16;
      soft.energy += (target.energy - soft.energy) * 0.1;

      const still =
        Math.abs(target.x - soft.x) < 0.4 &&
        Math.abs(target.y - soft.y) < 0.4 &&
        Math.abs(target.energy - soft.energy) < 0.004;

      draw();
      needsRender = false;

      // keep animating until the bulge has fully settled (or we left view)
      if (still || !inView) {
        running = false;
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    const wake = () => {
      if (!running && inView) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (x: number, y: number) => {
      const rect = canvas.getBoundingClientRect();
      target.x = x - rect.left;
      target.y = y - rect.top;
      target.energy = 1;
      wake();
    };
    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    const onPointerLeave = () => {
      target.energy = 0;
      wake();
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) onMove(t.clientX, t.clientY);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && needsRender) wake();
      },
      { rootMargin: "60px" },
    );
    observer.observe(canvas);

    resize();
    draw();

    const ro = new ResizeObserver(() => {
      resize();
      wake();
      if (!running) draw();
    });
    ro.observe(canvas);

    // Reduced motion: the wall stays a still material texture.
    if (!reduced) {
      canvas.addEventListener("pointermove", onPointerMove);
      canvas.addEventListener("pointerleave", onPointerLeave);
      canvas.addEventListener("touchmove", onTouchMove, { passive: true });
      canvas.addEventListener("touchend", onPointerLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onPointerLeave);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block h-full w-full ${className}`}
    />
  );
}
