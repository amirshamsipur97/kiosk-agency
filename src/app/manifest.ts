import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KIOSK Agency",
    short_name: "KIOSK",
    description:
      "Growth-focused digital agency building connected systems that attract, engage, convert, and scale.",
    start_url: "/",
    display: "standalone",
    /* the 2026 site is light; these were still the pre-2026 dark values */
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}

/* Generated at build time, not per request: the site is exported as files. */
export const dynamic = "force-static";
