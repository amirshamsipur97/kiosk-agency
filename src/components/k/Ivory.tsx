"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { NUMBERS, SERVICES } from "@/lib/kiosk";
import InquiryForm from "./InquiryForm";

/**
 * The ivory block: the services accordion, then the pinned full-screen numbers
 * sequence (numerals are photo-filled via background-clip:text).
 *
 * Each service is an index row that opens to its description and an inquiry
 * button. One is open at a time and the first starts open, so the section
 * never reads as a list of closed doors.
 */
export default function Ivory() {
  const [open, setOpen] = useState(0);
  // Which service the inquiry dialog was opened from, so it can preselect it.
  const [inquiry, setInquiry] = useState<string | null>(null);

  return (
    <div className="ivory">
      <section id="services">
        <div className="sec-label">02 — Services</div>
        <div className="sv-head">
          <h2 className="display">
            <span className="split-l">
              <span>
                What we <i>do</i>
              </span>
            </span>
          </h2>
          <div className="sv-head-r">
            <p>
              Two arms, one accountable team — digital campaigns and physical
              builds under one roof.
            </p>
            <Link className="sv-all" href="/services">
              Full breakdown ↗
            </Link>
          </div>
        </div>

        {SERVICES.map((s, i) => {
          const isOpen = open === i;
          return (
            <div className={`s-item${isOpen ? " open" : ""}`} key={s.idx}>
              {/* The toggle is a layer behind the row, so the inquiry pill can
                  sit inside the row without nesting one button in another. */}
              <div className="s-row">
                <button
                  className="s-toggle"
                  aria-expanded={isOpen}
                  aria-controls={`svc-${i}`}
                  aria-label={`${s.title} details`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                />
                <span className="s-idx">{s.idx}</span>
                <h3>{s.title}</h3>
                <button
                  type="button"
                  className="s-inq"
                  onClick={() => setInquiry(s.title)}
                >
                  Inquiry <span aria-hidden>↗</span>
                </button>
                <span className="s-plus" aria-hidden>
                  +
                </span>
              </div>

              <div className="s-body" id={`svc-${i}`} role="region">
                <div className="s-body-in">
                  <div className="s-drawer">
                    <p>{s.body}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section id="numbers">
        <div className="n-sticky">
          <div className="sec-label">03 — In numbers</div>

          <div className="n-stage">
            {NUMBERS.map((n, i) => (
              <div
                key={n.target}
                className={`n-slide${i === 0 ? " on" : ""}`}
                data-target={n.target}
                data-suffix={n.suffix || undefined}
                style={{ "--img": `url(${n.img})` } as CSSProperties}
              >
                <div className="n-fig">
                  <span className="n-ghost">{n.target}</span>
                  <span className="n-num">{n.target}</span>
                  {n.suffix ? <span className="n-plus">{n.suffix}</span> : null}
                </div>
                <div className="n-copy">
                  <h3>{n.title}</h3>
                  <p>{n.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="n-rail" id="nRail">
            {NUMBERS.map((n, i) => (
              <button key={n.target} data-i={i} className={i === 0 ? "on" : ""}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="bar" />
              </button>
            ))}
          </div>

          <div className="n-prog" id="nProg" />
        </div>
      </section>

      {inquiry ? (
        <InquiryForm preselect={inquiry} onClose={() => setInquiry(null)} />
      ) : null}
    </div>
  );
}
