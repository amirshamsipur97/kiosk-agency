import type { Metadata } from "next";
import "../kiosk.css";
import Chrome from "@/components/k/Chrome";
import FilmStage from "@/components/k/FilmStage";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";
import { FILMS } from "@/lib/kiosk";

export const metadata: Metadata = {
  title: "Films & Series",
  description:
    "Destination films, brand storytelling, property films and podcasts produced end-to-end by KIOSK Agency in Muscat, Oman.",
  alternates: { canonical: "/films" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "KIOSK Agency — Films & Series",
  itemListElement: FILMS.map((f, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: f.title,
    url: f.href,
  })),
};

export default function FilmsPage() {
  return (
    <div className="ksite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Chrome />
      <FilmStage />
      <Contact />
      <StickyCta />
      <Motion />
    </div>
  );
}
