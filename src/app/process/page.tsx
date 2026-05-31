import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import { processSteps } from "@/lib/content";

export const metadata: Metadata = {
  title: "Process",
  description:
    "A clear, repeatable path from discovery to scale — strategy, design, build, launch, and continuous optimization.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="From discovery to scale"
        description="A clear, repeatable path that turns business goals into working systems — and keeps improving them after launch."
      />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <ol className="relative space-y-px overflow-hidden rounded-3xl border border-line bg-line">
            {processSteps.map((step, i) => (
              <Reveal
                key={step.no}
                as="li"
                delay={i * 60}
                className="grid items-start gap-4 bg-surface p-8 transition-colors hover:bg-surface-2 md:grid-cols-[7rem_1fr] md:gap-8 md:p-10"
              >
                <span className="font-display text-5xl font-semibold text-line [-webkit-text-stroke:1px_var(--color-fog)] md:text-6xl">
                  {step.no}
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    {step.title}
                  </h2>
                  <p className="mt-2 max-w-2xl leading-relaxed text-mist">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner
        title="Ready to start at step one?"
        description="Book a discovery call and we'll map your growth system together."
        secondary={{ label: "View Our Work", href: "/case-studies" }}
      />
    </>
  );
}
