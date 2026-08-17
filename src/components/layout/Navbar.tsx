"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import LogoSparkle from "@/components/ui/LogoSparkle";
import { X } from "lucide-react";
import { EASE_LUXURY } from "@/lib/motion";

export default function Navbar() {
  const t = useTranslations("nav");
  const tHome = useTranslations("home.nav");
  const brand = useTranslations("brand");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();
  // Pages with a dark, full-bleed hero (workshop) keep the classic
  // transparent-at-top bar so the white nav text reads over the dark image.
  // Everywhere else the bar keeps a solid (glass) background from the very top,
  // so the wordmark and links never bleed into the page content while
  // scrolling — it only deepens very slightly once the user starts to scroll.
  // The homepage now opens on the deep-plum hero, so it joins the workshop
  // pages in wanting a transparent bar with light text until the user scrolls.
  const isHomePath = pathname === `/${locale}` || pathname === `/${locale}/`;
  const hasDarkHero = pathname.includes("/workshop/") || isHomePath;
  const bgOpacity = useTransform(scrollY, [0, 60], hasDarkHero ? [0, 1] : [0.97, 1]);
  const borderOpacity = useTransform(scrollY, [0, 80], hasDarkHero ? [0, 1] : [0.55, 1]);
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 80));

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const links = [
    { href: "/", label: t("home") },
    { href: "/programs", label: t("programs") },
    { href: "/about", label: t("about") },
    { href: "/resources", label: t("resources") },
    { href: "/contact", label: t("contact") },
  ];

  const lp = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const isActive = (href: string) => {
    const full = lp(href);
    if (href === "/")
      return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(full);
  };

  const isHome = isHomePath;

  // Pages with a dark, full-bleed hero need light nav text until the user
  // scrolls and the (light) glass background fades in.
  const onDark = hasDarkHero && !scrolled;

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <motion.div
        style={{ opacity: bgOpacity }}
        className="fixed top-0 left-0 right-0 z-40 h-32 pointer-events-none"
        aria-hidden
      >
        <div className="h-full glass" />
      </motion.div>
      <motion.div
        style={{ opacity: borderOpacity }}
        className="fixed top-32 left-0 right-0 z-40 h-px bg-gradient-to-r from-transparent via-lav-300/40 to-transparent pointer-events-none"
        aria-hidden
      />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: EASE_LUXURY }}
        className="fixed top-0 left-0 right-0 z-50 h-32"
      >
        <div className="home-container h-full flex items-center justify-between">
          <Link href={lp("/")} onClick={handleLogoClick} className="flex items-center gap-2 sm:gap-3 group min-w-0 flex-1 sm:flex-initial sm:flex-shrink-0 max-w-[calc(100%-3.25rem)]">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -2 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="relative w-[4.5rem] h-[4.5rem] sm:w-[7rem] sm:h-[7rem] lg:w-[5rem] lg:h-[5rem] xl:w-[6.5rem] xl:h-[6.5rem] flex-shrink-0"
            >
              <Image
                src="/finallogo.png"
                alt="The Pouma Academy"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 112px, 140px"
                priority
              />
              <LogoSparkle />
            </motion.div>
            <div className="block leading-tight min-w-0">
              <span
                className={cn(
                  "font-display text-[15px] sm:text-base md:text-lg font-semibold tracking-wide block leading-snug transition-colors duration-300",
                  onDark ? "text-white" : "text-lav-600"
                )}
              >
                {brand("name")}
              </span>
              <span
                className={cn(
                  "font-script text-[13px] sm:text-sm block leading-tight mt-0.5 sm:mt-1 pl-0.5 whitespace-normal transition-colors duration-300 lg:hidden xl:block",
                  onDark ? "text-white/75" : "text-plum"
                )}
              >
                {brand("tagline")}
              </span>
              <span className="relative inline-block mt-1 pl-0.5 lg:hidden xl:inline-block">
                <span
                  className={cn(
                    "font-sans text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] transition-colors duration-300",
                    onDark ? "text-gold-300" : "text-gold-500"
                  )}
                >
                  {brand("sparkle")}
                </span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: [0, 1] }}
                  transition={{
                    duration: 1,
                    ease: EASE_LUXURY,
                    delay: 0.8,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                  }}
                  className="absolute left-0.5 -bottom-1 h-[2px] w-full origin-left rounded-full bg-gradient-to-r from-gold-500 via-gold-300 to-gold-500 shadow-[0_0_8px_rgba(245,179,53,0.9)]"
                />
              </span>
            </div>
          </Link>

          <nav
            className="hidden lg:flex items-center gap-0.5"
            onMouseLeave={() => setHovered(null)}
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={lp(link.href)}
                onMouseEnter={() => setHovered(link.href)}
                className={cn(
                  "relative whitespace-nowrap px-2 xl:px-3.5 py-2.5 text-[12.5px] xl:text-[14px] font-semibold tracking-wide rounded-xl transition-colors duration-300",
                  // On the gold wash the label has to go dark to stay legible,
                  // whichever background the bar is sitting on.
                  hovered === link.href
                    ? "text-plum"
                    : isActive(link.href)
                      ? onDark
                        ? "text-white"
                        : "text-lav-600"
                      : onDark
                        ? "text-white/78"
                        : "text-plum/55"
                )}
              >
                {/* The cursor lights the link in the same gold as the cards. */}
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    className="nav-gold absolute inset-0"
                    transition={{ type: "spring", stiffness: 450, damping: 34 }}
                  />
                )}
                {/* Active page is underlined, per the reference header. */}
                {isActive(link.href) && (
                  <motion.span
                    layoutId="nav-active-underline"
                    className={cn(
                      "absolute bottom-0 left-4 right-4 h-[2px] rounded-full",
                      onDark ? "bg-gold-300" : "bg-plum"
                    )}
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {/* The brass booking button the reference header carries. */}
            <Link
              href={lp("/contact")}
              className="btn-brass group whitespace-nowrap px-4 py-2.5 text-[13px] xl:px-5 xl:text-[13.5px]"
            >
              {tHome("cta")}
            </Link>
            <LanguageSwitcher />
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden relative w-11 h-11 min-w-11 min-h-11 flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-xl hover:bg-lav-50/80 active:bg-lav-100/80 transition-colors touch-manipulation"
            aria-label="Toggle menu"
            style={{ zIndex: 60 }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className={cn("w-5 h-[1.5px] block origin-center", onDark && !menuOpen ? "bg-white" : "bg-plum")}
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className={cn("w-4 h-[1.5px] block self-end", onDark && !menuOpen ? "bg-white" : "bg-plum")}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className={cn("w-5 h-[1.5px] block origin-center", onDark && !menuOpen ? "bg-white" : "bg-plum")}
            />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at calc(100% - 52px) 40px)" }}
            animate={{ opacity: 1, clipPath: "circle(160% at calc(100% - 52px) 40px)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 52px) 40px)" }}
            transition={{ duration: 0.55, ease: EASE_LUXURY }}
            className="fixed inset-0 lg:hidden flex flex-col bg-plum-mid"
            style={{ zIndex: 55 }}
          >
            <div className="absolute top-1/3 right-0 w-80 h-80 rounded-full bg-lav-700/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-gold-400/8 blur-3xl pointer-events-none" />

            <div className="flex flex-col h-full px-6 sm:px-8 pt-6 pb-10">
              <div className="flex items-center justify-end mb-6">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.05 }}
                  onClick={() => setMenuOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/35 active:scale-95 transition-all cursor-pointer"
                  aria-label="Κλείσιμο μενού"
                >
                  <X className="w-6 h-6" strokeWidth={2} aria-hidden />
                </motion.button>
              </div>

              <nav className="flex flex-col gap-0 flex-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -32 }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease: EASE_LUXURY }}
                  >
                    <Link
                      href={lp(link.href)}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block font-display py-4 transition-colors",
                        "text-[clamp(2.5rem,9vw,3.75rem)] leading-[1.05] tracking-tight",
                        isActive(link.href)
                          ? "text-gold-300"
                          : "text-white/70 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-6 border-t border-white/10 pt-8 mt-2"
              >
                <Link
                  href={lp("/contact")}
                  onClick={() => setMenuOpen(false)}
                  className="btn-brass px-6 py-4 text-[16px]"
                >
                  {tHome("cta")}
                </Link>
                <LanguageSwitcher variant="mobile" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
