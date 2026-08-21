import type { Metadata } from "next";
import "./studio.css";
import Studio from "@/components/studio/Studio";

export const metadata: Metadata = {
  title: "Studio",
  // Kept out of search results and out of the sitemap: it is a back office,
  // not a page of the site.
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioPage() {
  return <Studio />;
}
