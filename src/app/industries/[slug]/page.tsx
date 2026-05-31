import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import { industries, getIndustry } from "@/lib/industries";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};
  return { title: industry.name, description: industry.intro };
}

function Column({
  title,
  items,
  marker,
}: {
  title: string;
  items: string[];
  marker: "dot" | "check";
}) {
  return (
    <Reveal className="rounded-3xl border border-line bg-surface p-8">
      <h3 className="font-display text-xl font-semibold">{title}</h3>
      <ul className="mt-6 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-mist">
            {marker === "check" ? (
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink">
                ✓
              </span>
            ) : (
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-fog" />
            )}
            <span className="text-sm leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export default async function IndustryDetailPage({ params }: Params) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  return (
    <>
      <PageHero
        eyebrow={industry.name}
        title={industry.headline}
        description={industry.intro}
      />

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="The landscape"
            title="Challenges & solutions"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Column
              title="Industry challenges"
              items={industry.challenges}
              marker="dot"
            />
            <Column
              title="Recommended solutions"
              items={industry.solutions}
              marker="check"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x">
          <SectionHeading
            eyebrow="Growth levers"
            title="Lead generation & automation"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Column
              title="Lead generation strategy"
              items={industry.leadGen}
              marker="check"
            />
            <Column
              title="Automation opportunities"
              items={industry.automation}
              marker="check"
            />
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Suggested packages" title="Where to start" />
            <div className="mt-8 flex flex-wrap gap-3">
              {industry.packages.map((pkg) => (
                <Link
                  key={pkg}
                  href="/packages"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-mist transition-colors hover:border-accent hover:text-paper"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  {pkg}
                </Link>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <SectionHeading
              eyebrow="Relevant case studies"
              title="Proof in this space"
            />
            <ul className="mt-8 space-y-3">
              {industry.caseStudies.map((cs) => (
                <li key={cs}>
                  <Link
                    href="/case-studies"
                    className="group flex items-center justify-between rounded-2xl border border-line bg-surface px-6 py-5 transition-colors hover:bg-surface-2"
                  >
                    <span className="font-display text-base">{cs}</span>
                    <span className="text-fog transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title={`Build your ${industry.name.toLowerCase()} growth system`}
        description="Book a strategy call and we'll tailor a connected system to your market."
        secondary={{ label: "All Industries", href: "/industries" }}
      />
    </>
  );
}
