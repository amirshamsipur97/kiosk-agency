import CtaBanner from "@/components/ui/CtaBanner";

export default function FinalCTA() {
  return (
    <CtaBanner
      title="Let's build something that performs, scales, and stands out."
      description="Book your free strategy consultation and we'll map the growth system your business needs."
      primary={{ label: "Book Your Free Strategy Consultation", href: "/contact" }}
      secondary={{ label: "View Our Work", href: "/case-studies" }}
    />
  );
}
