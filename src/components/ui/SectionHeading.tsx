import Reveal from "./Reveal";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: Props) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start";
  return (
    <Reveal className={`flex flex-col ${alignment} max-w-3xl ${className}`}>
      {eyebrow && (
        <span className="mb-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-accent">
          <span className="h-px w-8 bg-accent" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-mist md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}
