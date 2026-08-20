import type { Metadata } from "next";
import "../kiosk.css";
import Chrome from "@/components/k/Chrome";
import Journal from "@/components/k/Journal";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";
import { JOURNAL } from "@/lib/kiosk";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Frameworks and playbooks on SEO, advertising, automation and growth systems, written from the accounts KIOSK Agency runs in Muscat, Oman.",
  alternates: { canonical: "/insights" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "KIOSK Agency — Blog",
  description:
    "Frameworks and playbooks on SEO, advertising, automation and growth systems.",
  publisher: { "@type": "Organization", name: "KIOSK Agency" },
  about: JOURNAL.map((j) => j.title),
};

export default function BlogPage() {
  return (
    <div className="ksite">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <Chrome />
      <Journal />
      <Contact />
      <StickyCta />
      <Motion />
    </div>
  );
}
