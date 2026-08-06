import Reveal from "@/components/ui/Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  gradient?: boolean;
};

export default function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  gradient = false,
}: Props) {
  const center = align === "center";
  return (
    <section className="relative overflow-hidden pt-32 pb-16 md:pt-44 md:pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent/8 blur-[120px]"
      />
      <div aria-hidden className="grid-noise absolute inset-0 opacity-30" />
      <div
        className={`container-x relative flex flex-col ${
          center ? "items-center text-center" : ""
        }`}
      >
        {eyebrow && (
          <Reveal>
            <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
              <span className="h-px w-8 bg-accent" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <Reveal delay={80}>
          <h1
            className={`${eyebrow ? "mt-5" : ""} max-w-4xl font-display text-4xl font-semibold text-balance sm:text-5xl md:text-6xl ${
              center ? "mx-auto" : ""
            } ${
              gradient
                ? "bg-gradient-to-r from-[#f4f4f5] to-[#8e8e8f] bg-clip-text pb-1 leading-[1.2] tracking-tight text-transparent"
                : "leading-[1.05]"
            }`}
          >
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={160}>
            <p
              className={`mt-6 max-w-2xl text-lg leading-relaxed text-mist ${
                center ? "mx-auto" : ""
              }`}
            >
              {description}
            </p>
          </Reveal>
        )}
        {children && <Reveal delay={240}>{children}</Reveal>}
      </div>
    </section>
  );
}
