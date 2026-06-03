"use client";

import { useEffect, useRef } from "react";

// Concentric rings copied 1:1 from pattern.svg (viewBox 1068). gs/ge match each
// ring's vertical gradient so signals fade out exactly where the ring fades.
const RINGS = [
  { cx: 534, cy: 534, r: 534, gs: 0, ge: 288 },
  { cx: 534, cy: 485, r: 381, gs: 104, ge: 309 },
  { cx: 534.5, cy: 517.5, r: 286.5, gs: 231, ge: 385 },
];
const RGB = "223,106,27"; // #df6a1b
const S = 1.6; // super-sampling for crisp lines

/**
 * Smooth orange "signal" comets that glide along the borders of the hero's
 * concentric rings and fade where the rings lose opacity (toward the text).
 * Each comet is a single continuous arc stroke (round caps) — no dots —
 * built from contiguous sub-arcs so alpha can taper smoothly along the curve.
 */
export default function HeroSignals() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = Math.round(1068 * S);
    canvas.height = Math.round(1068 * S);
    ctx.scale(S, S);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    type Sig = {
      ring: (typeof RINGS)[number];
      theta: number;
      speed: number;
      len: number;
    };
    const N = 11;
    const sigs: Sig[] = Array.from({ length: N }, (_, i) => ({
      ring: RINGS[i % RINGS.length],
      theta: rnd(-Math.PI * 0.95, 0.05),
      speed: rnd(0.0022, 0.0055) * (Math.random() < 0.5 ? -1 : 1),
      len: rnd(0.18, 0.42),
    }));
    const STEPS = 30; // contiguous sub-arcs → one smooth tapering line

    let raf = 0;
    let running = true;

    const draw = () => {
      ctx.clearRect(0, 0, 1068, 1068);
      ctx.globalCompositeOperation = "lighter";
      for (const s of sigs) {
        s.theta += s.speed;
        if (s.theta > 0.5) s.theta = -Math.PI - 0.5;
        else if (s.theta < -Math.PI - 0.5) s.theta = 0.5;
        const { ring } = s;
        const dir = Math.sign(s.speed) || 1;
        const step = s.len / STEPS;
        for (let i = 0; i < STEPS; i++) {
          const t0 = s.theta - dir * i * step;
          const t1 = s.theta - dir * (i + 1) * step;
          const midY = ring.cy + ring.r * Math.sin((t0 + t1) / 2);
          const ringA = (ring.ge - midY) / (ring.ge - ring.gs);
          if (ringA <= 0) continue;
          const tailA = 1 - i / STEPS;
          const a = Math.min(1, ringA) * tailA * 0.6;
          if (a <= 0.008) continue;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${RGB},${a.toFixed(3)})`;
          ctx.lineWidth = 1.4 + tailA * 2.6;
          // small overlap (step*0.6) keeps the joints seamless
          ctx.arc(
            ring.cx,
            ring.cy,
            ring.r,
            Math.min(t0, t1) - step * 0.6,
            Math.max(t0, t1)
          );
          ctx.stroke();
        }
      }
      if (running) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onVis = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[854px] max-w-none -translate-x-1/2 -scale-y-100 select-none"
    />
  );
}
