"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GROUND_SETS } from "@/lib/kiosk";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = GROUND_SETS.reduce((n, s) => n + s.shots.length, 0);

/**
 * The /on-the-ground page: the build archive, in the categories it is filed
 * under. Each category is a band with its own count and a column gallery, so
 * portrait and landscape frames can sit together without being cropped.
 *
 * Motion is additive only. Nothing is hidden by CSS, so the archive renders
 * complete even if the script never runs.
 */
export default function GroundStage() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".gs-title > span", {
        yPercent: 112,
        duration: 1,
        ease: "power4.out",
        delay: 0.1,
      });
      gsap.from(".gs-sub, .gs-tally", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".gs-sec").forEach((sec) => {
        gsap.from(sec.querySelectorAll(".gs-head > *"), {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.07,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 78%", once: true },
        });
        gsap.from(sec.querySelectorAll(".gs-shot"), {
          y: 34,
          opacity: 0,
          duration: 0.7,
          stagger: 0.04,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 72%", once: true },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="groundstage" ref={rootRef}>
      <header className="gs-hero">
        <div className="gs-ghost" aria-hidden>
          Built
        </div>

        <div className="gs-inner">
          <Link className="k-back" href="/">
            ← Back to home
          </Link>
          <div className="sec-label">On the ground — the archive</div>

          <h1 className="display gs-title">
            <span>
              Built by <i>hand</i>
            </span>
          </h1>

          <div className="gs-lead">
            <p className="gs-sub">
              Retail stands, aisle takeovers, illuminated signage, exhibition
              halls and school displays. Drawn, fabricated and installed by our
              own team across the GCC.
            </p>
            <div className="gs-tally">
              <div>
                <b data-count={TOTAL}>0</b>
                <small>Builds shown</small>
              </div>
              <div>
                <b data-count="1000">0</b>
                <small>Built in-house</small>
              </div>
              <div>
                <b data-count="17">0</b>
                <small>Years</small>
              </div>
            </div>
          </div>
        </div>
      </header>

      {GROUND_SETS.map((set) => (
        <section className="gs-sec" id={set.slug} key={set.slug}>
          <div className="gs-inner">
            <div className="gs-head">
              <h2>{set.label}</h2>
              <p>{set.body}</p>
              <span className="gs-count">
                {String(set.shots.length).padStart(2, "0")} shots
              </span>
            </div>

            <div className="gs-grid">
              {set.shots.map((s) => (
                <figure className="gs-shot" key={s.img}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.img} alt={s.caption} loading="lazy" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ))}
    </section>
  );
}
