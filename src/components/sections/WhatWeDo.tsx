import Reveal from "@/components/ui/Reveal";
import ArchitectStudio, {
  type CatalogItem,
  type StudioPackage,
} from "@/components/architect/ArchitectStudio";
import { getKnowledgeBase } from "@/lib/architect";

// Approximate one-time setup price by budget level (easy to tune later).
const SETUP_PRICE: Record<string, number> = {
  low: 500,
  medium: 1500,
  high: 3000,
  enterprise: 6000,
};

export default async function WhatWeDo() {
  const kb = await getKnowledgeBase();

  const catalog: Record<string, CatalogItem> = {};
  kb.services.forEach((s) => {
    catalog[s.slug] = {
      title: s.title,
      kind: "service",
      price: SETUP_PRICE[s.budget_level] ?? 1500,
      effort: s.implementation_time || "1-2 weeks",
    };
  });
  kb.aiProducts.forEach((p) => {
    catalog[p.slug] = {
      title: p.title,
      kind: "product",
      price: (SETUP_PRICE[p.budget_level] ?? 3000) + 1000,
      effort: p.implementation_time || "2-4 weeks",
    };
  });

  const packages: StudioPackage[] = kb.packages.map((p) => ({
    slug: p.slug,
    name: p.package_name,
  }));

  return (
    <section id="ai-architect" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-x">
        {/* Top heading */}
        <Reveal className="flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.06] px-3 py-1 text-xs font-medium text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            AI Growth Architect
          </span>
          <h2 className="bg-gradient-to-r from-[#f4f4f5] to-[#8e8e8f] bg-clip-text pb-1 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-transparent text-balance sm:text-4xl md:text-5xl">
            Six capabilities, one system.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
            Pick your industry or search a role, then chat with our AI strategist
            for a tailored growth brief, plan, and package.
          </p>
        </Reveal>

        {/* Figma "Browse App" dashboard */}
        <Reveal delay={120} className="mx-auto mt-12 max-w-[975px] md:mt-16">
          <ArchitectStudio packages={packages} catalog={catalog} />
        </Reveal>
      </div>
    </section>
  );
}
