import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const reasons = [
  "Strategy First",
  "Business-Focused Execution",
  "Data-Driven Decisions",
  "Automation-Oriented Thinking",
  "Scalable Systems",
  "Long-Term Partnership",
  "Performance Tracking",
  "End-to-End Delivery",
];

export default function WhyKiosk() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why KIOSK"
          title="A partner built around your growth"
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, i) => (
            <Reveal
              key={reason}
              delay={i * 50}
              className="flex items-start gap-3 rounded-2xl border border-line bg-surface p-6"
            >
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink">
                ✓
              </span>
              <span className="font-display text-base leading-snug">
                {reason}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
