import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import { insightCategories } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Practical thinking on SEO, marketing, automation, and growth systems from the KIOSK team.",
};

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Ideas for building growth systems"
        description="Frameworks, playbooks, and breakdowns across SEO, marketing, automation, and the systems that tie them together."
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {insightCategories.map((cat, i) => (
            <Reveal
              key={cat.title}
              delay={i * 50}
              as="article"
              className="group flex flex-col rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
            >
              <h2 className="font-display text-lg font-semibold leading-snug">
                {cat.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                {cat.body}
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm text-fog transition-colors group-hover:text-accent">
                Coming soon →
              </span>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Want this applied to your business?"
        description="Skip the reading — book a strategy call and we'll build it with you."
        secondary={{ label: "View Services", href: "/services" }}
      />
    </>
  );
}
