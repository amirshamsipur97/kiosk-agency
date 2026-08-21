"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { idxOf } from "@/lib/cms";
import { useContent } from "./Content";
import InquiryForm from "./InquiryForm";

gsap.registerPlugin(ScrollTrigger);

/**
 * The full services breakdown. Every service is its own full section rather
 * than a row in an accordion: the band alternates white and ivory, the
 * photograph swaps sides, and a giant outlined figure drifts behind the copy.
 * Nothing is hidden behind a click, so the page reads straight through.
 *
 * Motion is additive only. Nothing here is hidden by CSS, so if the script
 * never runs every section still renders complete.
 */
export default function ServiceStage() {
  const { services } = useContent();
  const [inquiry, setInquiry] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return;

      gsap.from(".sv-title > span", {
        yPercent: 112,
        duration: 1,
        ease: "power4.out",
        delay: 0.1,
      });
      gsap.from(".sv-sub", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        delay: 0.35,
        ease: "power3.out",
      });
      // The watermark drifts forever behind the header.
      gsap.to(".sv-ghost", {
        xPercent: -14,
        duration: 26,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>(".sv3-sec").forEach((sec) => {
        const rev = sec.classList.contains("rev");
        const media = sec.querySelector(".sv3-media");
        const img = sec.querySelector(".sv3-media img");

        // The accent rule draws across the top as the section arrives.
        gsap.fromTo(
          sec.querySelector(".sv3-rule"),
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 92%", once: true },
          },
        );

        // The photograph wipes in from whichever edge it sits against.
        gsap.fromTo(
          media,
          { clipPath: rev ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.95,
            ease: "power4.out",
            scrollTrigger: { trigger: sec, start: "top 76%", once: true },
          },
        );
        gsap.fromTo(
          img,
          { scale: 1.24 },
          {
            scale: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: sec, start: "top 76%", once: true },
          },
        );

        gsap.from(sec.querySelectorAll(".sv3-copy > *"), {
          y: 26,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: sec, start: "top 74%", once: true },
        });

        // The outlined figure parallaxes against the scroll.
        gsap.fromTo(
          sec.querySelector(".sv3-num"),
          { yPercent: -26 },
          {
            yPercent: 18,
            ease: "none",
            scrollTrigger: {
              trigger: sec,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="svcstage" ref={rootRef}>
      <header className="sv-hero">
        <div className="sv-ghost" aria-hidden>
          Services
        </div>

        <div className="sv-inner">
          <Link className="k-back" href="/">
            ← Back to home
          </Link>
          <div className="sec-label">Services — full breakdown</div>

          <h1 className="display sv-title">
            <span>
              What we <i>do</i>
            </span>
          </h1>
          <p className="sv-sub">
            Eight capabilities, one accountable team. Every one of them is laid
            out in full below.
          </p>
        </div>
      </header>

      <div className="sv3">
        {services.map((s, i) => (
          <section
            className={`sv3-sec${i % 2 ? " rev alt" : ""}`}
            data-i={i}
            key={s.title}
          >
            <span className="sv3-rule" aria-hidden />
            <span className="sv3-num" aria-hidden>
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="sv3-in">
              <figure className="sv3-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.img} alt={s.title} loading="lazy" />
              </figure>

              <div className="sv3-copy">
                <span className="sv3-idx">{idxOf(i)}</span>
                <h2 className="sv3-title">{s.title}</h2>
                <p className="sv3-body">{s.body}</p>
                <button
                  type="button"
                  className="s-inq"
                  onClick={() => setInquiry(s.title)}
                >
                  Inquiry <span aria-hidden>↗</span>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {inquiry ? (
        <InquiryForm preselect={inquiry} onClose={() => setInquiry(null)} />
      ) : null}
    </section>
  );
}
