"use client";

import { useEffect, useRef, useState } from "react";

const DURATION = 4000; // 4s fill
const TARGET = 98; // final score
const R = 80;
const C = 2 * Math.PI * R;
const TICKS = 72;

export default function Preloader() {
  const [phase, setPhase] = useState<"run" | "fade" | "done">("run");
  const numRef = useRef<HTMLSpanElement | null>(null);
  const arcRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    const setArc = (frac: number) => {
      if (arcRef.current)
        arcRef.current.style.strokeDashoffset = String(C * (1 - frac));
    };
    const setNum = (v: number) => {
      if (numRef.current) numRef.current.textContent = String(v);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setNum(TARGET);
      setArc(TARGET / 100);
      const t = setTimeout(() => setPhase("fade"), 500);
      return () => clearTimeout(t);
    }

    let raf = 0;
    let start = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // easeOutCubic
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / DURATION);
      const e = ease(p);
      setNum(Math.round(TARGET * e));
      setArc((TARGET / 100) * e);
      if (p < 1) raf = requestAnimationFrame(step);
      else setPhase("fade");
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden
      onTransitionEnd={() => {
        if (phase === "fade") setPhase("done");
      }}
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ease-out ${
        phase === "fade" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative size-[180px]">
        {/* dark puck */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 36%, #1b1c1f 0%, #0c0d0f 58%, #050506 100%)",
            boxShadow:
              "inset 0 2px 4px rgba(255,255,255,0.05), inset 0 -12px 34px rgba(0,0,0,0.85), 0 24px 70px rgba(0,0,0,0.7)",
          }}
        />

        {/* tick marks */}
        <svg viewBox="0 0 180 180" className="absolute inset-0 size-full">
          {Array.from({ length: TICKS }).map((_, i) => {
            const a = (i / TICKS) * Math.PI * 2;
            const x1 = 90 + Math.cos(a) * 62;
            const y1 = 90 + Math.sin(a) * 62;
            const x2 = 90 + Math.cos(a) * 73;
            const y2 = 90 + Math.sin(a) * 73;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(255,255,255,0.10)"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* progress ring (starts at top, fills clockwise) */}
        <svg viewBox="0 0 180 180" className="absolute inset-0 size-full -rotate-90">
          <defs>
            <linearGradient id="scoreArc" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#2f5cff" />
              <stop offset="55%" stopColor="#9cc0ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="scoreGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.4" />
            </filter>
          </defs>
          {/* faint full trail */}
          <circle
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="3.5"
          />
          {/* glow underlay */}
          <circle
            ref={arcRef}
            cx="90"
            cy="90"
            r={R}
            fill="none"
            stroke="url(#scoreArc)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={C}
            filter="url(#scoreGlow)"
            opacity="0.9"
          />
        </svg>

        {/* score number */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            ref={numRef}
            className="font-display text-[60px] font-semibold leading-none tracking-[-3px] text-white"
          >
            0
          </span>
        </div>
      </div>
    </div>
  );
}
