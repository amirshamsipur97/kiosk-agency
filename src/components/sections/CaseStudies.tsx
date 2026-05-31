import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const studies = [
  { title: "Real Estate Lead Generation Platform", tag: "Real Estate" },
  { title: "Property Listing System", tag: "Web Development" },
  { title: "Luxury Real Estate Marketing Campaign", tag: "Marketing" },
  { title: "Automated Lead Qualification System", tag: "Automation" },
  { title: "CRM Implementation Project", tag: "CRM" },
  { title: "YouTube Growth Strategy", tag: "Content" },
  { title: "Multi-Channel Marketing Campaign", tag: "Marketing" },
];

export default function CaseStudies() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Featured Case Studies"
            title="Systems that delivered results"
          />
          <Reveal delay={120}>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-accent"
            >
              View all case studies →
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {studies.slice(0, 6).map((study, i) => (
            <Reveal
              key={study.title}
              delay={i * 60}
              as="article"
              className="group relative flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-300 hover:border-accent/40"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:from-accent/10 group-hover:opacity-100"
              />
              <span className="relative inline-flex w-fit rounded-full border border-line bg-ink/40 px-3 py-1 text-xs text-mist">
                {study.tag}
              </span>
              <div className="relative">
                <h3 className="font-display text-xl font-semibold leading-snug">
                  {study.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-2 text-sm text-fog transition-colors group-hover:text-accent">
                  Read case study →
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
