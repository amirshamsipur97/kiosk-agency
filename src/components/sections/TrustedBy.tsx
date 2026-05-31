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

  if (failed) {
    return (
      <span className="mr-16 shrink-0 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-ink md:mr-24 md:text-2xl">
        {name}
      </span>
    );
  }

  // Logos sit directly on the single white band, sized large.
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={`/logos/${file}?v=3`}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="mr-16 max-h-[84px] w-auto shrink-0 object-contain md:mr-24 md:max-h-[120px]"
    />
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

      {/* Single full-width white band with the left-to-right logo marquee */}
      <div className="mt-12 w-full bg-white py-10 md:mt-16 md:py-16">
        <div
          className="marquee marquee-right overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_4%,#000_96%,transparent)]"
          style={{ ["--marquee-duration" as string]: "38s" }}
        >
          <div className="marquee-track items-center">
            {loop.map((b, i) => (
              <Logo key={`${b.file}-${i}`} name={b.name} file={b.file} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
