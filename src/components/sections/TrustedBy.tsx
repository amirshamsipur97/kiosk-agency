"use client";

import { useState } from "react";
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

export default function TrustedBy() {
  const loop = [...brands, ...brands];
  return (
    <section className="py-20 md:py-28">
      <Reveal className="container-x flex flex-col items-center gap-4 text-center">
        <h2 className="max-w-3xl font-display text-xl font-medium uppercase leading-snug tracking-[0.04em] text-paper sm:text-2xl">
          Trusted by Leading Brands Across Industries
        </h2>
        <p className="max-w-2xl text-xs uppercase leading-relaxed tracking-[0.08em] text-white/55 md:text-sm">
          From global names to regional leaders we bring the same level of
          precision and excellence to every project.
        </p>
      </Reveal>

      {/* Full-width logo marquee on the black background, framed by a thin
          white line above and below. --frame is the reference height each
          logo's ratio is multiplied against. */}
      <div className="logo-row relative mt-12 w-full border-y border-[#313131] py-6 md:mt-16 md:py-8">
        <div
          className="marquee marquee-right overflow-hidden"
          style={{ ["--marquee-duration" as string]: "38s" }}
        >
          <div className="marquee-track items-center">
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
