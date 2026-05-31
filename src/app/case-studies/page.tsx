import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import CaseStudyExplorer from "@/components/case-studies/CaseStudyExplorer";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real estate, websites, automation, CRM, and marketing systems we've built — and the results they delivered.",
};

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Case Studies"
        title="Systems that delivered results"
        description="A look at the connected systems we've built across industries — from lead platforms to automation and content engines."
      />
      <CaseStudyExplorer />
      <CtaBanner
        title="Want results like these?"
        description="Tell us about your goals and we'll show you what's possible."
        secondary={{ label: "View Packages", href: "/packages" }}
      />
    </>
  );
}
