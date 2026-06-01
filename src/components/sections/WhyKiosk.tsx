import SectionHeading from "@/components/ui/SectionHeading";
import DevTerminal from "@/components/sections/DevTerminal";
import { getDevServices } from "@/lib/dev-services";

export default async function WhyKiosk() {
  const services = await getDevServices();

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <SectionHeading
          eyebrow="Why KIOSK"
          title="A partner built around your growth"
        />
        <DevTerminal services={services} />
      </div>
    </section>
  );
}
