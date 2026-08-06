// Package tiers shown on /packages, rendered as Scout-AI-style pricing cards.
// Feature lists come from the provided comparison matrices (Media, SEO) and the
// service overviews (Website, Automation). Prices are approximate placeholders
// — easy to tune later.

export type Tier = {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  theme: "green" | "amber" | "purple" | "blue";
  featured?: boolean;
};

export type PackageGroup = {
  id: string;
  title: string;
  overview: string;
  tiers: Tier[];
};

export const packageGroups: PackageGroup[] = [
  {
    id: "media",
    title: "Media Packages",
    overview:
      "Flexible media packages designed to match your brand's needs — from essential content to full-scale digital growth.",
    tiers: [
      {
        name: "Silver",
        price: "$1,500",
        period: "/mo",
        theme: "green",
        cta: "Get Started",
        description: "Essential visual content to launch your brand with quality.",
        features: ["Videography", "Photography"],
      },
      {
        name: "Gold",
        price: "$3,000",
        period: "/mo",
        theme: "amber",
        cta: "Get Started",
        description: "Grow your presence with managed social and creative.",
        features: [
          "Videography",
          "Photography",
          "Instagram Management",
          "Meta Management",
          "Graphic Design",
        ],
      },
      {
        name: "Platinum",
        price: "$5,000",
        period: "/mo",
        theme: "purple",
        featured: true,
        cta: "Get Started",
        description: "A full content engine across channels, built to scale reach.",
        features: [
          "Videography",
          "Photography",
          "Instagram Management",
          "Meta Management",
          "Graphic Design",
          "YouTube Create Content",
        ],
      },
      {
        name: "Unlimited",
        price: "$8,000",
        period: "/mo",
        theme: "blue",
        cta: "Book A Call",
        description: "Everything, fully managed — your complete media department.",
        features: [
          "Videography",
          "Photography",
          "Instagram Management",
          "Meta Management",
          "Graphic Design",
          "YouTube Create Content",
          "YouTube Management",
          "TikTok Content",
          "LinkedIn",
        ],
      },
    ],
  },
  {
    id: "website",
    title: "Website Packages",
    overview:
      "Scalable digital platforms designed and developed for performance, usability, and growth.",
    tiers: [
      {
        name: "Starter Website",
        price: "$1,200",
        theme: "green",
        cta: "Get Started",
        description: "A fast, modern site to establish your presence.",
        features: ["UI/UX Design", "Website Development", "Analytics Setup"],
      },
      {
        name: "Business Website",
        price: "$3,500",
        theme: "amber",
        cta: "Get Started",
        description: "A managed, content-ready site for growing teams.",
        features: [
          "UI/UX Design",
          "Website Development",
          "CMS Setup",
          "Analytics Setup",
          "Maintenance",
        ],
      },
      {
        name: "Corporate Website",
        price: "$7,000",
        theme: "purple",
        featured: true,
        cta: "Get Started",
        description: "A connected platform with commerce and CRM built in.",
        features: [
          "UI/UX Design",
          "Website Development",
          "E-Commerce",
          "CMS Setup",
          "CRM Integration",
          "Analytics Setup",
          "Maintenance",
        ],
      },
      {
        name: "Custom Platform",
        price: "Custom",
        theme: "blue",
        cta: "Request Access",
        description: "A bespoke system with automation and integrations.",
        features: [
          "UI/UX Design",
          "Website Development",
          "E-Commerce",
          "CMS Setup",
          "CRM Integration",
          "Automation (n8n)",
          "Analytics Setup",
          "Maintenance",
        ],
      },
    ],
  },
  {
    id: "seo",
    title: "SEO Packages",
    overview:
      "Growth strategies that combine short-term performance with long-term scalability.",
    tiers: [
      {
        name: "Basic SEO",
        price: "$800",
        period: "/mo",
        theme: "green",
        cta: "Get Started",
        description: "Foundational SEO to start ranking and get visible.",
        features: [
          "Technical SEO",
          "On-Page Optimization (Basic)",
          "Keyword Strategy (Basic)",
          "Content Optimization",
          "Competitor Analysis",
          "Monthly Reporting",
          "Strategy Level: Low",
        ],
      },
      {
        name: "Standard SEO",
        price: "$1,500",
        period: "/mo",
        theme: "purple",
        featured: true,
        cta: "Get Started",
        description: "Full on-page and ongoing optimization to grow traffic.",
        features: [
          "Technical SEO",
          "On-Page Optimization (Full)",
          "Keyword Strategy (Full)",
          "Content Optimization",
          "Competitor Analysis",
          "Monthly Reporting",
          "Continuous Optimization (Limited)",
          "Strategy Level: Medium",
        ],
      },
      {
        name: "Advanced SEO",
        price: "$2,800",
        period: "/mo",
        theme: "blue",
        cta: "Book A Call",
        description: "Aggressive, continuous SEO for market leadership.",
        features: [
          "Technical SEO",
          "On-Page Optimization (Advanced)",
          "Keyword Strategy (Advanced)",
          "Content Optimization",
          "Competitor Analysis",
          "Monthly Reporting",
          "Continuous Optimization",
          "Strategy Level: High",
        ],
      },
    ],
  },
  {
    id: "automation",
    title: "Automation Packages",
    overview:
      "Connected CRM and automation systems that remove manual work and speed up follow-up.",
    tiers: [
      {
        name: "CRM Setup",
        price: "$1,000",
        theme: "green",
        cta: "Get Started",
        description: "Get organized with a configured CRM and clean pipeline.",
        features: ["CRM Integration (Zoho)", "Lead Management", "Analytics Setup"],
      },
      {
        name: "CRM + Automation",
        price: "$2,500",
        period: "/mo",
        theme: "amber",
        cta: "Get Started",
        description: "Automate follow-up and connect your core tools.",
        features: [
          "CRM Integration (Zoho)",
          "Lead Management",
          "Workflow Automation (n8n)",
          "AI Response Systems",
          "Analytics Setup",
        ],
      },
      {
        name: "Full Growth System",
        price: "$5,000",
        period: "/mo",
        theme: "purple",
        featured: true,
        cta: "Get Started",
        description: "Marketing, CRM, and automation working as one system.",
        features: [
          "CRM Integration (Zoho)",
          "Lead Management",
          "Workflow Automation (n8n)",
          "AI Response Systems",
          "Google Ads",
          "SEO",
          "Reporting Dashboards",
        ],
      },
      {
        name: "Enterprise Automation",
        price: "Custom",
        theme: "blue",
        cta: "Request Access",
        description: "Custom infrastructure with dedicated support at scale.",
        features: [
          "Everything in Full Growth System",
          "Custom Integrations",
          "Dedicated Support",
          "Unlimited Workflows",
        ],
      },
    ],
  },
];
