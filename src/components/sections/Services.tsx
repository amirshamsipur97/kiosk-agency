"use client";

import { useState } from "react";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { services as allServices } from "@/lib/services";

// Featured services shown on the homepage, in order.
const FEATURED = [
  "website-digital-systems",
  "media-content",
  "growth-marketing",
  "automation-crm",
];

const services = FEATURED.map(
  (slug) => allServices.find((s) => s.slug === slug)!,
).filter(Boolean);

// Short explanation for each capability, revealed when its toggle is on.
const DETAILS: Record<string, string> = {
  "UI/UX Design": "Research-led interface design that turns visitors into customers.",
  "Website Development": "Fast, scalable builds engineered for performance and conversion.",
  "Custom CMS": "Edit and manage your content without ever touching code.",
  "E-Commerce Solutions": "Storefronts and checkout flows built to sell.",
  Videography: "Cinematic video that captures attention and builds trust.",
  Photography: "Polished, on-brand imagery for every channel.",
  "Commercial Production": "End-to-end production for ads and brand films.",
  "Drone Production": "Aerial footage that adds scale and production value.",
  "Google Ads": "High-intent search campaigns tuned for return on ad spend.",
  "Meta Ads": "Targeted social campaigns across Instagram and Facebook.",
  "Lead Generation Funnels": "Landing pages and flows that turn clicks into leads.",
  Remarketing: "Re-engage warm audiences and recover lost conversions.",
  "Workflow Automation": "Automate repetitive work so your team focuses on closing.",
  "CRM Setup": "A clean, structured CRM tailored to your sales process.",
  "CRM Integration": "Connect your tools so data flows in one place.",
  "AI Response Systems": "Instant, smart replies that never keep a lead waiting.",
};

// Linear "Triage" card materials (square — no radius).
const CARD_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";
const CARD_HIGHLIGHT =
  "linear-gradient(140deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 45%)";

function Toggle({
  on,
  onToggle,
  label,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Show details for ${label}`}
      onClick={onToggle}
      className="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ease-out"
      style={{ backgroundColor: on ? "var(--color-accent, #c6f24e)" : "rgba(255,255,255,0.16)" }}
    >
      <span
        className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

function CapabilityRow({ item }: { item: string }) {
  const [open, setOpen] = useState(false);
  const detail = DETAILS[item];
  return (
    <div className="border-b border-white/[0.06] last:border-b-0">
      <div className="flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-200 hover:bg-white/[0.04]">
        <span
          className={`text-sm transition-colors duration-200 ${
            open ? "text-white" : "text-[#bdbec1]"
          }`}
        >
          {item}
        </span>
        {detail && <Toggle on={open} onToggle={() => setOpen((v) => !v)} label={item} />}
      </div>
      {detail && (
        <div
          className="grid transition-[grid-template-rows,opacity] duration-300 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <p className="px-4 pb-3 text-[13px] leading-relaxed text-[#8a8b8e]">
              {detail}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ServiceCard({
  service,
}: {
  service: (typeof services)[number];
}) {
  return (
    <div className="mt-1 border border-white/[0.06] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] transition-colors duration-300 group-hover:border-white/[0.14]">
      <div
        className="relative overflow-hidden border border-white/[0.08]"
        style={{ backgroundImage: CARD_SHEEN }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          style={{ backgroundImage: CARD_HIGHLIGHT }}
        />
        <div className="relative flex flex-col">
          <p className="px-4 pb-1 pt-4 text-[15px] font-semibold tracking-tight text-white">
            Capabilities
          </p>
          <div className="flex flex-col">
            {service.services.slice(0, 4).map((item) => (
              <CapabilityRow key={item} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Services"
            title="Connected services built for growth"
          />
          <Reveal delay={120}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent"
            >
              Explore all services →
            </Link>
          </Reveal>
        </div>

        {/* Linear-style bordered feature grid */}
        <div className="mt-12 grid border-t border-white/[0.06] md:mt-16 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 80}
              as="article"
              className="group relative flex flex-col gap-5 border-b border-white/[0.06] py-10 md:px-10 md:[&:nth-child(even)]:pr-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:pl-0"
            >
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-semibold tracking-tight text-paper">
                  {service.name}
                </h3>
                <p className="max-w-md text-[15px] leading-relaxed text-mist">
                  {service.overview}
                </p>
              </div>

              <ServiceCard service={service} />

              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent"
              >
                Learn more
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
