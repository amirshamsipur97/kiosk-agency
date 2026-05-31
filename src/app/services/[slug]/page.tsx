import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import ItemsSection from "@/components/ui/ItemsSection";
import CtaBanner from "@/components/ui/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import { services, getService } from "@/lib/services";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.overview,
  };
}

export default async function ServiceDetailPage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        eyebrow={service.name}
        title={service.headline}
        description={service.overview}
      />

      <ItemsSection
        eyebrow="What's included"
        title="Services"
        items={service.services}
        variant="numbered"
        columns={3}
      />

      {service.tiers && (
        <section className="py-20 md:py-28">
          <div className="container-x">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              {service.name.replace(" Services", "")} Packages
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {service.tiers.map((tier, i) => (
                <Reveal
                  key={tier}
                  delay={i * 80}
                  className="flex flex-col rounded-3xl border border-line bg-surface p-8"
                >
                  <span className="font-display text-sm text-fog">
                    Tier {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold">
                    {tier}
                  </h3>
                  <Link
                    href="/contact"
                    className="mt-6 text-sm font-medium text-accent"
                  >
                    Request pricing →
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <ItemsSection
        eyebrow="Outcomes"
        title="What you can expect"
        items={service.outcomes}
        variant="check"
        columns={3}
      />

      <CtaBanner
        title={`Let's build your ${service.name.toLowerCase()} system`}
        description="Book a strategy call and we'll scope the right approach for your goals."
        secondary={{ label: "All Services", href: "/services" }}
      />
    </>
  );
}
