"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";

// Real client logos. Drop the actual files into /public/logos/<file>.
// Until a file exists, the brand name renders as a text fallback.
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

  // Full-colour logos sit on a white rounded card so they read cleanly on the
  // dark strip.
  return (
    <div className="mr-6 flex h-16 w-40 shrink-0 items-center justify-center rounded-2xl bg-white px-5 opacity-90 transition-opacity duration-300 hover:opacity-100 md:mr-8 md:h-20 md:w-52 md:px-7">
      {failed ? (
        <span className="font-display text-base font-semibold tracking-tight text-ink">
          {name}
        </span>
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={`/logos/${file}`}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="max-h-10 w-auto object-contain md:max-h-12"
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
