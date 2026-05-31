"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Reveal from "@/components/ui/Reveal";

type K = { label: string; top?: string; k?: string; grow?: number };

const rows: K[][] = [
  [
    { label: "Esc", grow: 1.6 },
    { top: "!", label: "1" },
    { top: "@", label: "2" },
    { top: "#", label: "3" },
    { top: "$", label: "4" },
    { top: "%", label: "5" },
    { top: "^", label: "6" },
    { top: "&", label: "7" },
    { top: "*", label: "8" },
    { top: "(", label: "9" },
    { top: ")", label: "0" },
    { top: "_", label: "-" },
    { top: "+", label: "=" },
    { label: "Backspace", grow: 2 },
    { label: "", grow: 1 },
  ],
  [
    { label: "Tab", grow: 1.6 },
    { label: "Q", k: "Q" },
    { label: "W", k: "W" },
    { label: "E", k: "E" },
    { label: "R", k: "R" },
    { label: "T", k: "T" },
    { label: "Y", k: "Y" },
    { label: "U", k: "U" },
    { label: "I", k: "I" },
    { label: "O", k: "O" },
    { label: "P", k: "P" },
    { top: "{", label: "[" },
    { top: "}", label: "]" },
    { top: "|", label: "\\" },
    { label: "PgUp", grow: 1.2 },
  ],
  [
    { label: "Caps", grow: 1.9 },
    { label: "A", k: "A" },
    { label: "S", k: "S" },
    { label: "D", k: "D" },
    { label: "F", k: "F" },
    { label: "G", k: "G" },
    { label: "H", k: "H" },
    { label: "J", k: "J" },
    { label: "K", k: "K" },
    { label: "L", k: "L" },
    { top: ":", label: ";" },
    { top: '"', label: "'" },
    { label: "Return", grow: 2 },
    { label: "PgDn", grow: 1.2 },
  ],
  [
    { label: "Shift", grow: 2.4 },
    { label: "Z", k: "Z" },
    { label: "X", k: "X" },
    { label: "C", k: "C" },
    { label: "V", k: "V" },
    { label: "B", k: "B" },
    { label: "N", k: "N" },
    { label: "M", k: "M" },
    { top: "<", label: "," },
    { top: ">", label: "." },
    { top: "?", label: "/" },
    { label: "Shift", grow: 2.4 },
    { label: "▲", grow: 1 },
    { label: "Fn", grow: 1 },
  ],
  [
    { label: "⌃", grow: 1.2 },
    { label: "⌥", grow: 1.2 },
    { label: "⌘", grow: 1.2 },
    { label: "", k: "SPACE", grow: 8 },
    { label: "⌥", grow: 1.2 },
    { label: "◀", grow: 1 },
    { label: "▼", grow: 1 },
    { label: "▶", grow: 1 },
  ],
];

const pills = [
  { key: "W", label: "Website & Digital Systems", href: "/services/website-digital-systems" },
  { key: "M", label: "Media & Content", href: "/services/media-content" },
  { key: "G", label: "Growth Marketing", href: "/services/growth-marketing" },
  { key: "A", label: "Automation & CRM", href: "/services/automation-crm" },
];

const FULL =
  "Kiosk Agency is a full-service digital agency focused on building scalable, high-performance systems for modern businesses.";
const BOLD_LEN = "Kiosk Agency".length;
const keyFor = (ch: string) =>
  /[a-z]/i.test(ch) ? ch.toUpperCase() : ch === " " ? "SPACE" : null;

export default function Approach() {
  const root = useRef<HTMLDivElement | null>(null);
  const boldRef = useRef<HTMLSpanElement | null>(null);
  const restRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      if (boldRef.current) boldRef.current.textContent = FULL.slice(0, BOLD_LEN);
      if (restRef.current) restRef.current.textContent = FULL.slice(BOLD_LEN);
      return;
    }

    const counts: Record<string, number> = {};
    let typeCalls: gsap.core.Tween[] = [];
    type Phase = "idle" | "typing" | "full";
    let phase: Phase = "idle";
    const clamp = (n: number) => Math.min(1, Math.max(0, n));

    const find = (k: string) =>
      Array.from(el.querySelectorAll<HTMLElement>(`[data-key="${k}"]`));

    const press = (k: string) => {
      counts[k] = (counts[k] || 0) + 1;
      find(k).forEach((node) => {
        node.classList.add("is-pressed");
        gsap.fromTo(
          node,
          { scale: 1 },
          { scale: 0.9, duration: 0.09, yoyo: true, repeat: 1, ease: "power2.out" }
        );
      });
    };
    const release = (k: string) => {
      counts[k] = Math.max(0, (counts[k] || 1) - 1);
      if (counts[k] === 0) find(k).forEach((n) => n.classList.remove("is-pressed"));
    };
    // Force-clear every lit key (used when typing is interrupted by scroll, so
    // keys never get stuck in the pressed/lime state).
    const clearPressed = () => {
      Object.keys(counts).forEach((k) => (counts[k] = 0));
      el.querySelectorAll(".is-pressed").forEach((n) =>
        n.classList.remove("is-pressed")
      );
    };

    const setText = (i: number) => {
      // index i = number of characters typed so far (1-based)
      if (boldRef.current)
        boldRef.current.textContent = FULL.slice(0, Math.min(i, BOLD_LEN));
      if (restRef.current)
        restRef.current.textContent = i > BOLD_LEN ? FULL.slice(BOLD_LEN, i) : "";
    };

    const killTyping = () => {
      typeCalls.forEach((c) => c.kill());
      typeCalls = [];
      clearPressed(); // pending key releases were killed — clear stuck keys
    };

    // Timed typing (plays when the section is reached).
    const startTyping = () => {
      phase = "typing";
      killTyping();
      let t = 0;
      for (let i = 0; i < FULL.length; i++) {
        const ch = FULL[i];
        const slow = i < BOLD_LEN; // "Kiosk Agency" = our set speed
        const k = keyFor(ch);
        typeCalls.push(
          gsap.delayedCall(t, () => {
            if (k) press(k);
            setText(i + 1);
          })
        );
        if (k) typeCalls.push(gsap.delayedCall(t + 1, () => release(k)));
        // bold part at our cadence (0.65s); the rest 0.5s faster (0.15s)
        const base = slow ? 0.65 : 0.15;
        t += base + Math.random() * 0.06 + (ch === " " ? (slow ? 0.14 : 0.05) : 0);
      }
      typeCalls.push(
        gsap.delayedCall(t, () => {
          phase = "full";
        })
      );
    };

    // Scroll-linked enter/clear: type once when we reach the section, and
    // erase the text in sync with scroll as we pass beyond it (re-typing on
    // return).
    const updateTyping = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const h = Math.max(rect.height, 1);
      const cy = rect.top + rect.height / 2;

      // Fully out of view (above OR below) → reset so it re-types next visit.
      if (rect.bottom < 0 || rect.top > vh) {
        if (phase !== "idle") {
          killTyping(); // also clears any stuck keys
          phase = "idle";
          setText(0);
        }
        return;
      }

      if (phase === "idle") {
        // Type once the panel is reasonably centred — works whether we arrive
        // by scrolling DOWN to it or back UP to it.
        if (cy > vh * 0.18 && cy < vh * 0.85) startTyping();
        return;
      }

      if (phase === "full") {
        // Erase in sync with scroll as the panel passes up out of the top.
        const topExit = clamp((-rect.top - h * 0.25) / (h * 0.75));
        setText(Math.round(FULL.length * (1 - topExit)));
      }
    };

    // Scroll-linked scale: the keyboard grows as you scroll down toward it and
    // shrinks again when you scroll back up (reverses with scroll direction).
    let raf = 0;
    let running = false;
    let targetP = 0;
    let curP = 0;

    const computeTarget = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 as it enters from the bottom, 1 once comfortably in view.
      targetP = Math.min(1, Math.max(0, (vh - rect.top) / (vh * 0.6)));
    };

    const apply = (p: number) => {
      const e = 1 - Math.pow(1 - p, 3); // easeOutCubic — non-uniform feel
      gsap.set(el, {
        scale: 0.5 + 0.5 * e,
        y: (1 - e) * 60,
        opacity: 0.25 + 0.75 * e,
        transformOrigin: "50% 60%",
        force3D: true,
      });
    };

    const tick = () => {
      // Same smooth, gentle easing in BOTH directions so growing (scroll down)
      // and shrinking (scroll up) feel consistent and never abrupt.
      const factor = 0.05;
      curP += (targetP - curP) * factor;
      if (Math.abs(targetP - curP) < 0.0015) {
        curP = targetP;
        apply(curP);
        running = false;
        raf = 0;
        return;
      }
      apply(curP);
      raf = requestAnimationFrame(tick);
    };

    const ensureRunning = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onScroll = () => {
      computeTarget();
      ensureRunning();
      updateTyping();
    };

    computeTarget();
    curP = targetP;
    apply(curP); // initial state, no jump
    updateTyping();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      killTyping();
      el.querySelectorAll(".is-pressed").forEach((n) =>
        n.classList.remove("is-pressed")
      );
    };
  }, []);

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div
          ref={root}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#0c0d10]/80 p-5 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05)] sm:p-8"
        >
            {/* ambient top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-64 w-2/3 -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]"
            />

            {/* Typed text bar */}
            <div className="relative mx-auto mb-5 flex max-w-2xl items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-1 shrink-0 text-fog">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="min-h-[1.5rem] text-[15px] leading-relaxed text-paper">
                <span ref={boldRef} className="font-bold" />
                <span ref={restRef} className="font-normal text-paper/85" />
                <span className="kbd-caret" aria-hidden />
              </p>
            </div>

            {/* Keyboard */}
            <div className="relative flex flex-col gap-1.5">
              {rows.map((rowKeys, ri) => (
                <div key={ri} className="flex gap-1.5">
                  {rowKeys.map((key, ki) => (
                    <div
                      key={ki}
                      data-key={key.k}
                      style={{ flexGrow: key.grow ?? 1, flexBasis: 0 }}
                      className="kbd-key flex h-9 min-w-0 flex-col items-center justify-center rounded-md text-[11px] font-medium leading-none sm:h-11 sm:rounded-lg sm:text-xs"
                    >
                      {key.top && (
                        <span className="text-[8px] opacity-80 sm:text-[9px]">
                          {key.top}
                        </span>
                      )}
                      {key.label && (
                        <span className={key.top ? "mt-0.5" : ""}>{key.label}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Shortcut pills */}
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {pills.map((p, i) => (
                <Link
                  key={p.key}
                  href={p.href}
                  className={`group inline-flex items-center gap-2.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                    i === 2
                      ? "border-white/15 bg-white/[0.06] text-paper"
                      : "border-white/[0.06] text-fog hover:border-white/15 hover:text-paper"
                  }`}
                >
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-[5px] border border-white/10 px-1 text-[11px] font-semibold text-paper/80">
                    {p.key}
                  </span>
                  {p.label}
                </Link>
              ))}
            </div>
        </div>

        {/* Text — Our Approach */}
        <Reveal delay={120} className="mx-auto mt-12 max-w-2xl text-center md:mt-16">
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Our Approach
          </span>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            Everything works together
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Every successful business requires more than a website or a marketing
            campaign. We combine the disciplines below into complete digital
            ecosystems that scale.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
