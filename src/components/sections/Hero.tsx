"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Button from "@/components/ui/Button";
import HeroGlobe from "@/components/hero/HeroGlobe";

// Decorative 4-point sparkles (position %, size px, twinkle delay).
const sparkles = [
  { top: "18%", left: "12%", size: 14, delay: 0 },
  { top: "26%", left: "84%", size: 10, delay: 0.6 },
  { top: "62%", left: "8%", size: 11, delay: 1.1 },
  { top: "70%", left: "90%", size: 16, delay: 0.3 },
  { top: "40%", left: "50%", size: 8, delay: 1.6 },
  { top: "82%", left: "30%", size: 9, delay: 0.9 },
  { top: "14%", left: "60%", size: 9, delay: 1.3 },
];

function Sparkle({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <path
        d="M12 0c.6 6.3 5.7 11.4 12 12-6.3.6-11.4 5.7-12 12-.6-6.3-5.7-11.4-12-12C6.3 11.4 11.4 6.3 12 0z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Hero() {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let onVisible: (() => void) | undefined;

    const ctx = gsap.context(() => {
      // Final, visible state — used as a guaranteed fallback so the hero is
      // never stuck invisible (e.g. if the page loads in a background tab,
      // where requestAnimationFrame — and therefore GSAP — is paused).
      const showFinal = () => {
        gsap.set(".hero-anim", { opacity: 1, y: 0 });
        gsap.set(".hero-spark", { opacity: 0.5 });
      };

      const twinkle = () => {
        gsap.utils.toArray<HTMLElement>(".hero-spark").forEach((el) => {
          const delay = parseFloat(el.dataset.delay ?? "0");
          gsap.fromTo(
            el,
            { opacity: 0, scale: 0.4 },
            {
              opacity: 0.85,
              scale: 1,
              duration: 1.4,
              delay: 0.4 + delay,
              ease: "power2.out",
              onComplete: () => {
                gsap.to(el, {
                  opacity: 0.25,
                  scale: 0.8,
                  duration: 1.6 + delay,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut",
                });
              },
            }
          );
        });
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
        twinkle();
      };

      if (reduce) {
        showFinal();
        return;
      }

      if (document.visibilityState === "visible") {
        playIntro();
      } else {
        // Loaded hidden: show content immediately, then play the intro the
        // first time the tab becomes visible.
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
      {/* Translucent spotlight layered over the site-wide WebGL noise,
          giving the hero extra punch without hiding the grain. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_50%_at_50%_45%,rgba(255,255,255,0.06),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]"
      />

      {/* Network globe centred behind the content */}
      <HeroGlobe />

      {/* Sparkles */}
      <div aria-hidden className="absolute inset-0">
        {sparkles.map((s, i) => (
          <span
            key={i}
            className="hero-spark absolute text-paper/80"
            data-delay={s.delay}
            style={{ top: s.top, left: s.left, opacity: 0 }}
          >
            <Sparkle size={s.size} />
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="container-x relative z-10 flex flex-col items-center py-32 text-center md:py-40">
        <span className="hero-anim inline-flex items-center gap-2 rounded-full border border-line bg-surface/50 px-4 py-1.5 text-xs font-medium tracking-wide text-mist backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Growth-focused digital agency
        </span>

        <h1 className="hero-anim mt-7 max-w-4xl font-display text-4xl font-semibold leading-[1.05] text-balance sm:text-6xl md:text-7xl">
          Build digital systems that generate{" "}
          <span className="text-accent">real business growth</span>
        </h1>

        <p className="hero-anim mt-7 max-w-2xl text-lg leading-relaxed text-mist">
          We combine strategy, content production, website development, CRM
          systems, automation, SEO, and performance marketing to create scalable
          growth ecosystems for modern businesses.
        </p>

        <div className="hero-anim mt-9 flex flex-col gap-3 sm:flex-row">
          <Button href="/contact">Book A Strategy Call</Button>
          <Button href="/case-studies" variant="ghost">
            View Our Work
          </Button>
        </div>
      </div>

      {/* Bottom fade into the next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink"
      />
    </section>
  );
}
