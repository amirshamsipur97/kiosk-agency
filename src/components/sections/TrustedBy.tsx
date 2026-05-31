import Reveal from "@/components/ui/Reveal";

// Brand names rendered as text wordmarks (placeholder for real logo assets).
const brands = [
  "JW Marriott",
  "Shangri-La",
  "Mövenpick",
  "Bentley",
  "Bank Dhofar",
  "Lamborghini",
  "OQ",
  "Hotel Indigo",
  "Ferrari",
  "OXY",
];

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
            <span
              key={`${b}-${i}`}
              className="mr-16 whitespace-nowrap font-display text-xl font-semibold tracking-tight text-white/45 transition-colors hover:text-white/80 md:text-2xl"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
