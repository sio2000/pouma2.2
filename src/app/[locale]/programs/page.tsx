"use client";
import { useRef } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import PremiumButton from "@/components/ui/PremiumButton";
import AtmosphericBackground from "@/components/ui/AtmosphericBackground";
import { EASE_LUXURY } from "@/lib/motion";
import { useAutoRotate } from "@/hooks/useAutoRotate";

type PathKey = "path1" | "path2" | "path3" | "path4";

const PATH_META: Record<
  PathKey,
  { accent: string; ring: string; node: string }
> = {
  path1: {
    accent: "from-lav-200/80 to-lav-50",
    ring: "ring-lav-400/40",
    node: "bg-lav-500",
  },
  path2: {
    accent: "from-lav-300/60 to-lav-100",
    ring: "ring-lav-500/45",
    node: "bg-lav-600",
  },
  path3: {
    accent: "from-gold-200/70 to-gold-100/40",
    ring: "ring-gold-400/50",
    node: "bg-gold-400",
  },
  path4: {
    accent: "from-lav-100 to-ivory",
    ring: "ring-lav-300/50",
    node: "bg-lav-600",
  },
};

function JourneyNode({
  pathKey,
  index,
  isActive,
  onClick,
}: {
  pathKey: PathKey;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const t = useTranslations("programs");
  const ref = useRef<HTMLButtonElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });
  const meta = PATH_META[pathKey];

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, x: -40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.75, delay: index * 0.08, ease: EASE_LUXURY }}
      className={`group relative w-full text-left flex gap-6 items-stretch cursor-pointer`}
    >
      {/* Timeline spine */}
      <div className="flex flex-col items-center flex-shrink-0 pt-2">
        <motion.div
          animate={isActive ? { scale: 1.15 } : { scale: 1 }}
          className={`w-4 h-4 rounded-full ${meta.node} ring-4 ${meta.ring} shadow-glow z-10`}
        />
        {index < 3 && (
          <div className="w-px flex-1 min-h-[72px] bg-gradient-to-b from-lav-300/60 to-lav-100/30 mt-2" />
        )}
      </div>

      <div
        className={`flex-1 mb-8 p-6 md:p-8 rounded-3xl border transition-all duration-500 ${
          isActive
            ? "border-lav-400/60 bg-white shadow-medium scale-[1.01]"
            : "border-lav-100/80 bg-white/60 hover:border-lav-200 hover:shadow-soft"
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className="text-eyebrow text-lav-600">{t(`${pathKey}.tag`)}</span>
          <span className="font-display text-2xl text-lav-200/90 font-light">
            {t(`${pathKey}.number`)}
          </span>
        </div>
        <h3 className="font-display text-2xl md:text-3xl text-plum font-light tracking-tight mb-1">
          {t(`${pathKey}.title`)}
        </h3>
        <p className="font-display italic text-plum/45 text-base">
          {t(`${pathKey}.subtitle`)}
        </p>
      </div>
    </motion.button>
  );
}

function JourneyDetail({ pathKey }: { pathKey: PathKey }) {
  const t = useTranslations("programs");
  const locale = useLocale();
  const isPath4 = pathKey === "path4";
  const isPath1 = pathKey === "path1";
  const isPath3 = pathKey === "path3";
  const items = isPath4
    ? (t.raw("path4.goals") as string[])
    : (t.raw(`${pathKey}.focuses`) as string[]);
  const meta = PATH_META[pathKey];

  return (
    <motion.div
      key={pathKey}
      initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: EASE_LUXURY }}
      className="lg:sticky lg:top-28"
    >
      <div className="rounded-[2rem] overflow-hidden shadow-strong relative bg-dark-section max-lg:min-h-0 min-h-[520px]">
        <div className={`absolute inset-0 bg-gradient-to-br ${meta.accent} opacity-[0.07]`} />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-lav-700/28 blur-3xl" />
          <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="absolute inset-0 dot-grid opacity-[0.05]" />
        </div>

        <div className="relative z-10 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col h-full">
          <span
            className={`inline-block text-eyebrow px-3 py-1.5 rounded-full mb-6 w-fit ${
              isPath3
                ? "bg-gold-400/15 text-gold-300"
                : "bg-lav-400/15 text-lav-300"
            }`}
          >
            {t(`${pathKey}.tag`)}
          </span>

          <h2 className="font-display font-light text-4xl md:text-[2.75rem] text-white leading-[1.05] tracking-tight mb-3">
            {t(`${pathKey}.title`)}
          </h2>
          <p className="font-display italic text-xl text-lav-300/90 mb-8">
            {t(`${pathKey}.subtitle`)}
          </p>

          <div className="w-12 h-px bg-gradient-to-r from-lav-500 to-transparent mb-8" />
          <p className="text-white/55 text-base leading-relaxed mb-8 max-w-md">
            {t(`${pathKey}.description`)}
          </p>

          {isPath1 && (
            <div className="grid grid-cols-2 gap-3 mb-8">
              {(["duration", "sessions", "sessionLength", "groupSize"] as const).map(
                (k) => (
                  <div
                    key={k}
                    className="rounded-2xl px-4 py-3.5 glass-dark border border-white/8"
                  >
                    <p className="text-white/90 text-sm font-medium">
                      {t(`path1.${k}`)}
                    </p>
                  </div>
                )
              )}
            </div>
          )}

          <div className="flex-1">
            <p className="text-eyebrow text-lav-400/55 mb-4">
              {isPath4
                ? locale === "el"
                  ? "Στόχοι"
                  : "Goals"
                : locale === "el"
                  ? "Εστίαση"
                  : "Focus"}
            </p>
            <ul className="space-y-3">
              {items.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className="flex items-center gap-3 text-white/65 text-sm"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isPath4 ? "bg-gold-400" : "bg-lav-400"
                    }`}
                  />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="mt-10">
            <PremiumButton
              href={`/${locale}/contact`}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {t("cta.button")}
            </PremiumButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProgramsPage() {
  const t = useTranslations("programs");
  const locale = useLocale();
  const paths: PathKey[] = ["path1", "path2", "path3", "path4"];
  const { active: activeIndex, setActive: setActiveIndex, pause, resume } =
    useAutoRotate({ length: paths.length, intervalMs: 4200 });
  const active = paths[activeIndex];
  const setActive = (key: PathKey) => setActiveIndex(paths.indexOf(key));

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const journeyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: journeyRef,
    offset: ["start end", "end start"],
  });
  const pathGlow = useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.5, 0.2]);

  return (
    <div className="bg-ivory min-h-screen">
      <AtmosphericBackground variant="hero" className="pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6">
        <div ref={heroRef} className="max-w-4xl mx-auto text-center relative z-10">
          <SectionLabel variant="light" delay={0}>
            {t("hero.label")}
          </SectionLabel>

          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE_LUXURY }}
              className="text-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-plum"
            >
              {t("hero.headline")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 80, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1.1, delay: 0.18, ease: EASE_LUXURY }}
              className="text-display-xl text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-gradient"
            >
              {t("hero.headline2")}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-body-premium text-lg max-w-xl mx-auto"
          >
            {t("hero.sub")}
          </motion.p>
        </div>
      </AtmosphericBackground>

      {/* Journey */}
      <section
        ref={journeyRef}
        className="legacy-palette py-20 md:py-28 px-6 relative overflow-hidden"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        <motion.div
          style={{ opacity: pathGlow }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-lav-200/30 blur-[100px] pointer-events-none"
          aria-hidden
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <SectionLabel variant="light">{t("journeyLabel")}</SectionLabel>
            <h2 className="font-display font-light text-4xl md:text-5xl text-plum tracking-tight">
              {t("selector")}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
            <div>
              {paths.map((p, i) => (
                <JourneyNode
                  key={p}
                  pathKey={p}
                  index={i}
                  isActive={active === p}
                  onClick={() => setActive(p)}
                />
              ))}
            </div>
            <AnimatePresence mode="wait">
              <JourneyDetail key={active} pathKey={active} />
            </AnimatePresence>
          </div>

        </div>
      </section>

      <section className="py-24 md:py-32 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="relative rounded-3xl overflow-hidden bg-dark-section shadow-strong"
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-lav-800/30 blur-3xl" />
              <div className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl" />
              <div className="absolute inset-0 dot-grid opacity-[0.04]" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 sm:gap-10 lg:gap-14 p-6 sm:p-8 md:p-10 lg:p-14 items-center">
              <div className="text-center lg:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-400/30 bg-gold-400/10 text-gold-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                  {t("cta.badge")}
                </span>
                <h2 className="font-display font-light text-3xl md:text-4xl lg:text-[2.75rem] text-white leading-tight tracking-tight mb-4">
                  {t("cta.headline")}
                </h2>
                <p className="text-white/50 text-base md:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0">
                  {t("cta.body")}
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-stretch gap-6">
                <ul className="space-y-3 w-full max-w-sm mx-auto lg:max-w-none">
                  {(t.raw("cta.perks") as string[]).map((perk) => (
                    <li
                      key={perk}
                      className="flex items-center gap-3 text-sm text-white/55 bg-white/[0.04] border border-white/8 rounded-xl px-4 py-3"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                      {perk}
                    </li>
                  ))}
                </ul>
                <PremiumButton
                  href={`/${locale}/contact`}
                  variant="gold"
                  size="lg"
                  className="w-full sm:w-auto self-center lg:self-start"
                >
                  {t("cta.button")}
                </PremiumButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
