import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { industries } from "@/lib/industries";

function ArrowUpRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Card({
  headline,
  name,
  slug,
}: {
  headline: string;
  name: string;
  slug: string;
}) {
  return (
    <Link
      href={`/industries/${slug}`}
      className="group mr-[26px] flex w-[330px] shrink-0 items-start justify-between gap-3 rounded-md border border-white/[0.06] bg-[#121214] px-6 py-5 transition-colors hover:border-accent/40"
    >
      <span className="min-w-0">
        <span className="line-clamp-2 text-[15px] font-medium leading-snug text-paper">
          {headline}
        </span>
        <span className="mt-1.5 block text-sm text-accent">{name}</span>
      </span>
      <span className="mt-0.5 text-fog transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
        <ArrowUpRight />
      </span>
    </Link>
  );
}

function MarqueeRow({
  items,
  direction,
  duration,
}: {
  items: typeof industries;
  direction: "left" | "right";
  duration: string;
}) {
  // Duplicate the set so the loop is seamless (track translates by -50%).
  const loop = [...items, ...items];
  return (
    <div
      className={`marquee marquee-${direction} overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent)]`}
      style={{ ["--marquee-duration" as string]: duration }}
    >
      <div className="marquee-track">
        {loop.map((i, idx) => (
          <Card key={`${i.slug}-${idx}`} headline={i.headline} name={i.name} slug={i.slug} />
        ))}
      </div>
    </div>
  );
}

const rotate = <T,>(arr: T[], n: number) => [...arr.slice(n), ...arr.slice(0, n)];

export default function Industries() {
  return (
    <section className="py-24 md:py-32">
      <Reveal className="container-x flex flex-col items-center gap-5 text-center">
        <h2 className="max-w-3xl font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl">
          Tailored systems for modern industries
        </h2>
        <p className="max-w-2xl text-base leading-relaxed text-white/60 md:text-lg">
          We adapt connected systems to the realities of each sector — the
          challenges, the buyers, and the growth levers that actually move the
          needle. Strategy, build, marketing, and automation, tuned per industry.
        </p>
      </Reveal>

      <Reveal delay={150} className="mt-14 flex flex-col gap-[26px] md:mt-20">
        <MarqueeRow items={industries} direction="left" duration="46s" />
        <MarqueeRow items={rotate(industries, 3)} direction="right" duration="54s" />
        <MarqueeRow items={rotate(industries, 1)} direction="left" duration="50s" />
      </Reveal>
    </section>
  );
}
