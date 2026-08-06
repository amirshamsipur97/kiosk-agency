import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import { industries } from "@/lib/industries";

export const metadata: Metadata = {
  alternates: { canonical: "/industries" },
  title: "Industries",
  description:
    "Tailored growth systems for modern industries — real estate, automotive, hospitality, media, healthcare, and SMEs.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Tailored systems for modern industries"
        description="We adapt connected systems to the realities of each sector — the challenges, the buyers, and the growth levers that actually move the needle."
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal
              key={industry.slug}
              delay={i * 60}
              as="article"
              className="group flex flex-col rounded-3xl border border-line bg-surface p-8 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
            >
              <h2 className="font-display text-xl font-semibold">
                {industry.name}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-mist">
                {industry.intro}
              </p>
              <Link
                href={`/industries/${industry.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent"
              >
                Explore
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Don't see your industry?"
        description="We build connected systems for any business with growth ambitions. Let's talk."
        secondary={{ label: "View Services", href: "/services" }}
      />
    </>
  );
}
