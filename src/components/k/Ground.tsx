import Link from "next/link";
import { GROUND } from "@/lib/kiosk";

/** Draggable build gallery, then the campaign proof statement. */
export default function Ground() {
  return (
    <>
      <section id="ground">
        <div className="sec-label">04 — On the ground</div>
        <div className="g-head">
          <h2 className="display">
            <span className="split-l">
              <span>
                Built by <i>hand</i>
              </span>
            </span>
          </h2>
          <div className="g-head-r">
            <p>
              Retail stands, aisle takeovers, illuminated signage and exhibition
              halls. Drawn, fabricated and installed by our own team, over 1000
              builds so far.
            </p>
            <Link className="sv-all" href="/on-the-ground">
              See the archive ↗
            </Link>
          </div>
        </div>

        <div className="strip duo" id="strip">
          {GROUND.map((g) => (
            <figure className="st-item" key={g.caption}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.img} alt={g.caption} loading="lazy" draggable={false} />
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
        <div className="st-hint">← Drag to explore · hover for color</div>
      </section>

      <section id="proof">
        <h2 className="display rv">
          <em>
            <span data-count="60">0</span>+ qualified leads
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
              <path className="sig" d="M4 16 C60 6, 140 20, 296 10" />
            </svg>
          </em>
          <br />
          from a one-month
          <br />
          campaign.
        </h2>
        <p className="rv">
          Across international markets, focused on qualified leads and real
          business opportunities, not vanity metrics.
        </p>
      </section>
    </>
  );
}
