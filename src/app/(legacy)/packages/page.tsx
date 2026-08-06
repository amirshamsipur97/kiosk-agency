import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import PricingCards from "@/components/packages/PricingCards";
import Dock from "@/components/sections/Dock";
import { packageGroups } from "@/lib/packages";

export const metadata: Metadata = {
  alternates: { canonical: "/packages" },
  title: "Packages",
  description:
    "Media, website, SEO, and automation packages — flexible tiers that scale from starter to enterprise.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHero
        align="center"
        gradient
        title="Flexible packages that scale with you"
        description="Start where it makes sense and grow into a full system. Every package connects to the rest of your stack."
      >
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {packageGroups.map((g) => (
            <Link
              key={g.id}
              href={`#${g.id}`}
              className="rounded-full border border-line px-4 py-2 text-sm text-mist transition-colors hover:border-accent hover:text-paper"
            >
              {g.title}
            </Link>
          ))}
        </div>
      </PageHero>

      <section className="pb-6 md:pb-10">
        <Dock />
      </section>

      {packageGroups.map((group) => (
        <section
          key={group.id}
          id={group.id}
          className="scroll-mt-24 py-20 md:py-28"
        >
          <div className="container-x">
            <Reveal className="flex flex-col items-center text-center">
              <h2 className="bg-gradient-to-r from-[#f4f4f5] to-[#8e8e8f] bg-clip-text pb-1 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-transparent text-balance sm:text-4xl">
                {group.title}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/60">
                {group.overview}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-12 md:mt-14">
              <PricingCards tiers={group.tiers} />
            </Reveal>
          </div>
        </section>
      ))}

      <CtaBanner
        title="Need a custom package?"
        description="We'll combine services into a system priced around your goals."
        secondary={{ label: "View Services", href: "/services" }}
      />
    </>
  );
}
