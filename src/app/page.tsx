import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { AchievementToast } from "@/components/AchievementToast";
import { Intro } from "@/components/sections/Intro";
import { Safety } from "@/components/sections/Safety";
import { AxeAnatomy } from "@/components/sections/AxeAnatomy";
import { Grip } from "@/components/sections/Grip";
import { Stance } from "@/components/sections/Stance";
import { ScrollStory } from "@/components/sections/ScrollStory";
import { RotationSim } from "@/components/sections/RotationSim";
import { VideoPlaceholder } from "@/components/sections/VideoPlaceholder";
import { Mistakes } from "@/components/sections/Mistakes";
import { GameSection } from "@/components/sections/GameSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { Locations } from "@/components/sections/Locations";
import { Faq } from "@/components/sections/Faq";

export default function Home() {
  return (
    <>
      <a
        href="#lernen"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-contrast"
      >
        Zum Inhalt springen
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <Intro />
        <Safety />
        <AxeAnatomy />
        <Grip />
        <Stance />
        <ScrollStory />
        <RotationSim />
        <VideoPlaceholder />
        <Mistakes />
        <GameSection />
        <AchievementsSection />
        <Locations />
        <Faq />
      </main>
      <Footer />
      <AchievementToast />
    </>
  );
}
