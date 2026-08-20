"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FILMS } from "@/lib/kiosk";

gsap.registerPlugin(ScrollTrigger);

/** The side rail repeats the films so the edges of the screen are never bare. */
const RAIL = [...FILMS, ...FILMS, ...FILMS];

/**
 * Each film gets its own feel as it passes through the frame, so the reel
 * reads as separate films rather than one long strip being dragged.
 *
 *  dwell  how much of its scroll segment the film holds dead still in the
 *         frame before the next one starts moving in. This is the magnet.
 *  drift  how far its image slides inside its own cell while it crosses,
 *         as a fraction of the frame width.
 *  pop    how much it swells as it lands in the middle.
 *
 * Derived from the index rather than random, so the behaviour is the same on
 * every visit and identical between server and client.
 */
const CHARACTER = FILMS.map((_, i) => ({
  dwell: 0.13 + 0.03 * (i % 3),
  drift: 0.05 + 0.035 * ((i + 1) % 3),
  pop: 0.03 + 0.025 * (i % 2),
}));

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Turn a linear scroll position into a magnetic one: the film sits still at
 * each end of its segment and travels quickly through the middle.
 */
function magnetise(t: number, last: number) {
  if (last <= 0) return 0;
  const seg = Math.min(last - 1e-6, Math.max(0, t));
  const i = Math.floor(seg);
  const f = seg - i;
  const { dwell } = CHARACTER[i] ?? CHARACTER[0];
  const u = clamp01((f - dwell) / (1 - 2 * dwell));
  // smoothstep, so it leaves and arrives without a hard edge
  return i + u * u * (3 - 2 * u);
}

/**
 * Scroll-driven film viewer. A dashed frame sits fixed at the centre of the
 * screen and the films slide *through* it as you scroll — mid-scroll you see
 * the outgoing and incoming film split across the frame. A slower rail of
 * thumbnails drifts behind it for depth.
 *
 * Below 760px (and under reduced motion) the pin is dropped and the frame
 * becomes a native scroll-snap reel, which is what a thumb expects.
 */
export default function FilmStage() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const reel = reelRef.current;
    const rail = railRef.current;
    const viewport = rail?.parentElement;
    if (!section || !reel || !rail || !viewport) return;

    const last = FILMS.length - 1;

    if (
      matchMedia("(max-width: 760px)").matches ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Native swipe: keep the caption in step with whatever is centred.
      const onScroll = () => {
        const i = Math.round(reel.scrollLeft / Math.max(1, reel.clientWidth));
        setActive(Math.min(last, Math.max(0, i)));
      };
      reel.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
      return () => reel.removeEventListener("scroll", onScroll);
    }

    const shots = [...reel.querySelectorAll<HTMLElement>(".fs-shot img")];

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "+=" + FILMS.length * 70 + "%",
        pin: ".fs-sticky",
        scrub: 0.5,
        onUpdate: (self) => {
          const p = self.progress;
          // Magnetic position along the films. Each one holds still in the
          // frame for part of its segment, then travels, so they arrive one
          // at a time instead of the strip sliding as a single piece.
          const t = magnetise(p * last, last);

          // One frame width per film, so the frame holds either a single film
          // or a clean split between two. Pixels, not percent: a percentage
          // resolves against the reel's own width, which is one frame wide.
          const step = reel.parentElement?.clientWidth ?? 0;
          gsap.set(reel, { x: -t * step });

          // Per film character: its image drifts inside its own cell and
          // swells as it lands, each by its own amount.
          for (let n = 0; n < shots.length; n++) {
            const d = t - n; // 0 when this film is dead centre
            const near = Math.max(0, 1 - Math.abs(d));
            const c = CHARACTER[n];
            gsap.set(shots[n], {
              x: d * step * c.drift,
              scale: 1 + c.pop * near,
            });
          }

          // The rail is the SAME strip at thumbnail size, locked to the same
          // position — the frame is really a magnifier over it. Both are
          // driven off `t`, so film t is dead centre in both at once and the
          // opaque frame hides its own small duplicate underneath.
          const kids = rail.children;
          if (kids.length > 1) {
            const first = kids[0] as HTMLElement;
            // Pitch off the rects, not offsetLeft: offsetLeft is rounded to
            // whole pixels and the error compounds over every film. Rects are
            // sub-pixel and both are translated equally, so the delta is exact.
            const a = first.getBoundingClientRect();
            const pitch = (kids[1] as HTMLElement).getBoundingClientRect().left - a.left;
            // Centre on the middle copy so neither edge ever runs out of film.
            const centreLeft =
              first.offsetLeft + (FILMS.length + t) * pitch + a.width / 2;
            gsap.set(rail, { x: viewport.clientWidth / 2 - centreLeft });
          }

          if (progRef.current) progRef.current.style.width = p * 100 + "%";
          const i = Math.round(t);
          setActive((prev) => (prev === i ? prev : i));
        },
      });

      const refresh = () => st.refresh();
      addEventListener("load", refresh);
      return () => removeEventListener("load", refresh);
    }, section);

    return () => ctx.revert();
  }, []);

  const film = FILMS[active];

  return (
    <section id="filmstage" ref={sectionRef}>
      <div className="fs-sticky">
        {/* Inside the pinned box on purpose: anything above it would push the
            stage down by its own height until the pin engages. */}
        <div className="fs-top">
          <Link className="k-back" href="/">
            ← Back to home
          </Link>
          <div className="sec-label">01 — Films &amp; series</div>
        </div>

        {/* Beside the frame, not above it — that is what buys the frame its
            full height, as in the reference. */}
        <div className="fs-head">
          <h2 className="display">{film.title}</h2>
          <p>{film.meta}</p>
        </div>

        <div className="fs-viewport">
          {/* thumbnails drifting behind the frame */}
          <div className="fs-rail" ref={railRef} aria-hidden>
            {RAIL.map((f, i) => (
              <span className="fs-thumb" key={`${f.idx}-${i}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.img} alt="" loading="lazy" />
              </span>
            ))}
          </div>

          {/* the fixed frame the films pass through */}
          <div className="fs-frame">
            <div className="fs-reel" ref={reelRef}>
              {FILMS.map((f) => (
                <div className="fs-shot" key={f.idx}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.img} alt={f.title} />
                </div>
              ))}
            </div>

            <a
              className="fs-bar"
              href={film.href}
              target="_blank"
              rel="noopener"
              data-cursor={film.cursor}
            >
              <span className="fs-t">
                <i>{film.idx}</i> {film.title}
              </span>
              <span className="fs-go">{film.cursor}</span>
            </a>
          </div>
        </div>

        <div className="fs-foot">
          <span className="fs-count">
            {String(active + 1).padStart(2, "0")}
            <i>/{String(FILMS.length).padStart(2, "0")}</i>
          </span>
          <span className="fs-hint">
            <span className="fs-chev" aria-hidden>
              ↓
            </span>
            Scroll to continue
          </span>
        </div>

        <div className="fs-prog" ref={progRef} />
      </div>
    </section>
  );
}
