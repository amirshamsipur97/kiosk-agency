import "./kiosk.css";
import Chrome from "@/components/k/Chrome";
import { ContentProvider } from "@/components/k/Content";
import Hero from "@/components/k/Hero";
import Manifesto from "@/components/k/Manifesto";
import Feed from "@/components/k/Feed";
import Ivory from "@/components/k/Ivory";
import Ground from "@/components/k/Ground";
import Clients from "@/components/k/Clients";
import Contact from "@/components/k/Contact";
import StickyCta from "@/components/k/StickyCta";
import Motion from "@/components/k/Motion";

export default function Home() {
  return (
    <div className="ksite">
      <ContentProvider>
        <Chrome />
        <Hero />
        <Manifesto />
        <Feed />
        <Ivory />
        <Ground />
        <Clients />
        <Contact />
        <StickyCta />
        <Motion />
      </ContentProvider>
    </div>
  );
}
