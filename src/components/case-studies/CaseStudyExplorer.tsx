"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { caseStudies, caseStudyCategories } from "@/lib/content";

export default function CaseStudyExplorer() {
  const [active, setActive] = useState("all");

  const filtered =
    active === "all"
      ? caseStudies
      : caseStudies.filter((c) => c.category === active);

  return (
    <section className="py-16 md:py-24">
      <div className="container-x">
        <div className="flex flex-wrap gap-2">
          {caseStudyCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm transition-colors ${
                active === cat.id
                  ? "bg-accent text-ink"
                  : "border border-line text-mist hover:border-accent hover:text-paper"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study, i) => (
            <Reveal
              key={study.title}
              delay={i * 50}
              as="article"
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:border-accent/40"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(215,255,62,0.10), transparent 60%)",
                }}
              />
              <span className="relative inline-flex w-fit rounded-full border border-line bg-ink/40 px-3 py-1 text-xs text-mist">
                {study.categoryLabel}
              </span>
              <div className="relative">
                <h2 className="font-display text-xl font-semibold leading-snug">
                  {study.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-mist">
                  {study.result}
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-fog transition-colors group-hover:text-accent"
                >
                  Discuss a similar project →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-mist">No case studies in this category yet.</p>
        )}
      </div>
    </section>
  );
}
