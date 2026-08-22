import type { MetadataRoute } from "next";

const BASE = "https://www.kioskoman.com";

/** Every page the site has. /studio is a back office and stays out. */
const PAGES: [path: string, priority: number][] = [
  ["", 1],
  ["/services", 0.9],
  ["/clients", 0.8],
  ["/films", 0.8],
  ["/on-the-ground", 0.8],
  ["/insights", 0.7],
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PAGES.map(([path, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));
}

/* Generated at build time, not per request: the site is exported as files. */
export const dynamic = "force-static";
