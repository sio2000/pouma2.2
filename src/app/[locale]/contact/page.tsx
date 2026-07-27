"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import PremiumButton from "@/components/ui/PremiumButton";
import SectionLabel from "@/components/ui/SectionLabel";
import AtmosphericBackground from "@/components/ui/AtmosphericBackground";
import { apiFetch } from "@/lib/api-client";
import SocialLinks from "@/components/ui/SocialLinks";
import { siteConfig } from "@/lib/seo";
import { EASE_LUXURY } from "@/lib/motion";

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef<HTMLDivElement>(null);
  const formInView = useInView(formRef, { once: true, margin: "-8%" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", level: "", goal: "", message: "" });

  const levels = t.raw("form.levels") as string[];
  const goals = t.raw("form.goals") as string[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
    } catch {
      alert(locale === "el" ? "Αποτυχία αποστολής. Δοκίμασε ξανά." : "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-premium";

  return (
    <div className="bg-ivory min-h-screen">
      <AtmosphericBackground variant="hero" className="pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6">
        <div ref={heroRef} className="max-w-3xl mx-auto text-center relative z-10">
          <SectionLabel variant="light">{t("hero.label")}</SectionLabel>

          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: 70, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-plum leading-tight tracking-tight"
            >
              {t("hero.headline")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: 70, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.18, ease: EASE_LUXURY }}
              className="font-display font-light text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gradient leading-tight tracking-tight"
            >
              {t("hero.headline2")}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="text-body-premium text-lg max-w-xl mx-auto"
          >
            {t("hero.sub")}
          </motion.p>
        </div>
      </AtmosphericBackground>

      <section className="pb-16 sm:pb-20 md:pb-28 lg:pb-36 px-4 sm:px-6 pt-4 sm:pt-6 md:pt-10">
        <div
          ref={formRef}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: EASE_LUXURY }}
            className="w-full"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full max-lg:min-h-[280px] min-h-[420px] flex flex-col items-center justify-center bg-white rounded-3xl border border-lav-100 p-8 sm:p-10 md:p-12 lg:p-14 text-center shadow-medium"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-lav-100 flex items-center justify-center mb-6"
                >
                  <svg className="w-7 h-7 text-lav-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="font-display text-2xl text-plum mb-3">{t("form.success")}</h3>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl border border-lav-100/80 p-6 sm:p-8 md:p-10 lg:p-12 shadow-medium"
              >
                <p className="text-[11px] font-bold text-plum/30 uppercase tracking-[0.2em] mb-6">
                  {locale === "el" ? "Φόρμα επικοινωνίας" : "Contact form"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.phone")}
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.level")}
                    </label>
                    <select
                      value={form.level}
                      onChange={(e) => setForm({ ...form, level: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">—</option>
                      {levels.map((l) => (
                        <option key={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.goal")}
                    </label>
                    <select
                      value={form.goal}
                      onChange={(e) => setForm({ ...form, goal: e.target.value })}
                      className={`${inputClass} cursor-pointer`}
                    >
                      <option value="">—</option>
                      {goals.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-plum/35 uppercase tracking-[0.2em] mb-2">
                      {t("form.message")}
                    </label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <div className="mt-8 pt-2">
                  <PremiumButton type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
                    {loading ? "…" : t("form.submit")}
                  </PremiumButton>
                </div>
              </form>
            )}
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, delay: 0.1, ease: EASE_LUXURY }}
            className="w-full flex flex-col gap-6 lg:self-start"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-medium border border-lav-200/30 bg-dark-section text-white">
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-lav-700/25 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gold-400/10 blur-3xl" />
              </div>

              <div className="relative z-10 p-8 md:p-9">
                <h3 className="font-display text-xl mb-6">{t("info.title")}</h3>

                <a
                  href={`mailto:${siteConfig.email}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 mb-4 hover:border-gold-400/35 hover:bg-white/[0.09] transition-all duration-300"
                >
                  <span className="w-10 h-10 rounded-xl bg-gold-400/15 border border-gold-400/25 flex items-center justify-center text-gold-300 flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">
                      {t("info.emailLabel")}
                    </span>
                    <span className="block text-sm text-white/85 group-hover:text-gold-200 group-hover:underline underline-offset-2 transition-colors break-all">
                      {t("info.email")}
                    </span>
                  </span>
                </a>

                <div className="flex items-center gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 mb-6">
                  <span className="w-10 h-10 rounded-xl bg-lav-700/50 border border-white/10 flex items-center justify-center text-lav-200 text-sm flex-shrink-0">
                    ↩
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-0.5">
                      {t("info.responseLabel")}
                    </span>
                    <span className="text-sm text-white/70">{t("info.response")}</span>
                  </span>
                </div>

                <p className="text-white/45 text-sm leading-relaxed mb-6">{t("info.note")}</p>

                <div className="pt-6 border-t border-white/10">
                  <SocialLinks
                    variant="dark"
                    labels={{ follow: locale === "el" ? "Ακολούθησέ μας" : "Follow us" }}
                  />
                </div>

                <div className="mt-6 rounded-2xl px-5 py-4 border border-gold-400/30 bg-gold-400/10 text-center">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-gold-300 mb-1.5">
                    {t("info.freeBadge")}
                  </span>
                  <p className="font-display text-base text-white/90 leading-snug">{t("info.freeNote")}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>
    </div>
  );
}
