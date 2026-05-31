import Hero from "@/components/sections/Hero";
import Philosophy from "@/components/sections/Philosophy";
import TrustedBy from "@/components/sections/TrustedBy";
import WhatWeDo from "@/components/sections/WhatWeDo";
import Approach from "@/components/sections/Approach";
import Industries from "@/components/sections/Industries";
import Services from "@/components/sections/Services";
import CaseStudies from "@/components/sections/CaseStudies";
import WhyKiosk from "@/components/sections/WhyKiosk";
import Process from "@/components/sections/Process";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Philosophy />
      <TrustedBy />
      <WhatWeDo />
      <Approach />
      <Industries />
      <Services />
      <CaseStudies />
      <WhyKiosk />
      <Process />
      <FinalCTA />
    </>
  );
}
