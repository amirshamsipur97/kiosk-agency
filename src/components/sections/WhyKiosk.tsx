"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import SectionHeading from "@/components/ui/SectionHeading";

type Reason = {
  key: string;
  label: string;
  summary: string;
  icon: keyof typeof ICONS;
};

const reasons: Reason[] = [
  {
    key: "strategy-first",
    label: "Strategy First",
    summary: "Every engagement starts with a plan, not a deliverable.",
    icon: "target",
  },
  {
    key: "business-focused",
    label: "Business-Focused Execution",
    summary: "We optimize for revenue and outcomes, not vanity metrics.",
    icon: "briefcase",
  },
  {
    key: "data-driven",
    label: "Data-Driven Decisions",
    summary: "Choices are backed by analytics, never guesswork.",
    icon: "chart",
  },
  {
    key: "automation",
    label: "Automation-Oriented Thinking",
    summary: "We remove repetitive work so your team can scale.",
    icon: "bolt",
  },
  {
    key: "scalable-systems",
    label: "Scalable Systems",
    summary: "Everything we build is designed to grow with you.",
    icon: "layers",
  },
  {
    key: "long-term",
    label: "Long-Term Partnership",
    summary: "We stay invested well beyond the launch.",
    icon: "link",
  },
  {
    key: "performance",
    label: "Performance Tracking",
    summary: "Clear dashboards keep results measurable and honest.",
    icon: "gauge",
  },
  {
    key: "end-to-end",
    label: "End-to-End Delivery",
    summary: "Strategy, build, and growth handled under one roof.",
    icon: "box",
  },
];

const ICONS = {
  target: "M12 3a9 9 0 1 0 9 9 M12 7a5 5 0 1 0 5 5 M12 11a1 1 0 1 0 1 1",
  briefcase:
    "M3 8h18v11H3z M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 13h18",
  chart: "M4 20V10 M10 20V4 M16 20v-7 M22 20H2",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  layers: "M12 3 2 8l10 5 10-5z M2 13l10 5 10-5 M2 18l10 5 10-5",
  link:
    "M9 12a3 3 0 0 1 3-3h4a3 3 0 0 1 0 6h-2 M15 12a3 3 0 0 1-3 3H8a3 3 0 0 1 0-6h2",
  gauge: "M12 14a6 6 0 1 1 6-6 M12 14l4-4 M6 20a9 9 0 1 1 12 0",
  box: "M21 8 12 3 3 8v8l9 5 9-5z M3 8l9 5 9-5 M12 13v10",
} as const;

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

// Build the terminal output (token lines) for a reason.
type Tok = { t: string; c?: string };
const COLOR: Record<string, string> = {
  prompt: "#68cc58",
  kw: "#737a7f",
  str: "#ffc446",
  key: "#ebeced",
  punc: "#a0a0a0",
  num: "#7aa2f7",
};

function buildLines(reason: Reason, index: number): Tok[][] {
  return [
    [
      { t: "$ ", c: "prompt" },
      { t: "kiosk principles --get ", c: "kw" },
      { t: `"${reason.key}"`, c: "str" },
    ],
    [],
    [{ t: "{", c: "punc" }],
    [
      { t: '  "principle"', c: "key" },
      { t: ": ", c: "punc" },
      { t: `"${reason.label}"`, c: "str" },
      { t: ",", c: "punc" },
    ],
    [
      { t: '  "summary"', c: "key" },
      { t: ": ", c: "punc" },
      { t: `"${reason.summary}"`, c: "str" },
      { t: ",", c: "punc" },
    ],
    [
      { t: '  "index"', c: "key" },
      { t: ": ", c: "punc" },
      { t: `${index + 1}`, c: "num" },
      { t: " ", c: "punc" },
      { t: "// of 8 principles", c: "kw" },
    ],
    [{ t: "}", c: "punc" }],
  ];
}

export default function WhyKiosk() {
  const [active, setActive] = useState(0);
  const codeRef = useRef<HTMLDivElement>(null);
  const reason = reasons[active];
  const lines = buildLines(reason, active);

  // Animate the terminal output whenever the active principle changes.
  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    const rows = el.querySelectorAll("[data-line]");
    gsap.fromTo(
      rows,
      { autoAlpha: 0, x: -6 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.35,
        ease: "power2.out",
        stagger: 0.035,
        overwrite: true,
      },
    );
  }, [active]);

  const copy = () => {
    const text = lines
      .map((l) => l.map((t) => t.t).join(""))
      .join("\n");
    navigator.clipboard?.writeText(text);
  };

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why KIOSK"
          title="A partner built around your growth"
        />

        <div className="mt-12 flex flex-col gap-12 md:mt-16">
          {/* Icon tab row */}
          <div className="relative">
            <div className="flex gap-8 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {reasons.map((r, i) => {
                const on = i === active;
                return (
                  <button
                    key={r.key}
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
                        name={r.icon}
                        className={`size-7 transition-colors duration-300 ${
                          on ? "text-accent" : "text-[rgba(239,245,255,0.55)]"
                        }`}
                      />
                    </span>
                    <span
                      className={`whitespace-nowrap text-[13.9px] transition-colors duration-300 ${
                        on
                          ? "text-[rgba(252,253,255,0.94)]"
                          : "text-[rgba(239,245,255,0.69)]"
                      }`}
                    >
                      {r.label.split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
            {/* right-edge fade */}
            <div className="pointer-events-none absolute right-0 top-0 h-14 w-20 bg-gradient-to-l from-ink to-transparent" />
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
                  <Icon name={reason.icon} className="size-3.5 text-accent" />
                  {reason.label}
                </span>
              </div>
              <button
                type="button"
                onClick={copy}
                aria-label="Copy output"
                className="rounded-md p-2 text-[rgba(239,245,255,0.55)] transition-colors hover:text-paper"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-5">
                  <rect x="9" y="9" width="11" height="11" rx="2" />
                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                </svg>
              </button>
            </div>

            {/* code / terminal body */}
            <div className="relative bg-[#05050a]" ref={codeRef}>
              <div className="overflow-x-auto p-4 font-mono text-[14px] leading-[24px]">
                {lines.map((line, li) => (
                  <div key={li} data-line className="flex gap-6">
                    <span className="w-5 shrink-0 select-none text-right text-[#464a4d]">
                      {li + 1}
                    </span>
                    <span className="whitespace-pre-wrap">
                      {line.length === 0 ? (
                        " "
                      ) : (
                        line.map((tok, ti) => (
                          <span key={ti} style={{ color: COLOR[tok.c ?? "punc"] }}>
                            {tok.t}
                          </span>
                        ))
                      )}
                    </span>
                  </div>
                ))}
              </div>
              {/* footer */}
              <div
                className="flex items-center gap-6 px-5 py-3.5 text-[11.8px] text-[rgba(239,245,255,0.69)]"
                style={{ borderTop: "1px solid rgba(212,228,254,0.10)" }}
              >
                <a href="/contact" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                  Start your project
                </a>
                <a href="/case-studies" className="inline-flex items-center gap-2 transition-colors hover:text-paper">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                  View our work
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
