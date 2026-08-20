import type { Metadata } from "next";
import "../kiosk.css";
import Chrome from "@/components/k/Chrome";
import GroundStage from "@/components/k/GroundStage";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";
import { GROUND_SETS } from "@/lib/kiosk";

export const metadata: Metadata = {
  title: "On the ground",
  description:
    "Retail stands, aisle takeovers, illuminated signage, exhibition halls and school displays, fabricated and installed in-house by KIOSK Agency, Muscat, Oman.",
  alternates: { canonical: "/on-the-ground" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "KIOSK Agency — On the ground",
  about: GROUND_SETS.map((s) => s.label),
  hasPart: GROUND_SETS.map((s) => ({
    "@type": "ImageGallery",
    name: s.label,
    description: s.body,
    numberOfItems: s.shots.length,
  })),
};

export default function OnTheGroundPage() {
  return (
    <div className="ksite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Chrome />
      <GroundStage />
      <Contact />
      <StickyCta />
      <Motion />
    </div>
  );
}
