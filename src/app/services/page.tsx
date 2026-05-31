import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import CtaBanner from "@/components/ui/CtaBanner";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Connected services built for growth — websites, media, growth marketing, SEO, and automation that work together as one system.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Connected services built for growth"
        description="Our services are designed as interconnected systems that support visibility, lead generation, automation, and business growth."
      />

      <section className="py-20 md:py-28">
        <div className="container-x grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 70}
              as="article"
              className="group relative flex flex-col rounded-3xl border border-line bg-surface p-8 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
            >
              <span className="font-display text-sm text-fog">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="mt-3 font-display text-2xl font-semibold">
                {service.name}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-mist">
                {service.overview}
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.services.slice(0, 5).map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-mist"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${service.slug}`}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent"
              >
                Learn more
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}

          <Reveal
            delay={services.length * 70}
            className="flex flex-col justify-center rounded-3xl border border-dashed border-line bg-surface/40 p-8"
          >
            <h2 className="font-display text-2xl font-semibold">
              Analytics &amp; Reporting
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              Every system ships with measurement built in — dashboards and
              reporting that turn activity into decisions across all services.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        title="Not sure which services you need?"
        description="Book a strategy call and we'll map the right system for your goals."
        secondary={{ label: "View Our Work", href: "/case-studies" }}
      />
    </>
  );
}
