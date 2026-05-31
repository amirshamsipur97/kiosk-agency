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

// Linear "Triage" card materials.
const CARD_SHEEN =
  "linear-gradient(134deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 55%)";
const CARD_HIGHLIGHT =
  "linear-gradient(140deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 45%)";

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

              {/* Triage-style glassy card (Figma node 2007:9113) */}
              <div className="mt-1 rounded-[18px] border border-white/[0.06] p-2 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]">
                <div
                  className="relative overflow-hidden rounded-[10px] border border-white/[0.08]"
                  style={{ backgroundImage: CARD_SHEEN }}
                >
                  {/* top-left sheen highlight */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{ backgroundImage: CARD_HIGHLIGHT }}
                  />
                  <div className="relative flex flex-col gap-3 px-4 pb-5 pt-4">
                    <p className="text-[15px] font-semibold tracking-tight text-white">
                      Capabilities
                    </p>
                    <div className="flex flex-col gap-2">
                      {service.services.slice(0, 5).map((item, j) => (
                        <div
                          key={item}
                          className={`rounded-md px-3 py-2.5 text-sm transition-colors ${
                            j === 0
                              ? "border border-white/10 bg-white/[0.05] text-[#e3e4e6]"
                              : "text-[#969799]"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
