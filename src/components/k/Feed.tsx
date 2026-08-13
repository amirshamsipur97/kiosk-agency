import { FEED_A, FEED_B } from "@/lib/kiosk";

/** The diagonal feed band — two counter-scrolling rows of recent work. */
export default function Feed() {
  return (
    <section id="band">
      <div className="sec-label">01 — The feed</div>
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
  );
}
