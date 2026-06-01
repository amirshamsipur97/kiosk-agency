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

// Figma cursor-style colour + label per service (fill + darker border).
const CURSOR: Record<string, { label: string; color: string; border: string }> = {
  "website-digital-systems": { label: "Web", color: "#2f80ed", border: "#1f5fc0" },
  "design-systems": { label: "Design", color: "#27ae60", border: "#1c8c4c" },
  "growth-marketing": { label: "Growth", color: "#f79009", border: "#dc6803" },
  seo: { label: "SEO", color: "#e0479e", border: "#b83480" },
  "automation-crm": { label: "Automation", color: "#eb5757", border: "#c0392b" },
};

type Tok = { t: string; c: string };
const COLOR: Record<string, string> = {
  prompt: "#68cc58",
  kw: "#737a7f",
  num: "#464a4d",
  cap: "#ebeced",
  desc: "#ffc446",
  out: "#a1fcea",
  punc: "#737a7f",
};

const fileName = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") + ".tsx";

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

export default function DevTerminal({ services }: { services: DevService[] }) {
  const [active, setActive] = useState(0);
  const [selFile, setSelFile] = useState(0);
  const [replay, setReplay] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [hovering, setHovering] = useState(false);
  const rafRef = useRef<number | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  const service = services[active];
  const cursor =
    CURSOR[service.slug] ?? { label: service.name, color: "#f79009", border: "#dc6803" };
  const lines = buildLines(service);
  const total = lines.reduce(
    (sum, line) => sum + line.reduce((s, tok) => s + tok.t.length, 0),
    0,
  );
  const outcomes = service.capabilities.map((c) => c.outcome);

  // Natural typewriter whenever the service (or replay) changes.
  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setRevealed(0);
    let shown = 0;
    let last = performance.now();
    const SPEED = 0.05;
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
  }, [active, replay]);

  // Custom Figma-style cursor easing toward the pointer.
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
                onClick={() => {
                  setActive(i);
                  setSelFile(0);
                }}
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
                    name={ICON_FOR[s.slug] ?? "code"}
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

      {/* Editor panel (Figma Irfan-invest editor) — square material frame */}
      <div
        ref={panelRef}
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovering(false)}
        className="relative overflow-hidden rounded-3xl [cursor:none]"
        style={{
          border: "1px solid rgba(212,228,254,0.19)",
          backgroundImage: CARD_SHEEN,
        }}
      >
        {/* Header — traffic lights + view toggles */}
        <div
          className="flex h-12 items-center justify-between px-4"
          style={{ borderBottom: "1px solid rgba(212,228,254,0.19)" }}
        >
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[rgba(255,107,109,0.94)]" />
            <span className="size-2.5 rounded-full bg-[#ffcb47]" />
            <span className="size-2.5 rounded-full bg-[rgba(66,255,164,0.7)]" />
          </div>
          <div className="flex items-center gap-2">
            {[
              ["M3 5h18v11H3z M8 20h8", "M9 4h6v16H9z"],
              ["M4 4h16v12H4z M2 20h20", "M12 6a6 6 0 0 0 0 12 6 6 0 0 1 0-12z"],
            ].map((pair, gi) => (
              <div
                key={gi}
                className="flex items-center overflow-hidden rounded-lg border"
                style={{ borderColor: "rgba(212,228,254,0.19)" }}
              >
                {pair.map((d, ii) => (
                  <span
                    key={ii}
                    className="flex size-8 items-center justify-center"
                    style={{
                      backgroundColor:
                        ii === 0 ? "rgba(121,121,250,0.03)" : "transparent",
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="rgba(239,245,255,0.55)"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-4"
                      aria-hidden
                    >
                      <path d={d} />
                    </svg>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Body — sidebar | code | preview */}
        <div className="flex h-[460px]">
          {/* Sidebar: capabilities as files */}
          <aside
            className="hidden w-[200px] shrink-0 overflow-y-auto p-2 md:block"
            style={{ borderRight: "1px solid rgba(212,228,254,0.19)" }}
          >
            <div className="flex flex-col gap-1">
              {service.capabilities.map((c, i) => {
                const on = i === selFile;
                return (
                  <button
                    key={c.capability}
                    type="button"
                    onClick={() => {
                      setSelFile(i);
                      setReplay((r) => r + 1);
                    }}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-[13.5px] transition-colors"
                    style={{ color: on ? "#3cabff" : "rgba(239,245,255,0.69)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="size-4 shrink-0" aria-hidden>
                      <path
                        d="M6 2h8l4 4v16H6z M14 2v4h4"
                        stroke={on ? "#3cabff" : "rgba(239,245,255,0.45)"}
                        strokeWidth="1.4"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="truncate">{fileName(c.capability)}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Code column */}
          <div className="relative min-w-0 flex-1 overflow-auto bg-[#05050a]">
            <div className="p-4 font-mono text-[13px] leading-[24px]">
              {lines.map((line, li) => {
                const has = line.length > 0;
                return (
                  <div key={li} className="flex gap-5">
                    <span className="w-6 shrink-0 select-none text-right text-[#2f3336]">
                      {li + 1}
                    </span>
                    <span className="whitespace-pre-wrap break-words">
                      {has
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
                        : " "}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preview card column */}
          <div
            className="hidden w-[360px] shrink-0 overflow-y-auto p-6 lg:block"
            style={{
              borderLeft: "1px solid rgba(212,228,254,0.19)",
              backgroundImage:
                "radial-gradient(120% 80% at 50% 0%, rgba(0,163,255,0.10), rgba(0,163,255,0) 60%)",
            }}
          >
            <div className="flex items-center gap-2 text-accent">
              <Icon name={ICON_FOR[service.slug] ?? "code"} className="size-5" />
              <span className="text-[12px] uppercase tracking-[0.12em] text-[rgba(239,245,255,0.55)]">
                Preview
              </span>
            </div>
            <h4 className="mt-5 font-display text-2xl font-medium leading-tight text-[rgba(252,253,255,0.94)]">
              {service.name}
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-[rgba(239,245,255,0.69)]">
              {service.overview}
            </p>
            <p className="mt-6 text-[12px] uppercase tracking-[0.12em] text-[rgba(239,245,255,0.45)]">
              Outcomes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {outcomes.map((o) => (
                <span
                  key={o}
                  className="rounded-full border px-3 py-1 text-xs text-[rgba(239,245,255,0.8)]"
                  style={{ borderColor: "rgba(212,228,254,0.19)" }}
                >
                  {o}
                </span>
              ))}
            </div>
            <a
              href="/services"
              className="mt-7 inline-flex items-center gap-2 rounded-md bg-[#00a3ff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1ab0ff]"
              style={{ cursor: "none" }}
            >
              Get Started
            </a>
          </div>
        </div>

        {/* Lightweight film grain */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 opacity-[0.06] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />
        {/* Custom multiplayer-style cursor */}
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 will-change-transform transition-opacity duration-150"
          style={{ opacity: hovering ? 1 : 0 }}
        >
          <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path
              d="M3 2.5 L3 17.6 L7 13.8 L9.6 19 L12 17.9 L9.4 12.7 L15 12.7 Z"
              fill="#ffffff"
              stroke="rgba(0,0,0,0.4)"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className="absolute left-[15px] top-[16px] whitespace-nowrap rounded-bl-[24px] rounded-br-[24px] rounded-tl-[2px] rounded-tr-[24px] border-2 pb-2 pl-4 pr-5 pt-2 text-[15px] font-medium leading-6 text-white"
            style={{
              backgroundColor: cursor.color,
              borderColor: cursor.border,
              boxShadow: `4px 4px 12px ${cursor.color}29`,
            }}
          >
            {cursor.label}
          </span>
        </div>
      </div>
    </div>
  );
}
