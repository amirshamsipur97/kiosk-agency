import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const services = [
  {
    title: "Website & Digital Systems",
    href: "/services/website-digital-systems",
    items: [
      "UI/UX Design",
      "Website Development",
      "E-Commerce Platforms",
      "Custom CMS Systems",
      "CRM Integration",
      "Analytics Setup",
      "Website Maintenance",
    ],
  },
  {
    title: "Media & Content Production",
    href: "/services/media-content",
    items: [
      "Videography",
      "Photography",
      "Commercial Production",
      "Social Media Content",
      "YouTube Content Production",
      "Graphic Design",
      "Post Production",
    ],
  },
  {
    title: "Growth Marketing",
    href: "/services/growth-marketing",
    items: [
      "SEO",
      "Google Ads",
      "Meta Ads",
      "Lead Generation Funnels",
      "Marketing Analytics",
      "Conversion Optimization",
      "Campaign Management",
    ],
  },
  {
    title: "Automation & CRM",
    href: "/services/automation-crm",
    items: [
      "Workflow Automation",
      "CRM Setup",
      "Lead Management Systems",
      "AI Response Systems",
      "Sales Pipeline Automation",
      "Customer Follow-up Systems",
      "Reporting Dashboards",
    ],
  },
];

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

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal
              key={service.title}
              delay={i * 80}
              as="article"
              className="group relative flex flex-col rounded-3xl border border-line bg-surface p-8 transition-all duration-300 hover:border-accent/40 hover:bg-surface-2"
            >
              <h3 className="font-display text-2xl font-semibold">
                {service.title}
              </h3>
              <ul className="mt-6 flex flex-wrap gap-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-line px-3 py-1.5 text-xs text-mist"
                  >
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href={service.href}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent"
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
