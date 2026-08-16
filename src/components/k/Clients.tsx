import { Fragment } from "react";
import { BRAND_COUNT, CLIENTS, WALL_ROWS } from "@/lib/kiosk";

/**
 * Kinetic brand wall — four marquee rows of outlined names running in
 * alternating directions. Each row is its segment rendered three times so the
 * loop can wrap at a third of the width; Motion drives the tweens, the
 * roaming spotlight and the sector chip.
 */
export default function Clients() {
  const rows = Array.from({ length: WALL_ROWS }, (_, r) =>
    CLIENTS.filter((_, i) => i % WALL_ROWS === r),
  );

  return (
    <section id="clients">
      <div className="cw-inner">
        <div className="sec-label">05 — Delivered for</div>
        <div className="cw-top">
          <h2 className="cw-h">
            Brands we&apos;ve <i>delivered for</i>
          </h2>
          <div className="cw-tally">
            <div>
              <b data-count={BRAND_COUNT}>0</b>
              <small>Brands</small>
            </div>
            <div>
              <b data-count="5">0</b>
              <small>Countries</small>
            </div>
            <div>
              <b data-count="17">0</b>
              <small>Years</small>
            </div>
          </div>
        </div>
      </div>

      <div className="cw-wall" id="cwWall">
        {rows.map((row, r) => (
          <div className="cw-row" key={r}>
            {[0, 1, 2].map((copy) => (
              <div className="seg" key={copy} aria-hidden={copy > 0}>
                {/* Fragment, never a wrapper element: .seg is the flex
                    context that gives .cw-dot its 9×9 box. */}
                {row.map((c) => (
                  <Fragment key={c.name}>
                    <span
                      className={`cw-name${c.featured ? " feat" : ""}`}
                      data-sec={c.sector}
                    >
                      {c.name}
                    </span>
                    <i className="cw-dot" />
                  </Fragment>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="cw-inner cw-footrow">
        <span>…and growing. Ask us for sector-specific references.</span>
        <span className="cw-hint">Hover a name</span>
      </div>

      <div className="cw-chip" id="cwChip" aria-hidden />
    </section>
  );
}
