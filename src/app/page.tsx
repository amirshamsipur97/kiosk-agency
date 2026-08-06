import "./kiosk.css";
import Chrome from "@/components/k/Chrome";
import Hero from "@/components/k/Hero";
import Manifesto from "@/components/k/Manifesto";
import Films from "@/components/k/Films";
import Ivory from "@/components/k/Ivory";
import Ground from "@/components/k/Ground";
import Clients from "@/components/k/Clients";
import Contact from "@/components/k/Contact";
import Motion from "@/components/k/Motion";

export default function Home() {
  return (
    <div className="ksite">
      <Chrome />
      <Hero />
      <Manifesto />
      <Films />
      <Ivory />
      <Ground />
      <Clients />
      <Contact />
      <Motion />
    </div>
  );
}
