"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import HeroSignals from "@/components/hero/HeroSignals";

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let onVisible: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Guaranteed visible fallback (e.g. loaded in a background tab where rAF
      // — and therefore GSAP — is paused), so the hero is never stuck hidden.
      const showFinal = () => {
        gsap.set(".hero-anim", { opacity: 1, y: 0 });
      };

      const playIntro = () => {
        gsap.from(".hero-anim", {
          opacity: 0,
          y: 28,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.09,
          delay: 0.15,
        });
      };

      if (reduce) {
        showFinal();
        return;
      }

      if (document.visibilityState === "visible") {
        playIntro();
      } else {
        showFinal();
        onVisible = () => {
          if (document.visibilityState === "visible") {
            document.removeEventListener("visibilitychange", onVisible!);
            onVisible = undefined;
            ctx.add(playIntro);
          }
        };
        document.addEventListener("visibilitychange", onVisible);
      }
    }, root);

    return () => {
      if (onVisible) document.removeEventListener("visibilitychange", onVisible);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden"
    >
      {/* Concentric pattern (Figma 411:17322) — square, centred, anchored to the
          bottom of the hero. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/pattern.svg?v=3"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 aspect-square w-[854px] max-w-none -translate-x-1/2 -scale-y-100 select-none"
      />

      {/* Orange signal streaks travelling along the ring borders */}
      <HeroSignals />

      {/* Content */}
      <div className="container-x relative z-10 flex flex-col items-center py-32 text-center md:py-40">
        {/* Glassy "material" pill ported exactly from the Framer/Figma template
            (frosted backdrop + white edge + inner top-light glow). */}
        <span className="hero-anim relative inline-flex items-center gap-2 rounded-lg border border-white px-4 py-1.5 text-[13px] font-medium leading-5 text-white shadow-[0px_1px_22px_0px_rgba(255,255,255,0.1),0px_4px_4px_0px_rgba(0,0,0,0.05),0px_10px_10px_0px_rgba(0,0,0,0.1)]">
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg bg-white/[0.02] backdrop-blur-[10px]"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-lg shadow-[inset_0px_1px_3px_0px_rgba(199,220,255,0.35),inset_0px_0px_20px_0px_rgba(198,204,255,0.2)]"
          />
          <span className="relative">Growth-focused digital agency</span>
          <svg
            className="relative size-4 shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M6 3.5 10.5 8 6 12.5" />
          </svg>
        </span>

        <h1 className="hero-anim mt-7 max-w-4xl bg-gradient-to-r from-white to-[#999] bg-clip-text pb-2 font-display text-[1.8rem] font-semibold leading-[1.15] tracking-tight text-transparent text-balance sm:text-[3rem] md:text-[3.6rem]">
          The Smarter Way to Grow Your Business
        </h1>

        <p className="hero-anim mt-7 max-w-2xl text-lg leading-relaxed text-[#a1a1aa]">
          Kiosk Agency is a full-service digital agency focused on building
          scalable, high-performance systems for modern businesses.
        </p>

        <div className="hero-anim mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact">Book A Strategy Call</Button>
          <Button href="/case-studies" variant="ghost">
            View Our Work
          </Button>
        </div>
      </div>
    </section>
  );
}
