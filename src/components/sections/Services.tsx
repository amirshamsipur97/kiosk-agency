import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { services as allServices } from "@/lib/services";

// Featured services shown on the homepage, in order.
const FEATURED = [
  "website-digital-systems",
  "media-content",
  "growth-marketing",
  "automation-crm",
];

const services = FEATURED.map(
  (slug) => allServices.find((s) => s.slug === slug)!,
).filter(Boolean);

// Soft top-left sheen used on the Linear-style preview cards.
const CARD_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";

export default function Services() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Services"
            title="Connected services built for growth"
          />
          <Reveal delay={120}>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent"
            >
              Explore all services →
            </Link>
          </Reveal>
        </div>

        {/* Linear-style bordered feature grid */}
        <div className="mt-12 grid border-t border-white/[0.06] md:mt-16 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.slug}
              delay={i * 80}
              as="article"
              className="group relative flex flex-col gap-5 border-b border-white/[0.06] py-10 md:px-10 md:[&:nth-child(even)]:pr-0 md:[&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:pl-0"
            >
              {/* Heading + overview (from the site's services content) */}
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-xl font-semibold tracking-tight text-paper">
                  {service.name}
                </h3>
                <p className="max-w-md text-[15px] leading-relaxed text-mist">
                  {service.overview}
                </p>
              </div>

              {/* Preview card listing the capabilities */}
              <div className="relative mt-1 overflow-hidden rounded-2xl border border-white/[0.07]">
                <div
                  className="flex flex-col gap-3.5 p-5"
                  style={{ backgroundImage: CARD_SHEEN }}
                >
                  {service.services.slice(0, 6).map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-[#c8c9cc]"
                    >
                      <span className="size-1.5 shrink-0 rounded-full bg-accent" />
                      {item}
                    </div>
                  ))}
                </div>
                {/* bottom fade so the list dissolves into the surface */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink to-transparent" />
              </div>

              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-accent"
              >
                Learn more
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
