import { FEED_A, FEED_B, FILMS } from "@/lib/kiosk";

/** Films index with a cursor-following preview, plus the diagonal feed band. */
export default function Films() {
  return (
    <>
      <section id="films">
        <div className="sec-label">01 — Films &amp; series</div>

        {FILMS.map((f) => (
          <a
            key={f.idx}
            className="f-row"
            data-prev={f.img}
            data-cursor={f.cursor}
            href={f.href}
            target="_blank"
            rel="noopener"
          >
            <span className="f-idx">{f.idx}</span>
            <h3>{f.title}</h3>
            <span className="f-meta">{f.meta}</span>
          </a>
        ))}

        {/* Follows the pointer while a row is hovered. */}
        <div id="preview" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={FILMS[0].img} alt="" />
        </div>
      </section>

      <section id="band">
        <div className="sec-label">02 — The feed</div>
        <div className="band-inner">
          {[FEED_A, FEED_B].map((row, r) => (
            <div
              className="b-row"
              key={r}
              data-marquee
              data-dir={r === 0 ? "-1" : "1"}
            >
              {[...row, ...row].map((src, i) => (
                <a data-cursor="View" className="zoom" key={`${src}-${i}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" />
                </a>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
