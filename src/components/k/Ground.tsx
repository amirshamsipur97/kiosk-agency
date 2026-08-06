import { GROUND } from "@/lib/kiosk";

/** Draggable build gallery, then the campaign proof statement. */
export default function Ground() {
  return (
    <>
      <section id="ground">
        <div className="sec-label">05 — On the ground</div>
        <div className="g-head">
          <h2 className="display">
            <span className="split-l">
              <span>
                Built by <i>hand</i>
              </span>
            </span>
          </h2>
          <p>
            Exhibitions, activations and retail — 1000+ builds designed,
            fabricated and installed by our own team.
          </p>
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
            <span data-count="60">0</span>+ qualified buyers
            <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden>
              <path className="sig" d="M4 16 C60 6, 140 20, 296 10" />
            </svg>
          </em>
          <br />
          from one two-week campaign.
        </h2>
        <p className="rv">
          Across KSA, the UAE and Germany — measured in inquiries and sales
          conversations, not vanity metrics.
        </p>
      </section>
    </>
  );
}
