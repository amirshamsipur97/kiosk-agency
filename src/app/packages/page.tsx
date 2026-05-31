import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import CtaBanner from "@/components/ui/CtaBanner";
import { packageGroups } from "@/lib/content";

export const metadata: Metadata = {
  title: "Packages",
  description:
    "Media, website, SEO, and automation packages — flexible tiers that scale from starter to enterprise.",
};

export default function PackagesPage() {
  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="Flexible packages that scale with you"
        description="Start where it makes sense and grow into a full system. Every package connects to the rest of your stack."
      >
        <div className="mt-8 flex flex-wrap gap-2">
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

      {packageGroups.map((group, gi) => (
        <section
          key={group.id}
          id={group.id}
          className="scroll-mt-24 py-20 md:py-28"
        >
          <div className="container-x">
            <SectionHeading eyebrow={`0${gi + 1}`} title={group.title} />
            <div
              className={`mt-12 grid gap-6 sm:grid-cols-2 ${
                group.tiers.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
              }`}
            >
              {group.tiers.map((tier, i) => {
                const featured = i === group.tiers.length - 2;
                return (
                  <Reveal
                    key={tier}
                    delay={i * 70}
                    className={`flex flex-col rounded-3xl border p-8 transition-colors ${
                      featured
                        ? "border-accent/50 bg-surface-2"
                        : "border-line bg-surface hover:bg-surface-2"
                    }`}
                  >
                    {featured && (
                      <span className="mb-4 w-fit rounded-full bg-accent px-3 py-1 text-xs font-medium text-ink">
                        Popular
                      </span>
                    )}
                    <span className="font-display text-sm text-fog">
                      Tier {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold">
                      {tier}
                    </h3>
                    <Link
                      href="/contact"
                      className="mt-6 text-sm font-medium text-accent"
                    >
                      Request pricing →
                    </Link>
                  </Reveal>
                );
              })}
            </div>

            {group.includes && (
              <div className="mt-10">
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-fog">
                  Available across tiers
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.includes.map((inc) => (
                    <span
                      key={inc}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-mist"
                    >
                      {inc}
                    </span>
                  ))}
                </div>
              </div>
            )}
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
