"use client";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * "Reveal on scroll" band — fixed-background strip (like thepoumaacademy.com).
 * The band is a partial-height strip (normal website shows above and below it).
 * Its background — the large Pouma logo on a deep plum field — is pinned to the
 * viewport (background-attachment: fixed), so as the foreground statement scrolls
 * over and away, the logo is progressively revealed. Falls back to a normal
 * scrolling background on touch devices (where fixed attachment is janky).
 *
 * Reusable: pass a different i18n `namespace` to render another identical band
 * with its own copy.
 */
export default function RevealStatement({
  namespace = "reveal",
}: {
  namespace?: string;
}) {
  const t = useTranslations(namespace);

  return (
    <section className="bg-ivory py-12 md:py-16">
      <div
        className="relative w-full overflow-hidden h-[48vh] min-h-[340px] bg-scroll lg:bg-fixed"
        style={{
          backgroundColor: "var(--color-plum)",
          backgroundImage: "url('/finallogo.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center 26%",
          backgroundSize: "auto 150%",
        }}
      >
        {/* accent divider lines, top & bottom */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-lav-400/70 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        {/* richness + legibility overlays (scroll with the strip) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_36%,rgba(176,154,232,0.28)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-plum/72 via-plum/45 to-plum/85" />
        <div className="absolute inset-0 dot-grid opacity-[0.06] mix-blend-overlay pointer-events-none" />

        {/* Foreground content — scrolls with the strip while the logo stays pinned. */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, ease: EASE_LUXURY }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="w-8 h-px bg-gold-400/70" />
            <span className="text-eyebrow text-gold-300">{t("eyebrow")}</span>
            <span className="w-8 h-px bg-gold-400/70" />
          </motion.div>

          <h2 className="font-display font-light tracking-tight leading-[1.08] max-w-4xl">
            <motion.span
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, delay: 0.1, ease: EASE_LUXURY }}
              className="block text-white/95 text-[clamp(1.8rem,4.6vw,3.4rem)] [text-shadow:0_2px_24px_rgba(20,11,40,0.6)]"
            >
              {t("line1")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.9, delay: 0.24, ease: EASE_LUXURY }}
              className="block text-gold text-[clamp(1.8rem,4.6vw,3.4rem)]"
            >
              {t("line2")}
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, delay: 0.42, ease: EASE_LUXURY }}
            className="mt-6 max-w-xl text-white/80 text-base md:text-lg font-light leading-relaxed [text-shadow:0_1px_16px_rgba(20,11,40,0.55)]"
          >
            {t("sub")}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
