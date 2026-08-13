export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const nav: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Website & Digital Systems", href: "/services/website-digital-systems" },
      { label: "Media & Content Production", href: "/services/media-content" },
      { label: "Growth Marketing", href: "/services/growth-marketing" },
      { label: "SEO Services", href: "/services/seo" },
      { label: "Automation & CRM", href: "/services/automation-crm" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Real Estate", href: "/industries/real-estate" },
      { label: "Automotive", href: "/industries/automotive" },
      { label: "Hospitality", href: "/industries/hospitality" },
      { label: "Media", href: "/industries/media" },
      { label: "Healthcare", href: "/industries/healthcare" },
      { label: "SMEs", href: "/industries/smes" },
    ],
  },
  {
    label: "Case Studies",
    href: "/case-studies",
    children: [
      { label: "Real Estate", href: "/case-studies?category=real-estate" },
      { label: "Websites", href: "/case-studies?category=websites" },
      { label: "Marketing", href: "/case-studies?category=marketing" },
      { label: "Automation", href: "/case-studies?category=automation" },
      { label: "CRM", href: "/case-studies?category=crm" },
    ],
  },
  {
    label: "Packages",
    href: "/packages",
    children: [
      { label: "Media Packages", href: "/packages#media" },
      { label: "Website Packages", href: "/packages#website" },
      { label: "SEO Packages", href: "/packages#seo" },
      { label: "Automation Packages", href: "/packages#automation" },
    ],
  },
  { label: "Process", href: "/process" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/insights" },
  { label: "Contact", href: "/contact" },
];

export const site = {
  name: "KIOSK",
  fullName: "KIOSK Agency",
  tagline: "Connected digital systems that attract, engage, convert, and scale.",
  email: "info@kioskoman.com",
  website: "www.kioskoman.com",
  websiteUrl: "https://www.kioskoman.com",
  crNumber: "1480635",
  phones: [
    "+968 909 909 23",
    "+968 9092 0764",
    "+968 7747 0912",
    "+968 9961 1029",
  ],
  whatsapp: "+968 909 909 23",
  address: {
    line1: "Unit 617, 6th floor, office 1991",
    line2: "Al Ghubrah St, Muscat, Sultanate of Oman",
  },
  location: "Muscat, Sultanate of Oman",
};
