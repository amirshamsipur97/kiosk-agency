"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

type Capability = {
  label: string;
  category: string;
  output: string;
  blurb: string;
};

const capabilities: Capability[] = [
  {
    label: "Build Strong Digital Presence",
    category: "Brand & Web",
    output: "Identity, site, social",
    blurb:
      "A coherent brand and digital footprint that makes the right first impression everywhere.",
  },
  {
    label: "Develop High-Performance Websites & Platforms",
    category: "Engineering",
    output: "Sites, CMS, e-commerce",
    blurb:
      "Fast, scalable platforms built to convert visitors and stay easy to manage.",
  },
  {
    label: "Create Premium Visual Content",
    category: "Production",
    output: "Video, photo, design",
    blurb:
      "Premium video, photography, and design that build attention and trust.",
  },
  {
    label: "Generate Qualified Leads Through Marketing",
    category: "Growth",
    output: "Funnels, ads, SEO",
    blurb:
      "Performance campaigns engineered to deliver qualified leads at a lower cost.",
  },
  {
    label: "Implement CRM & Automation Systems",
    category: "Operations",
    output: "CRM, workflows, AI",
    blurb:
      "Connected CRM and automation that remove manual work and speed up follow-up.",
  },
  {
    label: "Build Scalable Growth Infrastructure",
    category: "Systems",
    output: "Dashboards, reporting",
    blurb:
      "The measurement and infrastructure that lets the whole system scale with you.",
  },
];

export default function WhatWeDo() {
  const [active, setActive] = useState(0);
  const item = capabilities[active];

  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        {/* Top heading */}
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
            Six capabilities, one system.
          </h2>
          <p className="mt-2 text-lg text-fog sm:text-xl">
            One connected system, everything you need to grow.
          </p>
        </Reveal>

        {/* Window frame */}
        <Reveal delay={120} className="mt-12 md:mt-16">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[20px] border border-white/10 bg-[linear-gradient(150deg,rgba(20,21,24,0.9),rgba(10,11,13,0.95))] shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.08)]">
            {/* Internal lime glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute right-[8%] top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]"
            />

            {/* Toolbar */}
            <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-fog">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Type to filter capabilities…
              </div>
              <span className="ml-auto rounded-lg border border-white/10 px-3 py-2 text-xs text-fog">
                All capabilities
              </span>
            </div>

            {/* Body: list + detail */}
            <div className="relative grid md:grid-cols-[1.05fr_1fr]">
              {/* List */}
              <ul className="border-b border-white/10 p-2 md:border-b-0 md:border-r">
                <li className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Capabilities
                </li>
                {capabilities.map((c, i) => {
                  const isActive = i === active;
                  return (
                    <li key={c.label}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-white/[0.06] text-paper"
                            : "text-mist hover:bg-white/[0.03] hover:text-paper"
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-semibold ${
                            isActive
                              ? "bg-accent text-ink"
                              : "bg-white/[0.06] text-fog"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="leading-snug">{c.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Detail */}
              <div className="relative flex flex-col p-6">
                <h3 className="font-display text-lg font-semibold text-paper">
                  {item.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {item.blurb}
                </p>

                <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
                  Information
                </p>
                <dl className="mt-3 space-y-2.5 text-sm">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <dt className="text-fog">Category</dt>
                    <dd className="text-paper">{item.category}</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <dt className="text-fog">Output</dt>
                    <dd className="text-paper">{item.output}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-fog">Status</dt>
                    <dd className="inline-flex items-center gap-2 text-paper">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Available
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Footer bar */}
            <div className="relative flex items-center justify-between border-t border-white/10 px-4 py-3 text-xs text-fog">
              <span>Part of your connected growth system</span>
              <Button href="/contact" className="px-4 py-2 text-xs">
                Book A Strategy Call
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Bottom caption */}
        <Reveal delay={160} className="mx-auto mt-12 max-w-xl text-center">
          <h3 className="text-base font-medium text-paper">
            Everything in one place.
          </h3>
          <p className="mt-1 text-base text-white/40">
            Strategy, build, marketing, and automation — connected so nothing
            falls through the cracks.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
