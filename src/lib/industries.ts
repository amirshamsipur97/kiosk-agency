export type Industry = {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  challenges: string[];
  solutions: string[];
  leadGen: string[];
  automation: string[];
  packages: string[];
  caseStudies: string[];
};

export const industries: Industry[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    headline: "Growth systems for modern real estate",
    intro:
      "From listing platforms to automated lead qualification, we help agencies and developers capture demand and convert it into closed deals.",
    challenges: [
      "High lead volume with low qualification",
      "Slow response times to inquiries",
      "Fragmented listing and CRM data",
      "Difficulty proving marketing ROI",
    ],
    solutions: [
      "Property listing platform & CMS",
      "Lead generation funnels",
      "Automated lead qualification",
      "CRM integration & pipeline setup",
    ],
    leadGen: [
      "Meta & Google lead campaigns",
      "Landing pages per development",
      "Retargeting for warm buyers",
    ],
    automation: [
      "Instant inquiry auto-response",
      "Lead scoring & routing to agents",
      "Follow-up sequences & reminders",
    ],
    packages: ["Full Growth System", "CRM + Automation", "Website Packages"],
    caseStudies: [
      "Real Estate Lead Generation Platform",
      "Property Listing System",
      "Luxury Real Estate Marketing Campaign",
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    headline: "Drive showroom and online demand",
    intro:
      "We build content, campaigns, and CRM systems that turn browsers into test drives and buyers for dealerships and automotive brands.",
    challenges: [
      "Inventory changes faster than the website",
      "Leads scattered across channels",
      "Hard to attribute sales to campaigns",
      "Inconsistent brand content",
    ],
    solutions: [
      "Inventory-ready website & CMS",
      "Commercial video & photography",
      "Performance marketing campaigns",
      "CRM & lead management",
    ],
    leadGen: [
      "Vehicle-specific ad campaigns",
      "Test-drive booking funnels",
      "Seasonal promotion landing pages",
    ],
    automation: [
      "Lead capture to CRM sync",
      "Automated test-drive scheduling",
      "Service & follow-up reminders",
    ],
    packages: ["Media Packages", "CRM + Automation", "Website Packages"],
    caseStudies: ["Multi-Channel Marketing Campaign", "CRM Implementation Project"],
  },
  {
    slug: "hospitality",
    name: "Hospitality",
    headline: "Fill rooms, tables, and experiences",
    intro:
      "We craft premium content and booking-focused systems for hotels, restaurants, and venues that need to stay fully booked.",
    challenges: [
      "Dependence on third-party platforms",
      "Seasonal demand fluctuations",
      "Maintaining a premium brand image",
      "Slow direct-booking growth",
    ],
    solutions: [
      "Booking-optimized website",
      "Premium photography & video",
      "Social content production",
      "Direct-booking funnels",
    ],
    leadGen: [
      "Direct-booking ad campaigns",
      "Seasonal & event promotions",
      "Loyalty and remarketing flows",
    ],
    automation: [
      "Reservation confirmations",
      "Pre-arrival & review requests",
      "Guest follow-up campaigns",
    ],
    packages: ["Media Packages", "Website Packages", "Automation Packages"],
    caseStudies: ["YouTube Growth Strategy", "Multi-Channel Marketing Campaign"],
  },
  {
    slug: "media",
    name: "Media & Entertainment",
    headline: "Build audiences that compound",
    intro:
      "We help media brands and creators grow distribution, production quality, and monetizable audiences across platforms.",
    challenges: [
      "Inconsistent content output",
      "Plateauing audience growth",
      "Underused content archive",
      "Unclear performance data",
    ],
    solutions: [
      "Content production systems",
      "YouTube & social strategy",
      "Editing & post production",
      "Analytics & growth tracking",
    ],
    leadGen: [
      "Audience growth campaigns",
      "Cross-platform distribution",
      "Sponsorship-ready media kits",
    ],
    automation: [
      "Publishing workflows",
      "Community response systems",
      "Performance reporting dashboards",
    ],
    packages: ["Media Packages", "SEO Packages", "Automation Packages"],
    caseStudies: ["YouTube Growth Strategy", "Multi-Channel Marketing Campaign"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    headline: "Trusted digital presence for healthcare",
    intro:
      "We build compliant, trust-building platforms and patient-acquisition systems for clinics, practices, and healthcare brands.",
    challenges: [
      "Building patient trust online",
      "Managing appointment inquiries",
      "Compliance and clear messaging",
      "Standing out locally",
    ],
    solutions: [
      "Trust-focused website & UX",
      "Local SEO",
      "Appointment lead funnels",
      "CRM & follow-up automation",
    ],
    leadGen: [
      "Local search & map visibility",
      "Service-specific landing pages",
      "Reputation & review growth",
    ],
    automation: [
      "Appointment request handling",
      "Reminder & follow-up messages",
      "Patient feedback collection",
    ],
    packages: ["Website Packages", "SEO Packages", "Automation Packages"],
    caseStudies: ["CRM Implementation Project", "Automated Lead Qualification System"],
  },
  {
    slug: "smes",
    name: "SMEs",
    headline: "Enterprise-grade systems, SME budgets",
    intro:
      "We give growing businesses a complete digital foundation — website, marketing, CRM, and automation — built to scale as you do.",
    challenges: [
      "Limited time and resources",
      "Disconnected tools and data",
      "Inconsistent lead flow",
      "No clear growth roadmap",
    ],
    solutions: [
      "Business website & CMS",
      "Lead generation marketing",
      "CRM setup & automation",
      "Analytics & reporting",
    ],
    leadGen: [
      "Starter ad campaigns",
      "Conversion-focused landing pages",
      "Email & remarketing flows",
    ],
    automation: [
      "Lead capture & routing",
      "Customer follow-up systems",
      "Simple reporting dashboards",
    ],
    packages: ["Starter Website", "CRM Setup", "Basic SEO"],
    caseStudies: ["Automated Lead Qualification System", "CRM Implementation Project"],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
