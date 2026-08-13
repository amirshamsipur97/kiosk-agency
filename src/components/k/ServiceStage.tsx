"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/kiosk";
import InquiryForm from "./InquiryForm";

gsap.registerPlugin(ScrollTrigger);

/**
 * The full services breakdown. One expandable row per service; opening one
 * wipes its photograph in, slides its number across and closes whatever was
 * open before. The first row starts open so the page never reads as a
 * list of closed doors.
 */
export default function ServiceStage() {
  const [open, setOpen] = useState(0);
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
      gsap.from(".sv2-item", {
        opacity: 0,
        y: 28,
        duration: 0.6,
        stagger: 0.05,
        delay: 0.3,
        ease: "power3.out",
      });
      // The watermark drifts forever behind everything.
      gsap.to(".sv-ghost", {
        xPercent: -14,
        duration: 26,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, root);

    return () => ctx.revert();
  }, []);

  /* Each open row plays its own little reveal. */
  useEffect(() => {
    const item = rootRef.current?.querySelector(`[data-i="${open}"]`);
    if (!item) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          ".sv2-ph",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power4.out" },
          0,
        )
        .fromTo(
          ".sv2-ph img",
          { scale: 1.25 },
          { scale: 1, duration: 1.1, ease: "power3.out" },
          0,
        )
        .fromTo(
          ".sv2-gnum",
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
          0.08,
        )
        .fromTo(
          ".sv2-info > *",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out" },
          0.15,
        );
    }, item as HTMLElement);
    return () => ctx.revert();
  }, [open]);

  return (
    <section id="svcstage" ref={rootRef}>
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
          Eight capabilities, one accountable team. Open a service to see what
          is inside.
        </p>

        <div className="sv2-list">
          {SERVICES.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                className={`sv2-item${isOpen ? " open" : ""}`}
                data-i={i}
                key={s.idx}
              >
                <button
                  className="sv2-head"
                  aria-expanded={isOpen}
                  aria-controls={`svc2-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <i>{s.idx}</i>
                  <h2>{s.title}</h2>
                  <span className="sv2-plus" aria-hidden>
                    +
                  </span>
                </button>

                <div className="sv2-body" id={`svc2-${i}`} role="region">
                  <div className="sv2-body-in">
                    <div className="sv2-grid">
                      <span className="sv2-gnum" aria-hidden>
                        {s.idx.replace("/", "")}
                      </span>
                      <div className="sv2-ph">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={s.img} alt={s.title} loading="lazy" />
                      </div>
                      <div className="sv2-info">
                        <p>{s.body}</p>
                        <button
                          type="button"
                          className="s-inq"
                          onClick={() => setInquiry(s.title)}
                          tabIndex={isOpen ? 0 : -1}
                        >
                          Inquiry <span aria-hidden>↗</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {inquiry ? (
        <InquiryForm preselect={inquiry} onClose={() => setInquiry(null)} />
      ) : null}
    </section>
  );
}
