export type Service = {
  slug: string;
  name: string;
  headline: string;
  overview: string;
  services: string[];
  outcomes: string[];
  /** Optional sub-package tiers (used by SEO). */
  tiers?: string[];
};

export const services: Service[] = [
  {
    slug: "website-digital-systems",
    name: "Website & Digital Systems",
    headline: "Designing digital platforms that convert",
    overview:
      "We build scalable digital platforms designed to enhance user experience, generate leads, and support long-term business growth.",
    services: [
      "UI/UX Design",
      "Website Development",
      "Custom CMS",
      "E-Commerce Solutions",
      "Landing Pages",
      "CRM Integration",
      "Analytics Setup",
      "Maintenance & Support",
    ],
    outcomes: [
      "Modern Experience",
      "Lead Generation",
      "Easy Management",
      "Operational Efficiency",
      "Scalability",
    ],
  },
  {
    slug: "media-content",
    name: "Media & Content Production",
    headline: "Content that builds attention and trust",
    overview:
      "We create premium visual content that strengthens brand positioning and drives audience engagement.",
    services: [
      "Videography",
      "Photography",
      "Commercial Production",
      "Drone Production",
      "Editing",
      "YouTube Production",
      "Instagram Content",
      "TikTok Content",
      "Graphic Design",
      "Brand Assets",
    ],
    outcomes: [
      "Brand Awareness",
      "Higher Engagement",
      "Content Consistency",
      "Professional Brand Image",
    ],
  },
  {
    slug: "growth-marketing",
    name: "Growth Marketing",
    headline: "Performance marketing designed for growth",
    overview:
      "Data-driven campaigns engineered to generate qualified leads, increase visibility, and grow revenue at a lower cost of acquisition.",
    services: [
      "Google Ads",
      "Meta Ads",
      "Lead Generation Funnels",
      "Remarketing",
      "Campaign Optimization",
      "Conversion Tracking",
      "Audience Research",
      "Marketing Analytics",
    ],
    outcomes: [
      "Qualified Leads",
      "Increased Visibility",
      "Lower Acquisition Cost",
      "Revenue Growth",
    ],
  },
  {
    slug: "seo",
    name: "SEO Services",
    headline: "Long-term organic growth through strategic SEO",
    overview:
      "Technical and content-driven SEO that builds search visibility, organic traffic, and lasting authority for your brand.",
    services: [
      "Technical SEO",
      "On-Page SEO",
      "Keyword Strategy",
      "Content Optimization",
      "Competitor Analysis",
      "Monthly Reporting",
      "Continuous Optimization",
    ],
    tiers: ["Basic SEO", "Standard SEO", "Advanced SEO"],
    outcomes: [
      "Search Visibility",
      "Organic Traffic",
      "Authority Building",
      "Sustainable Growth",
    ],
  },
  {
    slug: "automation-crm",
    name: "Automation & CRM",
    headline: "Systems that reduce manual work and increase efficiency",
    overview:
      "We connect your tools and automate the repetitive work so your team can focus on closing — faster responses, cleaner pipelines, better conversion.",
    services: [
      "Workflow Automation",
      "CRM Setup",
      "CRM Integration",
      "AI Response Systems",
      "Lead Qualification",
      "Lead Management",
      "Sales Automation",
      "Reporting Systems",
    ],
    outcomes: [
      "Operational Efficiency",
      "Improved Lead Management",
      "Faster Response Times",
      "Higher Conversion Rates",
      "Scalable Operations",
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
