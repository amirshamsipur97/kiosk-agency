import type { CSSProperties } from "react";
import { NUMBERS, SERVICES } from "@/lib/kiosk";

/**
 * The ivory block: the seven-service index, then the pinned full-screen
 * numbers sequence (numerals are photo-filled via background-clip:text).
 */
export default function Ivory() {
  return (
    <div className="ivory">
      <section id="services">
        <div className="sec-label">03 — Services</div>
        <div className="sv-head">
          <h2 className="display">
            <span className="split-l">
              <span>
                What we <i>do</i>
              </span>
            </span>
          </h2>
          <p>
            Two arms, one accountable team — digital campaigns and physical
            builds under one roof.
          </p>
        </div>

        {SERVICES.map((s) => (
          <div className="s-row" key={s.idx}>
            <span className="s-idx">{s.idx}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
            <span className="s-arm">{s.arm}</span>
          </div>
        ))}
      </section>

      <section id="numbers">
        <div className="n-sticky">
          <div className="sec-label">04 — In numbers</div>

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
    </div>
  );
}
