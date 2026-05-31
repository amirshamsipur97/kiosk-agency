import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ItemsSection from "@/components/ui/ItemsSection";
import CtaBanner from "@/components/ui/CtaBanner";
import { aboutValues } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "KIOSK is a growth-focused digital agency building connected systems that attract, engage, convert, and scale.",
};

const pillars = [
  {
    title: "Mission",
    body: "To help businesses grow by building connected digital systems that turn strategy into measurable results.",
  },
  {
    title: "Vision",
    body: "To be the long-term growth partner behind ambitious brands — replacing scattered tools with one scalable ecosystem.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="We build connected systems, not isolated deliverables"
        description="KIOSK is a growth-focused digital agency. We combine strategy, creative, technology, and automation into ecosystems that attract, engage, convert, and scale."
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading eyebrow="Who we are" title="Our philosophy is simple" />
          </Reveal>
          <Reveal delay={120} className="text-lg leading-relaxed text-mist">
            <p>
              Most agencies focus on isolated deliverables — a website here, a
              campaign there. We take a different approach.
            </p>
            <p className="mt-4">
              We build connected digital systems where every component works
              together to attract attention, generate qualified leads, improve
              conversion rates, automate repetitive tasks, and support long-term
              growth.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal
              key={p.title}
              delay={i * 100}
              className="rounded-3xl border border-line bg-surface p-10"
            >
              <h2 className="font-display text-2xl font-semibold text-accent">
                {p.title}
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-mist">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <ItemsSection
        eyebrow="Core values"
        title="What we stand for"
        items={aboutValues}
        variant="check"
        columns={3}
      />

      <CtaBanner
        title="Let's build a long-term partnership"
        description="Book a strategy call and see how we approach growth as a system."
        secondary={{ label: "Our Process", href: "/process" }}
      />
    </>
  );
}
