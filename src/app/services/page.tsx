import type { Metadata } from "next";
import "../kiosk.css";
import Chrome from "@/components/k/Chrome";
import { ContentProvider } from "@/components/k/Content";
import ServiceStage from "@/components/k/ServiceStage";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";
import { SERVICES } from "@/lib/kiosk";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Strategy, films, performance ads, social, web and CRM — plus stands, activations and signage built in-house. KIOSK Agency, Muscat, Oman.",
  alternates: { canonical: "/services" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "KIOSK Agency — Services",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.body,
      provider: { "@type": "Organization", name: "KIOSK Agency" },
      areaServed: "OM",
    },
  })),
};

export default function ServicesPage() {
  return (
    <div className="ksite">
      <ContentProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        <Chrome />
        <ServiceStage />
        <Contact />
        <StickyCta />
        <Motion />
      </ContentProvider>
    </div>
  );
}
