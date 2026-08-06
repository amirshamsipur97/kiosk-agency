import DevTerminal from "@/components/sections/DevTerminal";
import Reveal from "@/components/ui/Reveal";
import { getDevServices } from "@/lib/dev-services";

export default async function WhyKiosk() {
  const services = await getDevServices();

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="bg-gradient-to-r from-[#f4f4f5] to-[#8e8e8f] bg-clip-text pb-1 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-transparent text-balance sm:text-4xl md:text-5xl">
            A partner built around your growth
          </h2>
        </Reveal>
        <DevTerminal services={services} />
      </div>
    </section>
  );
}
