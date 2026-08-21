"use client";

import { FEED_A, FEED_B } from "@/lib/kiosk";
import { useContent } from "./Content";

/**
 * The diagonal feed band, two counter-scrolling rows of recent work.
 *
 * Every film's thumbnail leads the band, so adding a film in the panel puts it
 * on the landing page as well without anyone touching this file. The standing
 * library fills the rest of the rows out. A thumbnail already in the library
 * is not shown twice.
 */
export default function Feed() {
  const { films } = useContent();

  const covers = films.map((f) => f.img).filter(Boolean);
  const fill = (row: string[]) => [
    ...covers,
    ...row.filter((src) => !covers.includes(src)),
  ];
  const rows = [fill(FEED_A), fill(FEED_B)];

  return (
    <section id="band">
      <div className="sec-label">01 — The feed</div>
      <div className="band-inner">
        {rows.map((row, r) => (
          <div
            className="b-row"
            key={r}
            data-marquee
            data-dir={r === 0 ? "-1" : "1"}
          >
            {/* rendered twice: the marquee wraps at the middle child */}
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
