import HomeHero from "@/components/home/HomeHero";
import AffectsSection from "@/components/home/AffectsSection";
import ProgramsShowcase from "@/components/home/ProgramsShowcase";
import SpeakingMethodSection from "@/components/home/SpeakingMethodSection";
import WhatChangesSection from "@/components/home/WhatChangesSection";
import WhyAcademySection from "@/components/home/WhyAcademySection";
import DimitraSection from "@/components/home/DimitraSection";
import VoicesSection from "@/components/home/VoicesSection";
import WhyPumaSection from "@/components/home/WhyPumaSection";
import FirstStepSection from "@/components/home/FirstStepSection";

import IntroSection from "@/components/sections/IntroSection";
import EmpathyBand from "@/components/sections/EmpathyBand";
import PhilosophySection from "@/components/sections/PhilosophySection";
import PersonalizationSection from "@/components/sections/PersonalizationSection";
import CommunicationSection from "@/components/sections/CommunicationSection";
import MethodSection from "@/components/sections/MethodSection";
import CtaSection from "@/components/sections/CtaSection";

/**
 * The homepage follows the client's reference page: the dark hero states the
 * promise, "Αυτό σε αφορά αν…" lets her recognise herself, the programmes and
 * the Speaking Method explain what happens, "Τι αλλάζει" and "Γιατί The Pouma
 * Academy" answer what she gets and why here, then Dimitra, the participants
 * and the puma give it a face.
 *
 * Three of the older bands are no longer rendered here because the new ones
 * say the same thing: the old testimonials, "Γιατί είμαστε διαφορετικοί", and
 * the long puma story. The components are untouched in the repo — putting any
 * of them back is one line.
 */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <AffectsSection />
      <ProgramsShowcase />
      <SpeakingMethodSection />
      <WhatChangesSection />
      <WhyAcademySection />
      <DimitraSection />
      <VoicesSection />
      <WhyPumaSection />

      <IntroSection />
      <EmpathyBand />
      <MethodSection />
      <CommunicationSection />
      <PhilosophySection />
      <PersonalizationSection />
      <CtaSection />

      <FirstStepSection />
    </>
  );
}
