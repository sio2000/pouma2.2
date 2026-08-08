import HomeHero from "@/components/home/HomeHero";
import AffectsSection from "@/components/home/AffectsSection";
import ProgramsShowcase from "@/components/home/ProgramsShowcase";
import SpeakingMethodSection from "@/components/home/SpeakingMethodSection";
import WhyPumaSection from "@/components/home/WhyPumaSection";
import DimitraSection from "@/components/home/DimitraSection";
import FirstStepSection from "@/components/home/FirstStepSection";

import IntroSection from "@/components/sections/IntroSection";
import EmpathyBand from "@/components/sections/EmpathyBand";
import PhilosophySection from "@/components/sections/PhilosophySection";
import PersonalizationSection from "@/components/sections/PersonalizationSection";
import CommunicationSection from "@/components/sections/CommunicationSection";
import MethodSection from "@/components/sections/MethodSection";
import PumaStory from "@/components/sections/PumaStory";
import PumaClawDivider from "@/components/puma/PumaClawDivider";
import DifferenceSection from "@/components/sections/DifferenceSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CtaSection from "@/components/sections/CtaSection";

/**
 * The homepage follows the layout the client approved (ρεπο): the dark hero
 * states the promise, "Αυτό σε αφορά αν…" lets her recognise herself, the
 * programmes and the Speaking Method explain what happens, then Γιατί Πούμα
 * and Η Δήμητρα give it a face.
 *
 * Everything the site had before is kept, running underneath, and the booking
 * band closes the page so the contact details are the last thing on screen.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AffectsSection />
      <ProgramsShowcase />
      <SpeakingMethodSection />
      <WhyPumaSection />
      <DimitraSection />

      <IntroSection />
      <EmpathyBand />
      <MethodSection />
      <CommunicationSection />
      <DifferenceSection />
      <PhilosophySection />
      <PersonalizationSection />
      <TestimonialsSection />
      <PumaClawDivider className="bg-plum" tone="dark" />
      <PumaStory />
      <CtaSection />

      <FirstStepSection />
    </>
  );
}
