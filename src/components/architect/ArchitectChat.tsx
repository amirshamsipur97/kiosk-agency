"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";

type Recommendation = {
  summary_message?: string;
  scores?: Record<string, number>;
  recommended_services?: string[];
  recommended_ai_products?: string[];
  recommended_package?: string;
  growth_roadmap?: Array<{
    phase?: string;
    title?: string;
    timeline?: string;
    priority?: string;
    items?: string[];
    expected_outcomes?: string[];
  }>;
  executive_summary?: string;
  proposal?: {
    overview?: string;
    timeline?: string;
    budget_range?: string;
    next_steps?: string[];
  };
};

type Msg = { role: "user" | "assistant"; content: string; rec?: Recommendation };

export type Lookups = {
  services: Record<string, string>;
  products: Record<string, string>;
  packages: Record<string, { name: string; ideal: string }>;
};

const GREETING =
  "Hi — I'm KIOSK's AI Growth Architect. Tell me about your business and I'll map out the exact systems, AI products, and package that will help you grow. What industry are you in?";

const SCORE_LABELS: Record<string, string> = {
  business_maturity: "Business Maturity",
  digital_readiness: "Digital Readiness",
  growth_potential: "Growth Potential",
  automation_readiness: "Automation Readiness",
};

function pretty(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-fog">{label}</span>
        <span className="font-semibold text-paper">{v}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-700 ease-out"
          style={{ width: `${v}%` }}
        />
      </div>
    </div>
  );
}

function RecommendationCard({
  rec,
  lookups,
}: {
  rec: Recommendation;
  lookups: Lookups;
}) {
  const pkg = rec.recommended_package
    ? lookups.packages[rec.recommended_package]
    : undefined;
  return (
    <div className="mt-3 space-y-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
      {/* Scores */}
      {rec.scores && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-3">
          {Object.entries(rec.scores).map(([k, v]) => (
            <ScoreBar key={k} label={SCORE_LABELS[k] ?? pretty(k)} value={v} />
          ))}
        </div>
      )}

      {/* Recommended services */}
      {rec.recommended_services && rec.recommended_services.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Recommended Services
          </p>
          <div className="flex flex-wrap gap-2">
            {rec.recommended_services.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1.5 text-xs text-paper"
              >
                {lookups.services[s] ?? pretty(s)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* AI products */}
      {rec.recommended_ai_products && rec.recommended_ai_products.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            AI Products
          </p>
          <div className="flex flex-wrap gap-2">
            {rec.recommended_ai_products.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/[0.08] px-2.5 py-1.5 text-xs text-paper"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {lookups.products[p] ?? pretty(p)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Package */}
      {pkg && (
        <div className="rounded-xl border border-accent/30 bg-accent/[0.06] p-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
            Recommended Package
          </p>
          <p className="mt-1 font-display text-lg font-semibold text-paper">
            {pkg.name}
          </p>
          {pkg.ideal && (
            <p className="mt-1 text-xs leading-relaxed text-mist">{pkg.ideal}</p>
          )}
        </div>
      )}

      {/* Roadmap */}
      {rec.growth_roadmap && rec.growth_roadmap.length > 0 && (
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Growth Roadmap
          </p>
          <ol className="space-y-3">
            {rec.growth_roadmap.map((ph, i) => (
              <li key={i} className="relative pl-6">
                <span className="absolute left-0 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-ink">
                  {i + 1}
                </span>
                <p className="text-sm font-medium text-paper">
                  {ph.title || ph.phase}
                  {ph.timeline && (
                    <span className="ml-2 text-xs font-normal text-fog">
                      {ph.timeline}
                    </span>
                  )}
                </p>
                {ph.items && ph.items.length > 0 && (
                  <p className="mt-0.5 text-xs leading-relaxed text-mist">
                    {ph.items.join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Executive summary */}
      {rec.executive_summary && (
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Executive Summary
          </p>
          <p className="text-xs leading-relaxed text-mist">
            {rec.executive_summary}
          </p>
        </div>
      )}

      <Button href="/contact" className="w-full justify-center px-4 py-2.5 text-sm">
        Book A Strategy Call
      </Button>
    </div>
  );
}

export default function ArchitectChat({
  lookups,
  industries,
}: {
  lookups: Lookups;
  industries: string[];
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              data?.error ||
              "Something went wrong. Please try again, or book a strategy call.",
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: data.reply || "",
            rec: data.recommendation,
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Network error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const showChips = messages.length === 0;

  return (
    <div className="flex h-[560px] flex-col">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6 [scrollbar-width:thin]"
      >
        {/* Greeting */}
        <div className="flex gap-3">
          <Avatar />
          <Bubble role="assistant">{GREETING}</Bubble>
        </div>

        {/* Industry quick chips */}
        {showChips && (
          <div className="flex flex-wrap gap-2 pl-11">
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => send(`My business is in ${ind}.`)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-mist transition-colors hover:border-accent/40 hover:text-paper"
              >
                {ind}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
          >
            {m.role === "assistant" && <Avatar />}
            <div className={m.role === "user" ? "max-w-[80%]" : "max-w-[88%]"}>
              {m.content && <Bubble role={m.role}>{m.content}</Bubble>}
              {m.rec && <RecommendationCard rec={m.rec} lookups={lookups} />}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <Avatar />
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.03] px-4 py-3">
              <Dot /> <Dot delay="0.15s" /> <Dot delay="0.3s" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            rows={1}
            placeholder="Describe your business or goal…"
            className="max-h-28 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-paper placeholder:text-fog focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            aria-label="Send"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-ink transition-opacity disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/[0.08] text-accent">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v3M5 8l2 2M19 8l-2 2M6 21v-5a6 6 0 1 1 12 0v5z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "user" | "assistant";
  children: React.ReactNode;
}) {
  return (
    <div
      className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
        role === "user"
          ? "rounded-tr-sm bg-accent/[0.12] text-paper"
          : "rounded-tl-sm border border-white/10 bg-white/[0.03] text-paper"
      }`}
    >
      {children}
    </div>
  );
}

function Dot({ delay = "0s" }: { delay?: string }) {
  return (
    <span
      className="inline-block size-1.5 animate-bounce rounded-full bg-fog"
      style={{ animationDelay: delay }}
    />
  );
}
