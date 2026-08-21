"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { idxOf, waFor } from "@/lib/cms";
import { useContent } from "./Content";
import InquiryForm from "./InquiryForm";

gsap.registerPlugin(ScrollTrigger);

/**
 * The blog. Nothing is published yet, so the page is honest about it: it shows
 * the subjects KIOSK writes about and gives a way to ask for a piece, rather
 * than dressing an empty archive up as a full one. Give an entry an `href` in
 * JOURNAL and its card becomes a link with its date.
 *
 * Motion is additive only, so the index renders complete without the script.
 */
export default function Journal() {
  const { posts, settings } = useContent();
  const live = posts.filter((j) => j.href).length;
  const [inquiry, setInquiry] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.from(".jr-title > span", {
        yPercent: 112,
        duration: 1,
        ease: "power4.out",
        delay: 0.1,
      });
      gsap.from(".jr-sub, .jr-state", {
        opacity: 0,
        y: 16,
        duration: 0.7,
        stagger: 0.08,
        delay: 0.3,
        ease: "power3.out",
      });
      gsap.to(".jr-ghost", {
        xPercent: -12,
        duration: 26,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      /* The grid fades as one piece. A per-card y stagger read as cards
         sitting at different heights, so the cards themselves never move. */
      gsap.from(".jr-grid", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: ".jr-grid", start: "top 86%", once: true },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section id="journal" ref={rootRef}>
      <header className="jr-hero">
        <div className="jr-ghost" aria-hidden>
          Journal
        </div>

        <div className="jr-inner">
          <Link className="k-back" href="/">
            ← Back to home
          </Link>
          <div className="sec-label">Blog — what we write about</div>

          <h1 className="display jr-title">
            <span>
              Ideas for building <i>growth systems</i>
            </span>
          </h1>

          <div className="jr-lead">
            <p className="jr-sub">
              Frameworks, playbooks and breakdowns across SEO, advertising,
              automation and the systems that tie them together. Written from
              accounts we run, not from theory.
            </p>
            <p className="jr-state">
              {live
                ? `${live} pieces published`
                : "The first pieces are being written. Ask for one and we will send it when it lands."}
            </p>
          </div>
        </div>
      </header>

      <div className="jr-inner">
        <div className="jr-grid">
          {posts.map((j, i) => {
            const inner = (
              <>
                <div className="jr-cover">
                  {/* decorative: the heading beneath already names the subject */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={j.img} alt="" loading="lazy" />
                  <i className="jr-idx">{idxOf(i)}</i>
                </div>
                <div className="jr-body">
                  <h2>{j.title}</h2>
                  <p>{j.body}</p>
                  <span className="jr-foot">
                    {j.href ? (
                      <>
                        {j.date} <i aria-hidden>↗</i>
                      </>
                    ) : (
                      "In progress"
                    )}
                  </span>
                </div>
              </>
            );

            return j.href ? (
              <Link className="jr-card is-live" href={j.href} key={j.title}>
                {inner}
              </Link>
            ) : (
              <article className="jr-card" key={j.title}>
                {inner}
              </article>
            );
          })}
        </div>

        <div className="jr-cta">
          <h2>
            Want one of these <i>applied</i> to your business?
          </h2>
          <p>
            You do not have to wait for the article. Tell us what you are trying
            to grow and we will walk you through it.
          </p>
          <div className="jr-actions">
            <button
              type="button"
              className="s-inq jr-inq"
              onClick={() => setInquiry(true)}
            >
              Start a project <span aria-hidden>↗</span>
            </button>
            <a
              className="jr-alt"
              href={waFor(
                settings,
                "Hello KIOSK, I have a question about growth systems.",
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      {inquiry ? <InquiryForm onClose={() => setInquiry(false)} /> : null}
    </section>
  );
}
