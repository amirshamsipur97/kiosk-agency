"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { jsPDF } from "jspdf";
import {
  Chevron,
  HelpIcon,
  LogoMark,
  Magnifier,
  NineCircles,
  PatternLock,
} from "./figma-icons";

const A = "/architect-ui";

// Site material-design glass surfaces (matches Services / WhatWeDo panels).
const PANEL_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";
const PANEL_HIGHLIGHT =
  "linear-gradient(140deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 45%)";

// ── Exact Figma sidebar labels (kept verbatim, incl. original spelling) ──
const MENU: { label: string; kb: string }[] = [
  { label: "All", kb: "All" },
  { label: "Real Estate", kb: "Real Estate" },
  { label: "Automotive", kb: "Automotive" },
  { label: "Hospitality", kb: "Hospitality" },
  { label: "Healthcare", kb: "Healthcare" },
  { label: "Reatail & Ecommerce", kb: "Retail & Ecommerce" },
  { label: "Corporate Services", kb: "Corporate Services" },
  { label: "Media & Personal Brand", kb: "Media & Personal Brands" },
  { label: "Construction", kb: "Construction" },
];

const KEYWORDS: { t: string; label: string }[] = [
  { t: "Real estate agent", label: "Real Estate" },
  { t: "Realtor", label: "Real Estate" },
  { t: "Property developer", label: "Real Estate" },
  { t: "Real estate brokerage", label: "Real Estate" },
  { t: "Car dealership", label: "Automotive" },
  { t: "Auto dealer", label: "Automotive" },
  { t: "Automotive workshop", label: "Automotive" },
  { t: "Hotel", label: "Hospitality" },
  { t: "Restaurant", label: "Hospitality" },
  { t: "Resort", label: "Hospitality" },
  { t: "Cafe", label: "Hospitality" },
  { t: "Clinic", label: "Healthcare" },
  { t: "Dental clinic", label: "Healthcare" },
  { t: "Medical practice", label: "Healthcare" },
  { t: "Online store", label: "Reatail & Ecommerce" },
  { t: "Ecommerce brand", label: "Reatail & Ecommerce" },
  { t: "Retail shop", label: "Reatail & Ecommerce" },
  { t: "Consulting firm", label: "Corporate Services" },
  { t: "Law firm", label: "Corporate Services" },
  { t: "Corporate office", label: "Corporate Services" },
  { t: "Content creator", label: "Media & Personal Brand" },
  { t: "Influencer", label: "Media & Personal Brand" },
  { t: "Personal brand", label: "Media & Personal Brand" },
  { t: "Construction company", label: "Construction" },
  { t: "Contractor", label: "Construction" },
  { t: "Builder", label: "Construction" },
  { t: "I need more leads", label: "All" },
  { t: "Improve my website", label: "All" },
  { t: "Marketing strategy", label: "All" },
  { t: "Automate my business", label: "All" },
];

// Consultation journey shown inside the iPhone.
const STEPS = [
  { t: "Choose your business", d: "Pick an industry or search your role" },
  { t: "Share goals & challenges", d: "Tell the agent what you want to grow" },
  { t: "AI analysis", d: "Scoring maturity, readiness & potential" },
  { t: "Service & AI plan", d: "Matched services and AI products" },
  { t: "Growth roadmap", d: "Phased steps to scale" },
  { t: "Package & proposal", d: "Your recommended package" },
];

type RoadmapPhase = {
  phase?: string;
  title?: string;
  timeline?: string;
  items?: string[];
  expected_outcomes?: string[];
};
type Recommendation = {
  summary_message?: string;
  recommended_package?: string;
  recommended_services?: string[];
  recommended_ai_products?: string[];
  executive_summary?: string;
  growth_roadmap?: RoadmapPhase[];
  scores?: Record<string, number>;
  business_name?: string;
  industry?: string;
};

export type CatalogItem = {
  title: string;
  kind: "service" | "product";
  price: number;
  effort: string;
};
export type StudioPackage = { slug: string; name: string };
export type StudioProps = {
  packages: StudioPackage[];
  catalog: Record<string, CatalogItem>;
};

const PKG_PRICE: Record<string, number> = {
  starter: 750,
  growth: 1500,
  premium: 3000,
  enterprise: 6000,
  "full-growth-system": 10000,
};

type Phase = "gather" | "services" | "roadmap" | "proposal";

type Msg = { role: "user" | "assistant"; content: string };

// ── tiny markdown-ish renderer so agent replies are organised & scannable ──
function inlineBold(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}
function renderRich(text: string): ReactNode {
  const lines = text.split("\n");
  return lines.map((raw, i) => {
    const l = raw.trim();
    if (!l) return <div key={i} className="h-1.5" />;
    if (l.startsWith("- ") || l.startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2">
          <span className="mt-[2px] text-accent">•</span>
          <span className="text-[13px] leading-[19px] text-white/80">
            {inlineBold(l.slice(2))}
          </span>
        </div>
      );
    }
    const h = l.match(/^\*\*(.+?)\*\*:?$/);
    if (h) {
      return (
        <p key={i} className="mb-1 mt-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-white first:mt-0">
          {h[1]}
        </p>
      );
    }
    return (
      <p key={i} className="text-[13px] leading-[19px] text-white/80">
        {inlineBold(l)}
      </p>
    );
  });
}

export default function ArchitectStudio({ packages, catalog }: StudioProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() =>
      setScale(Math.min(1, el.clientWidth / 975)),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [active, setActive] = useState("All");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [topSearch, setTopSearch] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [bottomInput, setBottomInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [ringPct, setRingPct] = useState(0);
  const [reply, setReply] = useState("");
  const [typed, setTyped] = useState("");
  const [headline, setHeadline] = useState("Choose your business");
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [phase, setPhase] = useState<Phase>("gather");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [downloading, setDownloading] = useState(false);
  const [dlPct, setDlPct] = useState(0);
  const rampRef = useRef<number | null>(null);
  const answerRef = useRef<HTMLDivElement | null>(null);
  const journeyRef = useRef<HTMLDivElement | null>(null);

  // Typewriter reveal of the agent's reply at a reasonable speed.
  useEffect(() => {
    if (!reply) {
      setTyped("");
      return;
    }
    let raf = 0;
    let start = 0;
    const MS_PER_CHAR = 12; // ~80 chars/sec — natural typing pace
    const tick = (ts: number) => {
      if (!start) start = ts;
      const n = Math.floor((ts - start) / MS_PER_CHAR);
      setTyped(reply.slice(0, n));
      if (answerRef.current)
        answerRef.current.scrollTop = answerRef.current.scrollHeight;
      if (n < reply.length) raf = requestAnimationFrame(tick);
      else setTyped(reply);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reply]);

  const kbFor = (label: string) =>
    MENU.find((m) => m.label === label)?.kb ?? "All";

  function startRamp() {
    setRingPct(0);
    let p = 0;
    rampRef.current = window.setInterval(() => {
      p = Math.min(94, p + Math.random() * 6 + 2);
      setRingPct(Math.round(p));
    }, 200);
  }
  function stopRamp() {
    if (rampRef.current) window.clearInterval(rampRef.current);
    rampRef.current = null;
    setRingPct(100);
  }

  async function send(text: string, industryLabel: string, fresh = false) {
    const content = text.trim();
    if (!content || loading) return;
    if (fresh) {
      setRec(null);
      setPhase("gather");
      setSelected(new Set());
      setReply("");
    }
    setHeadline(
      industryLabel === "All"
        ? "Growth consultation"
        : `${industryLabel} consultation`,
    );
    const base = fresh ? [] : messages;
    const next: Msg[] = [...base, { role: "user", content }];
    setMessages(next);
    setBottomInput("");
    setShowSug(false);
    setLoading(true);
    startRamp();
    try {
      const res = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, industry: kbFor(industryLabel) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReply(data?.error || "Something went wrong. Please try again.");
      } else {
        setReply(data.reply || "");
        setMessages((m) => [...m, { role: "assistant", content: data.reply || "" }]);
        if (data.recommendation) {
          const r = data.recommendation as Recommendation;
          setRec(r);
          const initial = [
            ...(r.recommended_services || []),
            ...(r.recommended_ai_products || []),
          ].filter((s) => catalog[s]);
          setSelected(new Set(initial));
          setPhase("services");
          setHeadline("Recommended for you");
        }
      }
    } catch {
      setReply("Network error. Please try again.");
    } finally {
      stopRamp();
      setLoading(false);
    }
  }

  function pickIndustry(label: string) {
    setActive(label);
    send(
      label === "All"
        ? "I'd like a growth consultation for my business."
        : `I run a ${label} business.`,
      label,
      true,
    );
  }
  function pickSuggestion(s: { t: string; label: string }) {
    setTopSearch(s.t);
    setActive(s.label);
    send(`I'm a ${s.t.toLowerCase()}.`, s.label, true);
  }

  const suggestions = topSearch.trim()
    ? KEYWORDS.filter((k) =>
        k.t.toLowerCase().includes(topSearch.trim().toLowerCase()),
      ).slice(0, 6)
    : [];

  const showRing = (loading || messages.length === 0) && phase === "gather";

  const pkgName = rec?.recommended_package
    ? packages.find((p) => p.slug === rec.recommended_package)?.name
    : undefined;
  const pkgPrice = rec?.recommended_package
    ? PKG_PRICE[rec.recommended_package] ?? 1500
    : 0;

  // journey step driven by the phase machine.
  // During "gather" it advances by how many times the user has replied, so the
  // map moves step-by-step (Choose → Share goals → AI analysis) instead of
  // jumping straight to AI analysis on the first click.
  const userTurns = messages.filter((m) => m.role === "user").length;
  const step =
    phase === "proposal"
      ? 5
      : phase === "roadmap"
        ? 4
        : phase === "services"
          ? 3
          : loading && userTurns >= 2
            ? 2
            : userTurns > 0
              ? 1
              : 0;
  const status = downloading
    ? "Generating your proposal…"
    : loading
      ? step === 2
        ? "Agent is analyzing your business…"
        : "Agent is thinking…"
      : phase === "services"
        ? "Select what you want, then approve"
        : phase === "roadmap"
          ? "Review your growth roadmap"
          : phase === "proposal"
            ? "Download your proposal"
            : userTurns > 0
              ? "Reply to continue the consultation"
              : "Start by choosing your business";

  // Smoothly fill/empty the connector lines as the journey advances (GSAP).
  useEffect(() => {
    const el = journeyRef.current;
    if (!el) return;
    const lines = el.querySelectorAll<HTMLElement>("[data-line]");
    lines.forEach((ln) => {
      const idx = Number(ln.dataset.line);
      gsap.to(ln, {
        scaleY: idx < step ? 1 : 0,
        duration: 0.6,
        ease: "power2.out",
        delay: idx < step ? idx * 0.06 : 0,
        overwrite: "auto",
      });
    });
  }, [step]);

  // selectable catalog list from the recommendation
  const recList = [
    ...(rec?.recommended_services || []),
    ...(rec?.recommended_ai_products || []),
  ].filter((s) => catalog[s]);
  const toggle = (slug: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(slug)) n.delete(slug);
      else n.add(slug);
      return n;
    });
  const selectedTotal = recList
    .filter((s) => selected.has(s))
    .reduce((sum, s) => sum + (catalog[s]?.price || 0), 0);

  function downloadProposal() {
    if (downloading) return;
    setDownloading(true);
    setDlPct(0);
    let p = 0;
    const iv = window.setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 6);
      setDlPct(Math.round(p));
      if (p >= 100) {
        window.clearInterval(iv);
        try {
          buildPdf();
        } catch {
          /* ignore */
        }
        window.setTimeout(() => setDownloading(false), 300);
      }
    }, 140);
  }

  function buildPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const M = 48;
    let y = 64;
    const W = 595 - M * 2;
    const line = (txt: string, size: number, bold = false, color = "#111111") => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.setTextColor(color);
      const parts = doc.splitTextToSize(txt, W);
      parts.forEach((pp: string) => {
        if (y > 780) {
          doc.addPage();
          y = 64;
        }
        doc.text(pp, M, y);
        y += size + 6;
      });
    };
    doc.setFillColor("#0a0a0b");
    doc.rect(0, 0, 595, 40, "F");
    doc.setTextColor("#d7ff3e");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("KIOSK", M, 26);
    doc.setTextColor("#ffffff");
    doc.setFontSize(10);
    doc.text("Growth Proposal", M + 60, 26);
    y = 80;
    line("Growth Proposal", 22, true);
    line(
      `Prepared for: ${rec?.business_name || active + " business"}  ·  Industry: ${rec?.industry || active}`,
      10,
      false,
      "#555555",
    );
    y += 8;
    if (rec?.executive_summary) {
      line("Executive Summary", 13, true);
      line(rec.executive_summary, 10, false, "#333333");
      y += 8;
    }
    line("Recommended Scope", 13, true);
    recList
      .filter((s) => selected.has(s))
      .forEach((s) => {
        const it = catalog[s];
        line(
          `• ${it.title}  —  ${it.effort}  —  $${it.price.toLocaleString()}`,
          10,
          false,
          "#333333",
        );
      });
    line(`Setup total: $${selectedTotal.toLocaleString()}`, 11, true);
    y += 8;
    if (rec?.growth_roadmap?.length) {
      line("Growth Roadmap", 13, true);
      rec.growth_roadmap.forEach((ph, i) => {
        line(
          `Phase ${i + 1}: ${ph.title || ph.phase || ""}${ph.timeline ? " (" + ph.timeline + ")" : ""}`,
          11,
          true,
          "#222222",
        );
        if (ph.items?.length)
          line(ph.items.join(" · "), 10, false, "#555555");
      });
      y += 8;
    }
    if (pkgName) {
      line("Recommended Package", 13, true);
      line(`${pkgName} — from $${pkgPrice.toLocaleString()}/mo`, 11, false, "#333333");
      y += 8;
    }
    line("Next step: Book A Strategy Call at kioskoman.com/contact", 10, false, "#2670e9");
    doc.save("KIOSK-Growth-Proposal.pdf");
  }

  return (
    <div ref={wrapRef} className="w-full">
      <div style={{ height: 627 * scale }} className="relative w-full">
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{ width: 975, height: 627, transform: `scale(${scale})` }}
        >
          <div className="relative size-full overflow-clip rounded-[22.5px] border-[0.75px] border-[rgba(255,255,255,0.1)] shadow-[0px_3.75px_7.5px_0px_rgba(0,0,0,0.05),0px_11.25px_22.5px_0px_rgba(0,0,0,0.05),0px_22.5px_45px_0px_rgba(0,0,0,0.1)]">
            <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[22.5px] bg-[rgba(5,5,5,0.9)] backdrop-blur-[7.5px]" />

            {/* ───────── Sidebar ───────── */}
            <div className="absolute bottom-0 left-0 top-0 w-[202.5px] border-r-[0.75px] border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)]">
              <div className="absolute left-[15px] right-[14.25px] top-[15px] flex flex-col gap-[24px]">
                <div className="flex w-full items-center gap-[3px]">
                  <LogoMark />
                  <p className="font-bold text-[13.5px] tracking-[-0.675px] text-white">
                    KIOSK<span className="text-[#aac811]">.</span>
                  </p>
                </div>
                <div className="flex w-full flex-col gap-[9px]">
                  {/* Choose your business header (Figma) */}
                  <p className="px-[15px] pb-[2px] font-medium text-[9px] uppercase tracking-[0.12em] text-white/45">
                    Choose your Business
                  </p>
                  {MENU.map((m) => {
                    const on = m.label === active;
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => pickIndustry(m.label)}
                        className={`relative flex w-full items-center gap-[9px] px-[15px] py-[7.5px] text-left transition-colors ${
                          on
                            ? "border-l-[0.75px] border-[#2670e9] bg-gradient-to-r from-[rgba(38,112,233,0.3)] to-[rgba(38,112,233,0)]"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        {m.label === "All" ? <NineCircles /> : <PatternLock />}
                        <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[10.5px] leading-[15px] text-white">
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="absolute left-[15px] right-[14.25px] top-[494.25px] flex flex-col gap-[9px]">
                <div className="h-[0.75px] w-full rounded-[10px] bg-[rgba(255,255,255,0.1)]" />
                <div className="flex w-full items-center gap-[9px] px-[15px] py-[7.5px]">
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[10.5px] leading-[15px] text-white">
                    Powered by Kiosk
                  </span>
                </div>
                <div className="flex w-full items-center gap-[9px] px-[15px] py-[7.5px]">
                  <HelpIcon />
                  <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[10.5px] leading-[15px] text-white">
                    Help center
                  </span>
                </div>
              </div>
            </div>

            {/* ───────── Top Search ───────── */}
            <div className="absolute left-[217px] top-[16.25px] z-20 w-[410px]">
              <div className="flex items-center justify-center gap-[9px] overflow-hidden rounded-[99px] border-[0.75px] border-[rgba(255,255,255,0.1)] bg-[rgba(0,0,0,0.6)] px-[15px] py-[7.5px] shadow-[0px_0.75px_0px_0px_rgba(0,0,0,0.05),0px_3px_3px_0px_rgba(0,0,0,0.05),0px_7.5px_7.5px_0px_rgba(0,0,0,0.1)] backdrop-blur-[7.5px]">
                <input
                  value={topSearch}
                  onChange={(e) => {
                    setTopSearch(e.target.value);
                    setShowSug(true);
                  }}
                  onFocus={() => setShowSug(true)}
                  onBlur={() => setTimeout(() => setShowSug(false), 150)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const m = KEYWORDS.find((k) =>
                        k.t.toLowerCase().includes(topSearch.trim().toLowerCase()),
                      );
                      if (m) pickSuggestion(m);
                      else if (topSearch.trim()) send(topSearch, "All", true);
                    }
                  }}
                  placeholder="Search a role or keyword…"
                  className="min-w-0 flex-1 bg-transparent font-medium text-[12px] leading-[18px] text-white placeholder:text-white/60 focus:outline-none"
                />
                <Magnifier />
              </div>
              {showSug && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-[40px] overflow-hidden rounded-[12px] border-[0.75px] border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,12,0.96)] py-1 shadow-[0px_15px_30px_0px_rgba(0,0,0,0.4)] backdrop-blur-[7.5px]">
                  {suggestions.map((s) => (
                    <button
                      key={s.t}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        pickSuggestion(s);
                      }}
                      className="flex w-full items-center justify-between px-[15px] py-[7px] text-left text-[11px] text-white/80 transition-colors hover:bg-white/[0.06]"
                    >
                      <span>{s.t}</span>
                      <span className="text-[9px] uppercase tracking-wide text-[#2670e9]">
                        {s.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="absolute left-[217px] top-[67px] h-px w-[742.5px] rounded-[10px] bg-[rgba(255,255,255,0.1)]" />

            <p
              className="absolute left-[217px] top-[83px] w-[400px] overflow-hidden text-ellipsis whitespace-nowrap bg-clip-text font-medium text-[18px] leading-[27px] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(104.63deg, rgb(255,255,255) 0%, rgba(255,255,255,0) 103.32%)",
                textShadow: "0px 0px 20px rgba(255,255,255,0.5)",
              }}
            >
              {headline}
            </p>

            {/* Center: ring while thinking, else phase-specific content */}
            {showRing ? (
              <ProgressRing pct={ringPct} loading={loading} />
            ) : (
              <div
                ref={answerRef}
                className="absolute left-[217px] top-[120px] h-[400px] w-[510px] overflow-y-auto pr-3 [scrollbar-width:thin]"
              >
                {phase === "gather" && (
                  <div className="space-y-0.5">
                    {renderRich(typed)}
                    {typed.length < reply.length && (
                      <span className="ml-0.5 inline-block h-[14px] w-[7px] translate-y-[2px] animate-pulse rounded-[1px] bg-accent align-middle" />
                    )}
                  </div>
                )}

                {phase === "services" && (
                  <div className="space-y-3">
                    <p className="text-[13px] leading-[19px] text-white/75">
                      Based on your business, here&apos;s what I recommend. Pick
                      what you want and approve to continue.
                    </p>
                    <div className="space-y-2.5">
                      {recList.map((s) => {
                        const it = catalog[s];
                        const on = selected.has(s);
                        return (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggle(s)}
                            style={{ backgroundImage: PANEL_SHEEN }}
                            className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-[16px] border px-3.5 py-3 text-left transition-all duration-300 ${
                              on
                                ? "border-accent/50 shadow-[0_0_0_1px_rgba(215,255,62,0.15),0_8px_24px_-8px_rgba(215,255,62,0.25)]"
                                : "border-white/10 hover:border-white/25"
                            }`}
                          >
                            {/* inner top highlight (site material) */}
                            <span
                              aria-hidden
                              className="pointer-events-none absolute inset-0 opacity-80"
                              style={{ backgroundImage: PANEL_HIGHLIGHT }}
                            />
                            {/* accent wash when selected */}
                            {on && (
                              <span
                                aria-hidden
                                className="pointer-events-none absolute inset-0"
                                style={{
                                  backgroundImage:
                                    "radial-gradient(120% 120% at 0% 0%, rgba(215,255,62,0.10) 0%, rgba(215,255,62,0) 55%)",
                                }}
                              />
                            )}
                            <span
                              className={`relative flex size-[20px] shrink-0 items-center justify-center rounded-[7px] border text-[11px] font-bold transition-colors duration-300 ${
                                on
                                  ? "border-accent bg-accent text-ink shadow-[0_0_10px_0_rgba(215,255,62,0.5)]"
                                  : "border-white/25 text-transparent group-hover:border-white/40"
                              }`}
                            >
                              ✓
                            </span>
                            <span className="relative flex-1">
                              <span className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-paper">
                                  {it.title}
                                </span>
                                <span
                                  className={`rounded-full px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.08em] ${
                                    it.kind === "product"
                                      ? "bg-accent/15 text-accent"
                                      : "bg-white/10 text-white/55"
                                  }`}
                                >
                                  {it.kind === "product" ? "AI" : "Service"}
                                </span>
                              </span>
                              <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-fog">
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                                  <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                {it.effort}
                              </span>
                            </span>
                            <span className="relative shrink-0 text-right">
                              <span className="block text-[13px] font-semibold text-paper">
                                ${it.price.toLocaleString()}
                              </span>
                              <span className="block text-[9px] uppercase tracking-wide text-fog">
                                setup
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <span className="text-[12px] text-white/60">
                        Setup total
                      </span>
                      <span className="text-[16px] font-semibold text-white">
                        ${selectedTotal.toLocaleString()}
                      </span>
                    </div>
                    <BlueButton
                      onClick={() => {
                        setPhase("roadmap");
                        setHeadline("Your growth roadmap");
                      }}
                      disabled={selected.size === 0}
                    >
                      Approve &amp; continue
                    </BlueButton>
                  </div>
                )}

                {phase === "roadmap" && (
                  <div className="space-y-3">
                    <p className="text-[13px] leading-[19px] text-white/75">
                      A phased plan to get you there:
                    </p>
                    <div className="space-y-2">
                      {(rec?.growth_roadmap || []).map((ph, i) => (
                        <div
                          key={i}
                          className="rounded-[12px] border border-white/10 bg-white/[0.02] px-3 py-2.5"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex size-[18px] items-center justify-center rounded-full bg-accent text-[10px] font-bold text-ink">
                              {i + 1}
                            </span>
                            <span className="text-[13px] font-medium text-white">
                              {ph.title || ph.phase}
                            </span>
                            {ph.timeline && (
                              <span className="ml-auto text-[11px] text-white/45">
                                {ph.timeline}
                              </span>
                            )}
                          </div>
                          {ph.items?.length ? (
                            <p className="mt-1 pl-[26px] text-[11px] leading-[16px] text-white/55">
                              {ph.items.slice(0, 3).join(" · ")}
                            </p>
                          ) : null}
                        </div>
                      ))}
                    </div>
                    <BlueButton
                      onClick={() => {
                        setPhase("proposal");
                        setHeadline("Your proposal");
                      }}
                    >
                      Continue to proposal
                    </BlueButton>
                  </div>
                )}

                {phase === "proposal" && (
                  <div className="space-y-3">
                    <div className="rounded-[14px] border border-accent/30 bg-accent/[0.06] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                        Recommended package
                      </p>
                      <p className="mt-1 font-display text-[22px] font-semibold text-white">
                        {pkgName || "Growth"}
                      </p>
                      <p className="mt-1 text-[13px] text-white/60">
                        from ${pkgPrice.toLocaleString()}/mo · setup $
                        {selectedTotal.toLocaleString()} ({selected.size} items)
                      </p>
                    </div>
                    {rec?.executive_summary && (
                      <p className="text-[12px] leading-[18px] text-white/60">
                        {rec.executive_summary}
                      </p>
                    )}
                    {downloading ? (
                      <div className="space-y-2">
                        <div className="h-2 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#2670e9] to-[#7aa7ff] transition-[width] duration-150"
                            style={{ width: `${dlPct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-white/55">
                          Generating your proposal… {dlPct}%
                        </p>
                      </div>
                    ) : (
                      <BlueButton onClick={downloadProposal}>
                        Download Proposal (PDF)
                      </BlueButton>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ───────── iPhone — consultation journey map ───────── */}
            <div className="absolute left-[753px] top-[121px] h-[382px] w-[184px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={`${A}/phoneBody.svg`} className="absolute inset-0 block size-full max-w-none" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" src={`${A}/phoneScreen.svg`} className="absolute block max-w-none" style={{ left: 7, top: 7.34, width: 169.43, height: 367.76 }} />
              {/* screen content */}
              <div className="absolute overflow-hidden" style={{ left: 7, top: 7.34, width: 169.43, height: 367.76 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" src={`${A}/phoneIsland.svg`} className="absolute block max-w-none" style={{ left: 58, top: 4.66, width: 53.95, height: 15.87 }} />
                <div className="absolute inset-x-0 top-[30px] flex flex-col gap-[10px] px-[14px]">
                  <p className="text-[11px] font-semibold tracking-[-0.2px] text-white">
                    Your journey
                  </p>
                  <div ref={journeyRef} className="flex flex-col gap-[8px]">
                    {STEPS.map((s, i) => {
                      const done = i < step;
                      const isActive = i === step;
                      return (
                        <div key={i} className="flex gap-[8px]">
                          <div className="flex flex-col items-center">
                            <span
                              className={`flex size-[16px] shrink-0 items-center justify-center rounded-full border text-[8px] font-bold transition-colors duration-300 ${
                                done
                                  ? "border-accent bg-accent text-ink"
                                  : isActive
                                    ? "border-accent text-accent"
                                    : "border-white/20 text-white/40"
                              }`}
                            >
                              {done ? "✓" : i + 1}
                            </span>
                            {i < STEPS.length - 1 && (
                              <span
                                className="relative mt-[2px] w-px flex-1 overflow-hidden bg-white/10"
                                style={{ minHeight: 14 }}
                              >
                                <span
                                  data-line={i}
                                  className="absolute inset-0 origin-top bg-accent/70"
                                  style={{ transform: "scaleY(0)" }}
                                />
                              </span>
                            )}
                          </div>
                          <div className="pb-1">
                            <p className={`text-[9.5px] font-medium leading-[12px] ${isActive ? "text-white" : done ? "text-white/70" : "text-white/40"}`}>
                              {s.t}
                            </p>
                            <p className="text-[8px] leading-[11px] text-white/35">
                              {i === STEPS.length - 1 && pkgName ? pkgName : s.d}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* live status footer */}
                <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/30 px-[14px] py-[9px]">
                  <div className="flex items-center gap-[6px]">
                    <span className={`size-[6px] rounded-full ${loading ? "animate-pulse bg-accent" : "bg-white/40"}`} />
                    <p className="text-[8.5px] leading-[11px] text-white/70">{status}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ───────── Bottom input (full width) ───────── */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-[215px] top-[541px] h-[62px] w-[722px] rounded-[20px] border border-[rgba(255,255,255,0.15)] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.05),0px_15px_30px_0px_rgba(0,0,0,0.05),0px_30px_60px_0px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 rounded-[20px]" style={{ backgroundImage: "linear-gradient(180deg, rgba(46,51,90,0) 0%, rgba(28,27,51,0.1) 100%)" }} />
              <div className="absolute inset-0 rounded-[20px] bg-[length:71px_61px] bg-top-left opacity-20 backdrop-blur-[10px]" style={{ backgroundImage: `url("${A}/mainCard.png")` }} />
              <div className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_0px_100px_0px_rgba(204,215,255,0.25)]" />
            </div>
            <input
              value={bottomInput}
              onChange={(e) => setBottomInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(bottomInput, active);
              }}
              placeholder="Message the agent…"
              className="absolute left-[233px] top-[541px] z-10 h-[62px] w-[620px] bg-transparent text-[13px] text-white placeholder:text-white/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => send(bottomInput, active)}
              disabled={loading}
              aria-label="Send"
              className="absolute left-[871px] top-[550px] z-10 h-[44px] w-[48px] rounded-[10px] border border-[#2737cf] shadow-[0px_10px_40px_0px_rgba(63,74,175,0.5)] disabled:opacity-60"
            >
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-b from-[40.909%] from-[rgba(0,0,0,0)] to-[132.96%] to-[#402788] backdrop-blur-[10px]" />
              <span className="absolute left-[15px] top-[13px]">
                <Chevron />
              </span>
              <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_10px_30px_0px_rgba(73,123,255,0.7)]" />
            </button>

            <div className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_37.5px_75px_0px_rgba(255,255,255,0.15)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────── Progress Ring: Figma puck + dynamic 0→100 sweeping arc ─────────
function ProgressRing({ pct, loading }: { pct: number; loading: boolean }) {
  const R = 66;
  const C = 2 * Math.PI * R;
  const off = C * (1 - Math.max(0, Math.min(100, pct)) / 100);
  const ang = (-90 + (360 * pct) / 100) * (Math.PI / 180);
  const dotX = 75 + R * Math.cos(ang);
  const dotY = 75 + R * Math.sin(ang);
  return (
    <div
      className={`absolute left-[442px] top-[231px] size-[150px] ${loading ? "animate-pulse" : ""}`}
      style={{ transform: "scale(0.7)", transformOrigin: "center" }}
    >
      {/* faint Figma track */}
      <RingImg size={140} src={`${A}/stroke.svg`} inner="inset-[-2.86%]" />
      <div className="absolute left-[12px] top-[12px] size-[126px]">
        <div className="absolute inset-[-3.97%_-15.87%_-31.75%_-15.87%]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="block size-full max-w-none" src={`${A}/ellipse.svg`} />
        </div>
      </div>
      <RingImg size={114} src={`${A}/circle.svg`} inner="inset-[-4.39%_-17.54%_-35.09%_-17.54%]" />
      <RingImg size={90} src={`${A}/circle2.svg`} inner="inset-0" />

      {/* dynamic sweeping arc (0 → 100) */}
      <svg viewBox="0 0 150 150" className="absolute inset-0 size-full -rotate-90">
        <defs>
          <linearGradient id="kioskArc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2670e9" />
            <stop offset="100%" stopColor="#7aa7ff" />
          </linearGradient>
        </defs>
        <circle
          cx="75"
          cy="75"
          r={R}
          fill="none"
          stroke="url(#kioskArc)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.25s linear" }}
        />
      </svg>
      {/* leading dot */}
      <span
        className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(122,167,255,0.9)]"
        style={{ left: dotX, top: dotY, transition: "left 0.25s linear, top 0.25s linear" }}
      />
      <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center font-semibold text-[30px] tracking-[-1.2px] text-white">
        {pct}%
      </p>
    </div>
  );
}

// Blue glow button (Figma material) with a text label.
function BlueButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative h-[40px] w-full overflow-hidden rounded-[10px] border border-[#2737cf] text-[13px] font-medium text-white shadow-[0px_10px_40px_0px_rgba(63,74,175,0.5)] transition-opacity disabled:opacity-50"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[10px] bg-gradient-to-b from-[40.909%] from-[rgba(0,0,0,0)] to-[132.96%] to-[#402788] backdrop-blur-[10px]"
      />
      <span className="relative">{children}</span>
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0px_10px_30px_0px_rgba(73,123,255,0.7)]" />
    </button>
  );
}

function RingImg({ size, src, inner }: { size: number; src: string; inner: string }) {
  return (
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center" style={{ width: size, height: size }}>
      <div className="-scale-y-100 flex-none rotate-180">
        <div className="relative" style={{ width: size, height: size }}>
          <div className={`absolute ${inner}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="block size-full max-w-none" src={src} />
          </div>
        </div>
      </div>
    </div>
  );
}
