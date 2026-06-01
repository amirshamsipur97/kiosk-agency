"use client";

import { useEffect, useRef, useState } from "react";
import type { DevService } from "@/lib/dev-services";

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

  const service = services[active];
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

      {/* Terminal panel */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ border: "1px solid rgba(212,228,254,0.19)" }}
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
      </div>
    </div>
  );
}
