"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

// Real client logos. Drop the actual files into /public/logos/<file>.
// Until a file exists, the brand name renders as a text fallback.
// `fh` is the logo's height in the Figma design (node 867-37135). Each logo
// is rendered at that height multiplied by --logo-scale, so the relative
// sizing matches the design exactly instead of forcing a uniform height.
type Brand = { name: string; file: string; fh: number };

const brands: Brand[] = [
  { name: "JW Marriott", file: "jw-marriott.png", fh: 87 },
  { name: "Shangri-La", file: "shangri-la.svg", fh: 99 },
  { name: "Mövenpick", file: "movenpick.png", fh: 129 },
  { name: "Bentley", file: "bentley.png", fh: 48 },
  { name: "Bank Dhofar", file: "bank-dhofar.png", fh: 212 },
  { name: "Lamborghini", file: "lamborghini.png", fh: 117 },
  { name: "OQ", file: "oq.png", fh: 67 },
  { name: "Hotel Indigo", file: "hotel-indigo.svg", fh: 86 },
  { name: "Ferrari", file: "ferrari.svg", fh: 91 },
  { name: "OXY", file: "oxy.png", fh: 133 },
];

function Logo({ name, file, fh }: Brand) {
  const [failed, setFailed] = useState(false);

  // Each logo lives in an equal-width cell and is centred, so spacing stays
  // even. Its height is the Figma height scaled by --logo-scale, and
  // object-contain keeps the artwork from stretching.
  return (
    <div className="flex w-[180px] shrink-0 items-center justify-center md:w-[230px]">
      {failed ? (
        <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-white md:text-lg">
          {name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`/logos/${file}?v=6`}
          alt={name}
          onError={() => setFailed(true)}
          style={{ height: `calc(${fh}px * var(--logo-scale))` }}
          className="w-auto max-w-full object-contain"
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
          white line above and below. --logo-scale converts each logo's Figma
          height to its on-screen height. */}
      <div className="logo-row mt-12 w-full border-y border-white/80 py-6 md:mt-16 md:py-8">
        <div
          className="marquee marquee-right overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
          style={{ ["--marquee-duration" as string]: "38s" }}
        >
          <div className="marquee-track items-center">
            {loop.map((b, i) => (
              <Logo key={`${b.file}-${i}`} name={b.name} file={b.file} fh={b.fh} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
