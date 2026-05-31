import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

type Variant = "numbered" | "check" | "arrow";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: string[];
  variant?: Variant;
  columns?: 2 | 3 | 4;
};

const colClass: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export default function ItemsSection({
  eyebrow,
  title,
  description,
  items,
  variant = "numbered",
  columns = 3,
}: Props) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
        <div
          className={`mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line ${colClass[columns]}`}
        >
          {items.map((item, i) => (
            <Reveal
              key={item}
              delay={i * 50}
              className="group flex items-start gap-4 bg-surface p-7 transition-colors hover:bg-surface-2"
            >
              {variant === "numbered" && (
                <span className="font-display text-sm text-fog">
                  {String(i + 1).padStart(2, "0")}
                </span>
              )}
              {variant === "check" && (
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-ink">
                  ✓
                </span>
              )}
              <span className="flex-1 font-display text-base leading-snug md:text-lg">
                {item}
              </span>
              {variant === "arrow" && (
                <span className="text-fog transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent">
                  →
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
