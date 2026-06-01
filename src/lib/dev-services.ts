// Service capability data, sourced from the Supabase `dev_services` table.
// A local fallback mirrors the table so the static build never breaks if the
// database is briefly unreachable at build time.

export type DevCapability = {
  capability: string;
  description: string;
  outcome: string;
};

export type DevService = {
  slug: string;
  name: string;
  overview: string;
  sort: number;
  capabilities: DevCapability[];
};

const SUPABASE_URL = "https://tefxdyhmmrmgcywqzbqu.supabase.co";
// Public anon key — safe to embed; row-level security allows read-only access.
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZnhkeWhtbXJtZ2N5d3F6YnF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyMzgxMDYsImV4cCI6MjA5NTgxNDEwNn0.GNcWq4jbg8Piye6Tqekic8-MW6jBsR-YY8-QAp23wVI";

const FALLBACK: DevService[] = [
  {
    slug: "website-digital-systems",
    name: "Website & Digital Systems",
    overview:
      "We design and develop scalable digital platforms that are optimized for performance, usability, and growth.",
    sort: 1,
    capabilities: [
      { capability: "UI/UX Design", description: "User-Centered Design", outcome: "Modern Experience" },
      { capability: "Website Development", description: "WordPress & Custom Code Development", outcome: "Functional Website" },
      { capability: "E-Commerce", description: "Online Store Setup", outcome: "Sales Platform" },
      { capability: "CMS Setup", description: "Content Management System", outcome: "Easy Control" },
      { capability: "CRM Integration", description: "Zoho Integration", outcome: "Lead Tracking" },
      { capability: "Automation", description: "AI & Workflow Systems (n8n)", outcome: "Smart Operations" },
      { capability: "Analytics Setup", description: "GA4 & GTM", outcome: "Data Visibility" },
      { capability: "Maintenance", description: "Updates & Support", outcome: "Stability" },
    ],
  },
  {
    slug: "media-content",
    name: "Media & Content Production",
    overview:
      "We create premium visual content that strengthens brand positioning and drives audience engagement.",
    sort: 2,
    capabilities: [
      { capability: "Videography", description: "Cinematic Brand Films", outcome: "Brand Awareness" },
      { capability: "Photography", description: "Product & Lifestyle Shoots", outcome: "Professional Image" },
      { capability: "Commercial Production", description: "Full-Service Ad Production", outcome: "Higher Engagement" },
      { capability: "Drone Production", description: "Aerial Cinematography", outcome: "Premium Visuals" },
      { capability: "Social Content", description: "Instagram, TikTok & YouTube", outcome: "Content Consistency" },
      { capability: "Editing", description: "Post-Production & Color", outcome: "Polished Output" },
      { capability: "Graphic Design", description: "Visual Systems", outcome: "Brand Cohesion" },
      { capability: "Brand Assets", description: "Reusable Templates", outcome: "Scalable Creative" },
    ],
  },
  {
    slug: "growth-marketing",
    name: "Growth Marketing",
    overview:
      "Data-driven campaigns engineered to generate qualified leads, increase visibility, and grow revenue at a lower cost of acquisition.",
    sort: 3,
    capabilities: [
      { capability: "Google Ads", description: "High-Intent Search Campaigns", outcome: "Qualified Leads" },
      { capability: "Meta Ads", description: "Instagram & Facebook Campaigns", outcome: "Increased Visibility" },
      { capability: "Lead Funnels", description: "Landing Pages & Flows", outcome: "More Conversions" },
      { capability: "Remarketing", description: "Re-Engagement Campaigns", outcome: "Lower Acquisition Cost" },
      { capability: "Campaign Optimization", description: "A/B Testing & Tuning", outcome: "Better ROAS" },
      { capability: "Conversion Tracking", description: "Pixel & Event Setup", outcome: "Clear Attribution" },
      { capability: "Audience Research", description: "Targeting & Personas", outcome: "Sharper Reach" },
      { capability: "Marketing Analytics", description: "Performance Dashboards", outcome: "Revenue Growth" },
    ],
  },
  {
    slug: "seo",
    name: "SEO Services",
    overview:
      "Technical and content-driven SEO that builds search visibility, organic traffic, and lasting authority for your brand.",
    sort: 4,
    capabilities: [
      { capability: "Technical SEO", description: "Crawl & Speed Fixes", outcome: "Search Visibility" },
      { capability: "On-Page SEO", description: "Metadata & Structure", outcome: "Better Rankings" },
      { capability: "Keyword Strategy", description: "Search Intent Mapping", outcome: "Targeted Traffic" },
      { capability: "Content Optimization", description: "SEO Copywriting", outcome: "Organic Traffic" },
      { capability: "Competitor Analysis", description: "Gap Research", outcome: "Strategic Edge" },
      { capability: "Monthly Reporting", description: "Ranking & Traffic Reports", outcome: "Transparency" },
      { capability: "Continuous Optimization", description: "Ongoing Improvements", outcome: "Sustainable Growth" },
    ],
  },
  {
    slug: "automation-crm",
    name: "Automation & CRM",
    overview:
      "We connect your tools and automate the repetitive work so your team can focus on closing — faster responses, cleaner pipelines, better conversion.",
    sort: 5,
    capabilities: [
      { capability: "Workflow Automation", description: "n8n & Make Pipelines", outcome: "Operational Efficiency" },
      { capability: "CRM Setup", description: "Zoho / HubSpot Configuration", outcome: "Organized Pipeline" },
      { capability: "CRM Integration", description: "Connected Tools & Data", outcome: "Single Source of Truth" },
      { capability: "AI Response Systems", description: "Instant Smart Replies", outcome: "Faster Response Times" },
      { capability: "Lead Qualification", description: "Scoring & Routing", outcome: "Better Lead Quality" },
      { capability: "Lead Management", description: "Follow-up Sequences", outcome: "Improved Conversion" },
      { capability: "Sales Automation", description: "Pipeline Triggers", outcome: "Less Manual Work" },
      { capability: "Reporting Systems", description: "Automated Dashboards", outcome: "Data Visibility" },
    ],
  },
];

export async function getDevServices(): Promise<DevService[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/dev_services?select=slug,name,overview,sort,capabilities&order=sort.asc`,
      {
        headers: {
          apikey: SUPABASE_ANON,
          Authorization: `Bearer ${SUPABASE_ANON}`,
        },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return FALLBACK;
    const data = (await res.json()) as DevService[];
    if (!Array.isArray(data) || data.length === 0) return FALLBACK;
    return data;
  } catch {
    return FALLBACK;
  }
}
