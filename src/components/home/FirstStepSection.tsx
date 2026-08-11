"use client";
import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import SocialLinks from "@/components/ui/SocialLinks";
import PumaSilhouette from "@/components/puma/PumaSilhouette";
import { MailIcon, PinIcon } from "@/components/home/HomeIcons";
import { apiFetch } from "@/lib/api-client";
import { EASE_LUXURY } from "@/lib/motion";

/**
 * "Κάνε το πρώτο βήμα" — the plum band that closes the page: the invitation and
 * the contact details on the left, the booking form on the right. It posts to
 * the same endpoint as the contact page, so submissions land in one place.
 */
export default function FirstStepSection() {
  const t = useTranslations("home.firstStep");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    level: "",
    goal: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const levels = tContact.raw("form.levels") as string[];
  const email = tContact("info.email");

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
      alert(
        locale === "el"
          ? "Αποτυχία αποστολής. Δοκίμασε ξανά."
          : "Submission failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="first-step" className="relative overflow-hidden bg-home-ink px-5 py-20 sm:px-6 md:py-24">
      {/* The puma watching from the corner, barely there. */}
      <div className="pointer-events-none absolute -bottom-10 left-0 w-[26rem] opacity-[0.07] lg:w-[34rem]" aria-hidden>
        <PumaSilhouette gradientId="first-step-puma" />
      </div>

      <div ref={ref} className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: EASE_LUXURY }}
            className="home-display text-white text-[clamp(1.8rem,3.6vw,2.6rem)]"
          >
            {t("title")}
            <br />
            {t("title2")}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_LUXURY }}
            className="mt-6 max-w-md text-[14.5px] leading-[1.85] text-white/58"
          >
            {t("lead")}
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.28, ease: EASE_LUXURY }}
            className="mt-9 space-y-3.5"
          >
            <li className="flex items-center gap-3">
              <MailIcon className="text-brass-soft h-[18px] w-[18px] shrink-0" />
              <a
                href={`mailto:${email}`}
                className="text-[13.5px] text-white/80 transition-colors hover:text-white"
              >
                {email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <PinIcon className="text-brass-soft h-[18px] w-[18px] shrink-0" />
              <span className="text-[13.5px] text-white/80">{t("location")}</span>
            </li>
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.4, ease: EASE_LUXURY }}
            className="mt-8"
          >
            <SocialLinks variant="dark" />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.22, ease: EASE_LUXURY }}
        >
          {submitted ? (
            <div className="flex min-h-[20rem] items-center justify-center rounded-lg border border-[color:var(--home-brass)]/40 bg-white/5 p-10 text-center">
              <p className="home-display text-brass-soft text-[1.3rem]">{t("success")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <input
                  required
                  className="home-field"
                  placeholder={tContact("form.name")}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  className="home-field"
                  placeholder={tContact("form.email")}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                  className="home-field"
                  placeholder={tContact("form.phone")}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                <select
                  className="home-field"
                  value={form.level}
                  onChange={(e) => setForm({ ...form, level: e.target.value })}
                  aria-label={tContact("form.level")}
                >
                  <option value="">{tContact("form.level")}</option>
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                rows={4}
                className="home-field resize-none"
                placeholder={tContact("form.message")}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-gradient-to-b from-[color:var(--home-brass-soft)] to-[color:var(--home-brass)] px-8 py-4 text-[15px] font-semibold text-[color:var(--home-ink-deep)] shadow-[0_12px_32px_rgba(198,161,91,0.26)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(198,161,91,0.38)] disabled:pointer-events-none disabled:opacity-60"
              >
                {loading ? "…" : t("submit")}
              </button>

              <p className="pt-1 text-center text-[11.5px] text-white/45">{t("note")}</p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
