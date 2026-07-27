"use client";
import HeroEmpathyRotator from "@/components/sections/hero/HeroEmpathyRotator";

/**
 * The rotating-fears beat, lifted out of the hero and given its own quiet band.
 * The mockups keep the hero to a single clean statement, so the "Νιώθεις ότι…"
 * rotator — and its cross-fade — now runs here, centred, directly after the
 * three pain cards where the same thought is already in the reader's head.
 */
export default function EmpathyBand() {
  return (
    <section className="relative overflow-hidden bg-editorial-paper px-5 sm:px-6 py-16 md:py-20">
      <div className="mx-auto max-w-3xl">
        <HeroEmpathyRotator />
      </div>
    </section>
  );
}
