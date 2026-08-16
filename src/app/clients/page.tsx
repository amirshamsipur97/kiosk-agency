import type { Metadata } from "next";
import "../kiosk.css";
import Chrome from "@/components/k/Chrome";
import ClientHive from "@/components/k/ClientHive";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";
import { CLIENTS } from "@/lib/kiosk";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "The brands KIOSK Agency has delivered for across the GCC — hospitality, automotive, banking, FMCG, telecom and real estate. Muscat, Oman.",
  alternates: { canonical: "/clients" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "KIOSK Agency — Clients",
  itemListElement: CLIENTS.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Organization", name: c.name },
  })),
};

export default function ClientsPage() {
  return (
    <div className="ksite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Chrome />
      <ClientHive />
      <Contact />
      <StickyCta />
      <Motion />
    </div>
  );
}
