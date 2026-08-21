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
