import Starfield from "@/components/ui/Starfield";
import Nav from "@/components/ui/Nav";
import SceneIndicator from "@/components/ui/SceneIndicator";
import Hero from "@/components/sections/Hero";
import MoonPassage from "@/components/sections/MoonPassage";
import Overview from "@/components/sections/Overview";
import Timeline from "@/components/sections/Timeline";
import Moonwalk from "@/components/sections/Moonwalk";
import Beyond from "@/components/sections/Beyond";
import Traveler from "@/components/sections/Traveler";
import Missions from "@/components/sections/Missions";
import Return from "@/components/sections/Return";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />
      <SceneIndicator />

      <main>
        <Hero />
        <MoonPassage>
          <Overview />
          <Timeline />
        </MoonPassage>
        <Moonwalk />
        <Beyond />
        <Traveler />
        <Missions />
        <Return />
      </main>

      <Footer />

      {/* Film grain over everything, under nothing important */}
      <div aria-hidden className="grain" />
    </>
  );
}
