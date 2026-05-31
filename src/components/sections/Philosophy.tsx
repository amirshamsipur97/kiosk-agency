import Reveal from "@/components/ui/Reveal";

const isolated = [
  "Some create websites.",
  "Some run advertisements.",
  "Some produce content.",
];

export default function Philosophy() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-8 bg-accent" />
            Our Philosophy
          </span>
          <h2 className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl md:text-5xl">
            Our philosophy is simple
          </h2>
        </Reveal>

        <Reveal delay={120} className="text-lg leading-relaxed text-mist">
          <p>Most agencies focus on isolated deliverables.</p>
          <ul className="my-6 space-y-2">
            {isolated.map((line) => (
              <li key={line} className="flex items-center gap-3 text-fog">
                <span className="h-1 w-1 rounded-full bg-fog" />
                {line}
              </li>
            ))}
          </ul>
          <p className="text-paper">We take a different approach.</p>
          <p className="mt-4">
            We build connected digital systems where every component works
            together to attract attention, generate qualified leads, improve
            conversion rates, automate repetitive tasks, and support long-term
            growth.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
