"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Tier } from "@/lib/packages";

const THEME: Record<
  Tier["theme"],
  { stroke: string; badge: string; radial: string }
> = {
  green: {
    stroke: "#34d399",
    badge:
      "linear-gradient(96deg, rgba(16,141,81,0.25) 16%, rgba(23,23,23,0.25) 63%)",
    radial:
      "radial-gradient(120% 90% at 50% 50%, rgba(12,207,113,0.10) 0%, rgba(0,0,0,0) 72%)",
  },
  amber: {
    stroke: "#fbbf24",
    badge:
      "linear-gradient(96deg, rgba(245,166,35,0.25) 16%, rgba(23,23,23,0.25) 63%)",
    radial:
      "radial-gradient(120% 90% at 50% 50%, rgba(245,166,35,0.10) 0%, rgba(0,0,0,0) 72%)",
  },
  purple: {
    stroke: "#c084fc",
    badge:
      "linear-gradient(96deg, rgba(192,112,216,0.30) 16%, rgba(23,23,23,0.30) 63%)",
    radial:
      "radial-gradient(120% 95% at 50% 40%, rgba(195,140,245,0.22) 0%, rgba(111,83,136,0.12) 50%, rgba(26,26,26,0) 82%)",
  },
  blue: {
    stroke: "#7aa7ff",
    badge:
      "linear-gradient(98deg, rgba(94,106,210,0.25) 16%, rgba(23,23,23,0.25) 63%)",
    radial:
      "radial-gradient(120% 90% at 50% 50%, rgba(92,124,230,0.10) 0%, rgba(0,0,0,0) 72%)",
  },
};

function Check({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 size-[22px] shrink-0">
      <path
        d="M15 10.0147L10.5 15.2528L8.5 13.348M21 12.3957C21 17.1295 16.9705 20.9671 12 20.9671C7.02943 20.9671 3 17.1295 3 12.3957C3 7.66178 7.02943 3.82422 12 3.82422C16.9705 3.82422 21 7.66178 21 12.3957Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({ tier }: { tier: Tier }) {
  const t = THEME[tier.theme];
  return (
    <div
      data-card
      className="relative flex flex-col overflow-hidden rounded-[16px] border border-white/[0.06] p-6 shadow-[0px_4px_10px_0px_rgba(0,0,0,0.3)]"
      style={{
        backgroundColor: "rgba(13,13,15,0.6)",
        backgroundImage: t.radial,
      }}
    >
      {/* plan badge */}
      <span
        className="inline-flex h-[29px] w-fit items-center gap-2 rounded-[16px] border border-white/[0.06] px-2.5"
        style={{ backgroundImage: t.badge }}
      >
        <span
          className="size-[15px] rounded-[5px]"
          style={{ backgroundColor: t.stroke }}
        />
        <span className="text-[13px] font-medium uppercase tracking-[0.65px] text-[#cecece]">
          {tier.name}
        </span>
      </span>

      {/* description */}
      <p className="mt-5 min-h-[42px] text-[15px] leading-[20.8px] text-white opacity-50">
        {tier.description}
      </p>

      {/* CTA */}
      <Link
        href="/contact"
        className={`mt-5 flex h-[38px] items-center justify-center rounded-[26px] text-[14px] transition-opacity hover:opacity-90 ${
          tier.featured
            ? "bg-white text-[#09090a] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.16)]"
            : "border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.03] text-white"
        }`}
      >
        {tier.cta}
      </Link>

      {/* features */}
      <ul className="mt-6 flex flex-col gap-3">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <Check color={t.stroke} />
            <span className="text-[14px] leading-[20px] text-[#e2e8f0]">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PricingCards({ tiers }: { tiers: Tier[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-card]"), {
        y: 56,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 82%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const cols =
    tiers.length === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 xl:grid-cols-4";
  return (
    <div ref={ref} className={`grid items-start gap-5 ${cols}`}>
      {tiers.map((tier) => (
        <Card key={tier.name} tier={tier} />
      ))}
    </div>
  );
}
