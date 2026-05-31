import Link from "next/link";
import { ComponentProps } from "react";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-ink hover:bg-paper hover:shadow-[0_0_40px_-8px_rgba(215,255,62,0.6)]",
  ghost:
    "border border-line text-paper hover:border-accent hover:text-accent",
};

type Props = ComponentProps<typeof Link> & { variant?: Variant };

export default function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
