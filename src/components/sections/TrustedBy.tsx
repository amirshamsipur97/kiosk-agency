"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

// Real client logos. Drop the actual files into /public/logos/<file>.
// Until a file exists, the brand name renders as a text fallback.
type Brand = { name: string; file: string };

const brands: Brand[] = [
  { name: "JW Marriott", file: "jw-marriott.svg" },
  { name: "Shangri-La", file: "shangri-la.svg" },
  { name: "Mövenpick", file: "movenpick.svg" },
  { name: "Bentley", file: "bentley.svg" },
  { name: "Bank Dhofar", file: "bank-dhofar.svg" },
  { name: "Lamborghini", file: "lamborghini.svg" },
  { name: "OQ", file: "oq.svg" },
  { name: "Hotel Indigo", file: "hotel-indigo.svg" },
  { name: "Ferrari", file: "ferrari.svg" },
  { name: "OXY", file: "oxy.svg" },
];

function Logo({ name, file }: Brand) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="mr-16 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-white/45 transition-colors hover:text-white/80 md:text-2xl">
        {name}
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/logos/${file}`}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="mr-16 h-8 w-auto object-contain opacity-60 transition-opacity duration-300 hover:opacity-100 md:h-10 [filter:brightness(0)_invert(1)]"
    />
  );
}

export default function TrustedBy() {
  const loop = [...brands, ...brands];
  return (
    <section className="py-20 md:py-28">
      <Reveal className="container-x flex flex-col items-center gap-4 text-center">
        <h2 className="max-w-3xl font-display text-2xl font-semibold leading-tight tracking-tight text-balance sm:text-3xl md:text-4xl">
          Trusted by Leading Brands Across Industries
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          From global names to regional leaders we bring the same level of
          precision and excellence to every project.
        </p>
      </Reveal>

      {/* Left-to-right logo marquee */}
      <div
        className="marquee marquee-right mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] md:mt-16"
        style={{ ["--marquee-duration" as string]: "38s" }}
      >
        <div className="marquee-track items-center">
          {loop.map((b, i) => (
            <Logo key={`${b.file}-${i}`} name={b.name} file={b.file} />
          ))}
        </div>
      </div>
    </section>
  );
}
