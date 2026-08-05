"use client";
import HeroEmpathyRotator from "@/components/sections/hero/HeroEmpathyRotator";

/**
 * The rotating-fears beat, lifted out of the hero and given its own quiet band.
 * The mockups keep the hero to a single clean statement, so the "Νιώθεις ότι…"
 * rotator — and its cross-fade — now runs here, centred, directly after the
 * three pain cards where the same thought is already in the reader's head.
 *
 * Scaled up per the client's note: it was too quiet to be noticed on the way
 * down the page, so the band now carries real height and the card real size.
 */
export default function EmpathyBand() {
  return (
    <section className="relative overflow-hidden bg-editorial-paper px-5 sm:px-6 py-20 md:py-28">
      {/* A wide, soft halo behind the band so the eye stops here. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[26rem] w-[52rem] max-w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-lav-100/70 via-transparent to-gold-200/45 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-4xl">
        <HeroEmpathyRotator />
      </div>
    </section>
  );
}
