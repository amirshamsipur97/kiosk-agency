import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    no: "01",
    title: "Discovery",
    body: "Understanding business goals, challenges, audience, and growth opportunities.",
  },
  {
    no: "02",
    title: "Strategy",
    body: "Creating a complete roadmap covering branding, technology, marketing, and automation.",
  },
  {
    no: "03",
    title: "Design",
    body: "Developing user experiences, interfaces, content systems, and creative assets.",
  },
  {
    no: "04",
    title: "Build",
    body: "Building websites, automations, CRM systems, and growth infrastructure.",
  },
  {
    no: "05",
    title: "Launch",
    body: "Deploying systems, campaigns, and digital assets.",
  },
  {
    no: "06",
    title: "Optimize & Scale",
    body: "Continuous monitoring, optimization, and business growth.",
  },
];

export default function Process() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Process"
          title="From discovery to scale"
          description="A clear, repeatable path that turns business goals into working systems."
        />
        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal
              key={step.no}
              delay={i * 60}
              className="bg-surface p-8 transition-colors hover:bg-surface-2"
            >
              <span className="font-display text-4xl font-semibold text-line [-webkit-text-stroke:1px_var(--color-fog)]">
                {step.no}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {step.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
