import type { MetadataRoute } from "next";

const BASE = "https://www.kioskoman.com";

const services = [
  "website-digital-systems",
  "media-content",
  "growth-marketing",
  "seo",
  "automation-crm",
];
const industries = [
  "real-estate",
  "automotive",
  "hospitality",
  "media",
  "healthcare",
  "smes",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const top = [
    "",
    "/services",
    "/industries",
    "/packages",
    "/process",
    "/about",
    "/insights",
    "/case-studies",
    "/contact",
  ].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const svc = services.map((s) => ({
    url: `${BASE}/services/${s}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const ind = industries.map((s) => ({
    url: `${BASE}/industries/${s}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...top, ...svc, ...ind];
}
