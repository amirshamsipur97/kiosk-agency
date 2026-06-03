"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/ui/Reveal";

// Real client logos. Drop the actual files into /public/logos/<file>.
// Until a file exists, the brand name renders as a text fallback.
// The PNGs are trimmed to their content (no transparent padding), so a
// constant margin gives perfectly even spacing between logos. `r` is the
// logo's content-height as a fraction of its original export frame, so
// height = --frame * r reproduces the intended relative sizing.
type Brand = { name: string; file: string; r: number };

const brands: Brand[] = [
  { name: "JW Marriott", file: "jw-marriott.png", r: 0.626 },
  { name: "Shangri-La", file: "shangri-la.png", r: 0.702 },
  { name: "Mövenpick", file: "movenpick.png", r: 0.342 },
  { name: "Bentley", file: "bentley.png", r: 0.345 },
  { name: "Bank Dhofar", file: "bank-dhofar.png", r: 0.514 },
  { name: "Lamborghini", file: "lamborghini.png", r: 0.716 },
  { name: "OQ", file: "oq.png", r: 0.482 },
  { name: "Hotel Indigo", file: "hotel-indigo.png", r: 0.606 },
  { name: "Ferrari", file: "ferrari.png", r: 0.641 },
  { name: "OXY", file: "oxy.png", r: 0.655 },
];

// Platform / tool logos for the TOP marquee, ported from the Figma component
// (node 409:18086) as crisp vectors. Heights mirror the design's per-logo
// pixel sizes. The two Adobe marks are a coloured square + a glyph layer.
type Platform =
  | { name: string; file: string; h: number }
  | { name: string; h: number; w: number; bg: string; glyph: string };

const PV = 3; // asset cache-bust version

const platforms: Platform[] = [
  { name: "After Effects", file: "after-effects.svg", h: 48 },
  { name: "Zapier", file: "zapier.svg", h: 38 },
  { name: "YouTube", file: "youtube.png", h: 40 },
  { name: "Google Analytics", file: "google-analytics.svg", h: 31 },
  { name: "Adobe Illustrator", h: 48, w: 50, bg: "ai-bg.svg", glyph: "ai-glyph.svg" },
  { name: "Meta", file: "meta.svg", h: 22 },
  { name: "Adobe Premiere Pro", h: 48, w: 50, bg: "pr-bg.svg", glyph: "pr-glyph.svg" },
  { name: "Search Console", file: "search-console.svg", h: 19 },
];

function PlatformLogo(p: Platform) {
  const wrap = "mr-[50px] flex shrink-0 items-center md:mr-[64px]";
  // Composite Adobe mark: coloured rounded square + the glyph centred on top.
  if ("bg" in p) {
    return (
      <div className={wrap}>
        <div
          className="relative flex items-center justify-center overflow-hidden rounded-[22%]"
          style={{ height: p.h, width: p.w }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/logos/platforms/${p.bg}?v=${PV}`} alt="" className="absolute inset-0 size-full" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/logos/platforms/${p.glyph}?v=${PV}`}
            alt={p.name}
            style={{ height: p.h * 0.46 }}
            className="relative w-auto object-contain"
          />
        </div>
      </div>
    );
  }
  return (
    <div className={wrap}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/logos/platforms/${p.file}?v=${PV}`}
        alt={p.name}
        style={{ height: p.h }}
        className="w-auto object-contain"
      />
    </div>
  );
}

function Logo({ name, file, r }: Brand) {
  const [failed, setFailed] = useState(false);

  // Trimmed artwork + fixed trailing margin → constant gap between logos.
  // Height comes from the per-logo ratio so relative sizing is preserved.
  return (
    <div className="mr-28 flex shrink-0 items-center md:mr-40">
      {failed ? (
        <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-white md:text-lg">
          {name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`/logos/${file}?v=8`}
          alt={name}
          onError={() => setFailed(true)}
          style={{ height: `calc(var(--frame) * ${r})` }}
          className="w-auto object-contain"
        />
      )}
    </div>
  );
}

const BRAND_DURATION = 38; // seconds — the bottom row's speed reference

export default function TrustedBy() {
  // Brand row repeated x2; platform row repeated more so a single half is
  // always wider than the viewport (no black gap at the loop seam).
  const loop = [...brands, ...brands];
  const platformLoop = Array.from({ length: 6 }, () => platforms).flat();

  const platMarquee = useRef<HTMLDivElement>(null);
  const platTrack = useRef<HTMLDivElement>(null);
  const brandTrack = useRef<HTMLDivElement>(null);

  // Match the platform row's visual speed (px/sec) to the brand row by scaling
  // its animation duration to its own track width. Both translate -50% of
  // their own track, so duration ∝ track width gives identical px/sec.
  useEffect(() => {
    const apply = () => {
      const pt = platTrack.current;
      const bt = brandTrack.current;
      const pm = platMarquee.current;
      if (!pt || !bt || !pm) return;
      const pw = pt.scrollWidth;
      const bw = bt.scrollWidth;
      if (pw > 0 && bw > 0) {
        const dur = (BRAND_DURATION * pw) / bw;
        pm.style.setProperty("--marquee-duration", `${dur.toFixed(1)}s`);
      }
    };
    apply();
    const t = setTimeout(apply, 600); // re-measure once images settle
    window.addEventListener("resize", apply);
    const imgs = platTrack.current?.querySelectorAll("img") ?? [];
    imgs.forEach((im) => {
      if (!im.complete) im.addEventListener("load", apply, { once: true });
    });
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section className="py-20 md:py-28">
      {/* TOP row — platform/tool logos, scrolling LEFT (opposite the brand row
          below) at a matched speed. */}
      <div className="logo-row relative w-full border-y border-[#313131] py-6 md:py-8">
        <div ref={platMarquee} className="marquee marquee-left overflow-hidden">
          {/* min-height matches the brand row's tallest logo (frame × 0.716)
              so the gap between the two border lines equals the bottom row. */}
          <div
            ref={platTrack}
            className="marquee-track items-center"
            style={{ minHeight: "calc(var(--frame) * 0.716)" }}
          >
            {platformLoop.map((p, i) => (
              <PlatformLogo key={`${p.name}-${i}`} {...p} />
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-px -top-px left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent md:w-48" />
        <div className="pointer-events-none absolute -bottom-px -top-px right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent md:w-48" />
      </div>

      <Reveal className="container-x mt-12 flex flex-col items-center gap-4 text-center md:mt-16">
        <h2 className="max-w-3xl font-display text-xl font-medium uppercase leading-snug tracking-[0.04em] text-paper sm:text-2xl">
          Trusted by Leading Brands Across Industries
        </h2>
        <p className="max-w-2xl text-xs uppercase leading-relaxed tracking-[0.08em] text-white/55 md:text-sm">
          From global names to regional leaders we bring the same level of
          precision and excellence to every project.
        </p>
      </Reveal>

      {/* BOTTOM row — brand logos, scrolling RIGHT. */}
      <div className="logo-row relative mt-12 w-full border-y border-[#313131] py-6 md:mt-16 md:py-8">
        <div
          className="marquee marquee-right overflow-hidden"
          style={{ ["--marquee-duration" as string]: `${BRAND_DURATION}s` }}
        >
          <div ref={brandTrack} className="marquee-track items-center">
            {loop.map((b, i) => (
              <Logo key={`${b.file}-${i}`} name={b.name} file={b.file} r={b.r} />
            ))}
          </div>
        </div>
        {/* Even dark gradient fade on both edges (covers logos + the lines) */}
        <div className="pointer-events-none absolute -bottom-px -top-px left-0 z-10 w-20 bg-gradient-to-r from-ink to-transparent md:w-48" />
        <div className="pointer-events-none absolute -bottom-px -top-px right-0 z-10 w-20 bg-gradient-to-l from-ink to-transparent md:w-48" />
      </div>
    </section>
  );
}
