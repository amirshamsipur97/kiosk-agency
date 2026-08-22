import type { MetadataRoute } from "next";

const BASE = "https://www.kioskoman.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/studio"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}

/* Generated at build time, not per request: the site is exported as files. */
export const dynamic = "force-static";
