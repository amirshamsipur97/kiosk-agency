"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { DevService } from "@/lib/dev-services";

// Material borrowed from the Featured Services cards.
const CARD_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";
// Lightweight procedural film grain (inline SVG noise — no asset/library bloat).
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23g)'/%3E%3C/svg%3E\")";

const ICONS = {
  code: "M16 18l6-6-6-6 M8 6l-6 6 6 6",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-4-4",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
} as const;

const ICON_FOR: Record<string, keyof typeof ICONS> = {
  "website-digital-systems": "code",
  "design-systems": "grid",
  "growth-marketing": "chart",
  seo: "search",
  "automation-crm": "bolt",
};

// Multiplayer-style cursor colour + label per service.
const CURSOR: Record<string, { label: string; color: string }> = {
  "website-digital-systems": { label: "Web", color: "#2f6fed" },
  "design-systems": { label: "Design", color: "#1f9d57" },
  "growth-marketing": { label: "Growth", color: "#e07b1a" },
  seo: { label: "SEO", color: "#e0479e" },
  "automation-crm": { label: "Automation", color: "#c0392b" },
};

function Icon({ name, className }: { name: keyof typeof ICONS; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

type Tok = { t: string; c: string };
const COLOR: Record<string, string> = {
  prompt: "#68cc58",
  kw: "#737a7f",
  num: "#464a4d",
  cap: "#ebeced",
  desc: "#ffc446",
  out: "#d7ff3e",
  punc: "#737a7f",
};

function buildLines(service: DevService): Tok[][] {
  const lines: Tok[][] = [
    [
      { t: "$ ", c: "prompt" },
      { t: "kiosk services --get ", c: "kw" },
      { t: `"${service.slug}"`, c: "desc" },
    ],
    [],
    [{ t: `# ${service.name}`, c: "kw" }],
    [],
  ];
  service.capabilities.forEach((cap, i) => {
    lines.push([
      { t: `${String(i + 1).padStart(2, "0")}  `, c: "num" },
      { t: cap.capability, c: "cap" },
      { t: "  —  ", c: "punc" },
      { t: cap.description, c: "desc" },
      { t: "  →  ", c: "punc" },
      { t: cap.outcome, c: "out" },
    ]);
  });
  return lines;
}

export default function DevTerminal({ services }: { services: DevService[] }) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const rafRef = useRef<number | null>(null);
  const [hovering, setHovering] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  // Custom Figma-style cursor that eases toward the pointer over the panel.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const c = cur.current;
      const t = target.current;
      c.x += (t.x - c.x) * 0.25;
      c.y += (t.y - c.y) * 0.25;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${c.x - 2}px, ${c.y - 2}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.current = { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const handleEnter = (e: MouseEvent<HTMLDivElement>) => {
    const el = panelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const p = { x: e.clientX - r.left, y: e.clientY - r.top };
    target.current = p;
    cur.current = { ...p };
    setHovering(true);
  };

  const service = services[active];
  const cursor = CURSOR[service.slug] ?? { label: service.name, color: "#d7ff3e" };
  const lines = buildLines(service);
  const total = lines.reduce(
    (sum, line) => sum + line.reduce((s, tok) => s + tok.t.length, 0),
    0,
  );

  // Natural typewriter: reveal characters over time whenever the tab changes.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRevealed(0);
    let shown = 0;
    let last = performance.now();
    const SPEED = 0.05; // chars per ms ≈ 50 cps — relaxed, natural typing
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      shown = Math.min(total, shown + dt * SPEED);
      setRevealed(Math.floor(shown));
      if (shown < total) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const typing = revealed < total;
  let offset = 0;

  return (
    <div className="mt-12 flex flex-col gap-12 md:mt-16">
      {/* Service tab row — centred */}
      <div className="relative">
        <div className="flex justify-center gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {services.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => setActive(i)}
                className="flex shrink-0 flex-col items-center gap-3"
              >
                <span
                  className="flex size-14 items-center justify-center rounded-2xl border transition-colors duration-300"
                  style={{
                    borderColor: "rgba(212,228,254,0.19)",
                    backgroundImage: on
                      ? "linear-gradient(to bottom, rgba(255,255,255,0.10), rgba(255,255,255,0.02))"
                      : "none",
                  }}
                >
                  <Icon
                    name={ICON_FOR[s.slug] ?? "layers"}
                    className={`size-7 transition-colors duration-300 ${
                      on ? "text-accent" : "text-[rgba(239,245,255,0.55)]"
                    }`}
                  />
                </span>
                <span
                  className={`whitespace-nowrap text-[13.9px] transition-colors duration-300 ${
                    on ? "text-[rgba(252,253,255,0.94)]" : "text-[rgba(239,245,255,0.69)]"
                  }`}
                >
                  {s.name.split(" ")[0].replace("&", "")}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal panel — Featured Services material, square corners */}
      <div
        ref={panelRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        className="relative overflow-hidden [cursor:none]"
        style={{
          border: "1px solid rgba(212,228,254,0.19)",
          backgroundImage: CARD_SHEEN,
        }}
      >
        {/* header */}
        <div
          className="flex items-center justify-between px-4"
          style={{ borderBottom: "1px solid rgba(212,228,254,0.19)" }}
        >
          <div className="flex items-center gap-2 py-3.5">
            <span
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13.9px] text-[rgba(252,253,255,0.94)]"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(212,228,254,0.19), rgba(228,238,255,0.10))",
              }}
            >
              <Icon name={ICON_FOR[service.slug] ?? "layers"} className="size-3.5 text-accent" />
              {service.name}
            </span>
          </div>
          <span className="hidden text-[11.8px] text-[rgba(239,245,255,0.5)] sm:block">
            kiosk@services ~ %
          </span>
        </div>

        {/* code / terminal body */}
        <div className="relative bg-[#05050a]">
          <div className="overflow-x-auto p-4 font-mono text-[14px] leading-[24px] min-h-[420px]">
            {lines.map((line, li) => {
              const lineHasContent = line.length > 0;
              return (
                <div key={li} className="flex gap-6">
                  <span className="w-6 shrink-0 select-none text-right text-[#2f3336]">
                    {li + 1}
                  </span>
                  <span className="whitespace-pre-wrap break-words">
                    {lineHasContent
                      ? line.map((tok, ti) => {
                          const start = offset;
                          offset += tok.t.length;
                          const shown = Math.max(
                            0,
                            Math.min(tok.t.length, revealed - start),
                          );
                          const atCursor =
                            typing && revealed >= start && revealed < start + tok.t.length;
                          return (
                            <span key={ti} style={{ color: COLOR[tok.c] }}>
                              {tok.t.slice(0, shown)}
                              {atCursor && (
                                <span className="inline-block w-[7px] -translate-y-[1px] animate-pulse bg-accent">
                                  &nbsp;
                                </span>
                              )}
                            </span>
                          );
                        })
                      : " "}
                  </span>
                </div>
              );
            })}
          </div>
          {/* footer */}
          <div
            className="flex items-center gap-6 px-5 py-3.5 text-[11.8px] text-[rgba(239,245,255,0.69)]"
            style={{ borderTop: "1px solid rgba(212,228,254,0.10)" }}
          >
            <a href="/services" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              View service
            </a>
            <a href="/contact" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4">
                <path d="M22 2 11 13M22 2l-7 20-4-9-9-4z" />
              </svg>
              Start your project
            </a>
          </div>
        </div>

        {/* Lightweight film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        {/* Custom multiplayer-style cursor — colour + name follow the active service */}
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform transition-opacity duration-150"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          <svg width="24" height="26" viewBox="0 0 24 26" fill="none">
            <path
              d="M4 3 L4 21 L9 16.5 L12 23 L15 21.8 L12 15.3 L19 15.3 Z"
              fill="#ffffff"
              stroke="rgba(0,0,0,0.35)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="absolute left-[16px] top-[18px] whitespace-nowrap rounded-[10px] px-2.5 py-1 text-[13px] font-semibold leading-none text-white shadow-md"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.label}
          </span>
        </div>
      </div>
    </div>
  );
}
