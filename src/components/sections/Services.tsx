"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { services as allServices } from "@/lib/services";

const FEATURED = [
  "website-digital-systems",
  "media-content",
  "growth-marketing",
  "automation-crm",
];
const services = FEATURED.map(
  (slug) => allServices.find((s) => s.slug === slug)!
).filter(Boolean);

const PANEL_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";
const PANEL_HIGHLIGHT =
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
      aria-label={`Show what's included in ${label}`}
      onClick={onToggle}
      className="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-300 ease-out"
      style={{ backgroundColor: on ? "#df6a1b" : "rgba(255,255,255,0.16)" }}
    >
      <span
        className="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: on ? "translateX(16px)" : "translateX(0)" }}
      />
    </button>
  );
}

function Row({
  service,
  open,
  onToggle,
}: {
  service: (typeof services)[number];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      data-row
      className="relative md:grid md:min-h-[460px] md:grid-cols-[1fr_auto_1fr] md:items-start"
    >
      {/* Title + summary + toggle */}
      <div data-left className="md:py-14 md:pr-14">
        <h3 className="inline-block bg-[radial-gradient(90%_140%_at_30%_50%,#ffffff_25%,rgba(255,255,255,0.42)_100%)] bg-clip-text pb-1 font-display text-3xl font-medium leading-[1.15] tracking-tight text-transparent text-balance sm:text-4xl">
          {service.name}
        </h3>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#a1a1aa]">
          {service.overview}
        </p>
        <div className="mt-6 flex items-center gap-3">
          <Toggle on={open} onToggle={onToggle} label={service.name} />
          <span className="text-xs font-medium tracking-wide text-fog">
            Show capabilities
          </span>
        </div>
      </div>

      {/* Dot */}
      <div className="hidden w-16 shrink-0 justify-center md:flex md:py-14">
        <span
          data-dot
          className="mt-1.5 size-[15px] shrink-0 rounded-full bg-white shadow-[0_0_0_5px_rgba(223,106,27,0.14)]"
        />
      </div>

      {/* Capabilities (scroll-/toggle-driven) + learn more */}
      <div data-right className="mt-6 md:mt-0 md:py-14 md:pl-14">
        <div
          className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
          style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
        >
          <div className="overflow-hidden">
            <div
              className="relative mb-5 max-w-[460px] overflow-hidden"
              style={{ backgroundImage: PANEL_SHEEN }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{ backgroundImage: PANEL_HIGHLIGHT }}
              />
              <div className="relative">
                <p className="px-4 pb-1 pt-4 text-[15px] font-semibold tracking-[-0.375px] text-white">
                  Capabilities
                </p>
                <div className="flex flex-col">
                  {service.services.slice(0, 5).map((item) => (
                    <div
                      key={item}
                      className="px-4 transition-colors duration-200 hover:bg-white/[0.03]"
                    >
                      <div className="py-3 text-sm text-[#bdbec1]">{item}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/services/${service.slug}`}
          className="group/link inline-flex items-center gap-2 text-sm font-medium text-[#df6a1b]"
        >
          Learn more
          <span className="transition-transform duration-300 group-hover/link:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const root = useRef<HTMLDivElement | null>(null);
  const progress = useRef<HTMLDivElement | null>(null);
  const [openSet, setOpenSet] = useState<boolean[]>(() =>
    services.map(() => false)
  );

  const setOpen = (i: number, val: boolean) =>
    setOpenSet((prev) => {
      if (prev[i] === val) return prev;
      const next = [...prev];
      next[i] = val;
      return next;
    });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No scroll motion → reveal everything open.
      setOpenSet(services.map(() => true));
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Slower, smoother line draw (higher scrub = more easing/lag).
      if (progress.current) {
        gsap.fromTo(
          progress.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.current!,
              start: "top 68%",
              end: "bottom 60%",
              scrub: 1.4,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row, i) => {
        const left = row.querySelector("[data-left]");
        const right = row.querySelector("[data-right]");
        const dot = row.querySelector("[data-dot]");

        // Gentle reveal of the row as it enters.
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: "top 82%" } })
          .from(left, { x: -42, opacity: 0, duration: 1, ease: "power3.out" }, 0)
          .from(right, { x: 42, opacity: 0, duration: 1, ease: "power3.out" }, 0.08)
          .from(dot, { scale: 0, opacity: 0, duration: 0.55, ease: "back.out(2)" }, 0.15);

        // Scroll-driven toggle: opens when you reach the box (down), closes on
        // the way back up — one after another.
        ScrollTrigger.create({
          trigger: row,
          start: "top 60%",
          onEnter: () => setOpen(i, true),
          onLeaveBack: () => setOpen(i, false),
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

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

        {/* Timeline */}
        <div ref={root} className="relative mt-10 overflow-hidden md:mt-14">
          {/* Center line — black track, orange progress that draws on scroll */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 hidden h-full w-[2px] -translate-x-1/2 bg-[#0a0a0b] md:block"
          >
            <div
              ref={progress}
              className="absolute inset-x-0 top-0 h-full origin-top bg-[#df6a1b]"
            />
          </div>

          <div className="flex flex-col gap-12 md:gap-0">
            {services.map((service, i) => (
              <Row
                key={service.slug}
                service={service}
                open={openSet[i]}
                onToggle={() => setOpen(i, !openSet[i])}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
