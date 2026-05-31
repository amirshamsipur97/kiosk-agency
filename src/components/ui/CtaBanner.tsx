import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

type Props = {
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
};

export default function CtaBanner({
  title,
  description,
  primary = { label: "Book A Strategy Call", href: "/contact" },
  secondary,
}: Props) {
  return (
    <section className="py-20 md:py-32">
      <div className="container-x">
        <Reveal className="relative overflow-hidden rounded-[2rem] border border-line bg-surface px-8 py-16 text-center md:px-16 md:py-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]"
          />
          <div aria-hidden className="grid-noise absolute inset-0 opacity-30" />
          <div className="relative">
            <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-tight text-balance sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {description && (
              <p className="mx-auto mt-5 max-w-xl text-base text-mist md:text-lg">
                {description}
              </p>
            )}
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href={primary.href}>{primary.label}</Button>
              {secondary && (
                <Button href={secondary.href} variant="ghost">
                  {secondary.label}
                </Button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
