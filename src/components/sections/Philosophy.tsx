"use client";

import { useRef } from "react";
import Reveal from "@/components/ui/Reveal";

type Pillar = { name: string; desc: string };

const pillars: Pillar[] = [
  { name: "Strategy", desc: "Business-first thinking before execution." },
  { name: "Ecosystems", desc: "Connected platforms, marketing & automation." },
  { name: "Analytics", desc: "Data-driven decisions and measurable growth." },
  { name: "Scale", desc: "Built to grow with your business." },
];

// Glassy "material" card with a soft spotlight that follows the cursor.
function PillarCard({ name, desc, index }: Pillar & { index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-[10px] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.06),0px_12px_30px_-14px_rgba(0,0,0,0.7)]"
    >
      {/* Cursor-following spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.10), transparent 60%)",
        }}
      />
      {/* Inner top-light glow (material) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0px_1px_3px_0px_rgba(199,220,255,0.16),inset_0px_0px_26px_0px_rgba(198,204,255,0.07)]"
      />

      <div className="relative flex h-full flex-col">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1 text-xs font-medium tracking-wide text-paper/85">
            {name}
          </span>
          <span className="font-display text-xs font-medium tabular-nums text-white/25">
            0{index + 1}
          </span>
        </div>
        <p className="mt-5 text-[15px] leading-relaxed text-mist">{desc}</p>
      </div>
    </div>
  );
}

export default function Philosophy() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        {/* Heading */}
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-paper/70 backdrop-blur-[10px] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.08)]">
            Our Philosophy
          </span>
          <h2 className="mt-6 bg-gradient-to-r from-[#f4f4f5] to-[#8e8e8f] bg-clip-text pb-1 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-transparent text-balance sm:text-4xl md:text-5xl">
            We don&rsquo;t sell services.
            <br />
            We build systems.
          </h2>
        </Reveal>

        {/* Pillars */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-16">
          {pillars.map((p, i) => (
            <Reveal key={p.name} delay={80 * i} className="h-full">
              <PillarCard {...p} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
