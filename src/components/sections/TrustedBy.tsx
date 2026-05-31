"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

// Real client logos. Drop the actual files into /public/logos/<file>.
// Until a file exists, the brand name renders as a text fallback.
// Every logo is exported inside an identical frame (~590×280) with the right
// internal padding, so rendering them all at one uniform height reproduces
// the intended relative sizing.
type Brand = { name: string; file: string };

const brands: Brand[] = [
  { name: "JW Marriott", file: "jw-marriott.png" },
  { name: "Shangri-La", file: "shangri-la.png" },
  { name: "Mövenpick", file: "movenpick.png" },
  { name: "Bentley", file: "bentley.png" },
  { name: "Bank Dhofar", file: "bank-dhofar.png" },
  { name: "Lamborghini", file: "lamborghini.png" },
  { name: "OQ", file: "oq.png" },
  { name: "Hotel Indigo", file: "hotel-indigo.png" },
  { name: "Ferrari", file: "ferrari.png" },
  { name: "OXY", file: "oxy.png" },
];

function Logo({ name, file }: Brand) {
  const [failed, setFailed] = useState(false);

  // Uniform frame height + object-contain → consistent sizing; the identical
  // export frames mean the gap between logos stays even on its own.
  return (
    <div className="mr-6 flex shrink-0 items-center md:mr-10">
      {failed ? (
        <span className="whitespace-nowrap font-display text-base font-semibold tracking-tight text-white md:text-lg">
          {name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`/logos/${file}?v=7`}
          alt={name}
          onError={() => setFailed(true)}
          className="h-[84px] w-auto object-contain md:h-[104px]"
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
      <div className="mt-12 w-full border-y border-white/80 py-6 md:mt-16 md:py-8">
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
