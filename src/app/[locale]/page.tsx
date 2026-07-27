import HeroSection from "@/components/sections/HeroSection";
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
 * Homepage order follows the client-approved mockups: the hero states the
 * problem, the three cards name it, the rotator lets her hear herself in it,
 * the method shows the path, the specialisations sit right underneath it, and
 * the plum puma band closes the page just above the final invitation.
 */
export default function HomePage() {
  return (
    <>
      <HeroSection />
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
    </>
  );
}
