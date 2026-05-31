/* Shared content for Packages, Case Studies, Process, About, Insights. */

export type PackageGroup = {
  id: string;
  title: string;
  tiers: string[];
  includes?: string[];
};

export const packageGroups: PackageGroup[] = [
  {
    id: "media",
    title: "Media Packages",
    tiers: ["Silver", "Gold", "Platinum", "Unlimited"],
    includes: [
      "Photography",
      "Videography",
      "Editing",
      "Instagram Management",
      "YouTube Management",
      "Graphic Design",
      "Content Creation",
    ],
  },
  {
    id: "website",
    title: "Website Packages",
    tiers: ["Starter Website", "Business Website", "Corporate Website", "Custom Platform"],
  },
  {
    id: "seo",
    title: "SEO Packages",
    tiers: ["Basic SEO", "Standard SEO", "Advanced SEO"],
  },
  {
    id: "automation",
    title: "Automation Packages",
    tiers: ["CRM Setup", "CRM + Automation", "Full Growth System", "Enterprise Automation"],
  },
];

export type CaseStudy = {
  title: string;
  category: string;
  categoryLabel: string;
  result: string;
};

export const caseStudies: CaseStudy[] = [
  {
    title: "Real Estate Lead Generation Platform",
    category: "real-estate",
    categoryLabel: "Real Estate",
    result: "A connected platform that captures and qualifies buyer demand at scale.",
  },
  {
    title: "Property Listing System",
    category: "websites",
    categoryLabel: "Websites",
    result: "A self-managed listing system that keeps inventory always up to date.",
  },
  {
    title: "Luxury Real Estate Marketing Campaign",
    category: "marketing",
    categoryLabel: "Marketing",
    result: "Premium content and targeting that positioned the brand at the top end.",
  },
  {
    title: "Automated Lead Qualification System",
    category: "automation",
    categoryLabel: "Automation",
    result: "Automation that routes only sales-ready leads to the closing team.",
  },
  {
    title: "CRM Implementation Project",
    category: "crm",
    categoryLabel: "CRM",
    result: "A single source of truth connecting marketing, sales, and follow-up.",
  },
  {
    title: "YouTube Growth Strategy",
    category: "marketing",
    categoryLabel: "Content",
    result: "A production and distribution system that compounded audience growth.",
  },
  {
    title: "Multi-Channel Marketing Campaign",
    category: "marketing",
    categoryLabel: "Marketing",
    result: "Coordinated campaigns across channels driving consistent qualified leads.",
  },
];

export const caseStudyCategories = [
  { id: "all", label: "All" },
  { id: "real-estate", label: "Real Estate" },
  { id: "websites", label: "Websites" },
  { id: "marketing", label: "Marketing" },
  { id: "automation", label: "Automation" },
  { id: "crm", label: "CRM" },
];

export const processSteps = [
  {
    no: "01",
    title: "Discovery",
    body: "Understanding business goals, challenges, audience, and growth opportunities.",
  },
  {
    no: "02",
    title: "Strategy",
    body: "Creating a complete roadmap covering branding, technology, marketing, and automation.",
  },
  {
    no: "03",
    title: "Design",
    body: "Developing user experiences, interfaces, content systems, and creative assets.",
  },
  {
    no: "04",
    title: "Build",
    body: "Building websites, automations, CRM systems, and growth infrastructure.",
  },
  {
    no: "05",
    title: "Launch",
    body: "Deploying systems, campaigns, and digital assets.",
  },
  {
    no: "06",
    title: "Optimize & Scale",
    body: "Continuous monitoring, optimization, and business growth.",
  },
];

export const aboutValues = [
  "Growth Mindset",
  "Innovation",
  "Long-Term Partnerships",
  "Data-Driven Decisions",
  "End-to-End Ownership",
  "Business-First Thinking",
];

export const insightCategories = [
  { title: "SEO Insights", body: "Tactics and frameworks for sustainable organic growth." },
  { title: "Marketing Strategies", body: "Performance playbooks for qualified lead generation." },
  { title: "Automation Guides", body: "How to remove manual work and scale operations." },
  { title: "Real Estate Marketing", body: "Lead systems built for property businesses." },
  { title: "Website Optimization", body: "Turning traffic into measurable conversions." },
  { title: "Growth Systems", body: "Connecting every channel into one growth engine." },
  { title: "Case Study Breakdowns", body: "What worked, why, and how to repeat it." },
  { title: "Industry Trends", body: "Where digital growth is heading next." },
];
