import { Fragment } from "react";
import { TICKER } from "@/lib/kiosk";

/** Full-viewport hero + the marquee ticker that closes it. */
export default function Hero() {
  return (
    <>
      <section id="hero">
        {/* Mouse-trail images are injected here by Motion. */}
        <div id="trail" aria-hidden />

        <div className="h-center">
          <div className="h-kicker" data-hf>
            Creative media · Marketing · Events &amp; production — Muscat
          </div>
          <h1 className="display">
            <span className="hl">
              <span>
                Kiosk<i>.</i>
              </span>
            </span>
          </h1>
          <div className="h-tag" data-hf>
            <span>
              We design <i>/</i>
            </span>
            <span>
              We create <i>/</i>
            </span>
            <span style={{ color: "var(--accent)" }}>You grow</span>
          </div>
        </div>

        <svg className="badge" viewBox="0 0 120 120" data-hf aria-hidden>
          <defs>
            <path
              id="circ"
              d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
            />
          </defs>
          <circle cx="60" cy="60" r="14" />
          <text>
            <textPath href="#circ">
              17 years · 5 countries · one team ·{" "}
            </textPath>
          </text>
        </svg>

        <div className="h-hint" data-hf>
          Move your mouse — then scroll
        </div>
      </section>

      <div className="ticker">
        <div className="t-track" data-marquee data-dir="-1">
          {/* Rendered twice so the loop can wrap at the halfway point. */}
          {[0, 1].map((k) => (
            <span key={k}>
              {TICKER.map((t) => (
                <Fragment key={t}>
                  {t}
                  <i>/</i>
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
