"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { EASE_LUXURY } from "@/lib/motion";
import type { Resource } from "@/lib/db/types";
import { apiFetch } from "@/lib/api-client";
import ResourceCard from "@/components/resources/ResourceCard";
import ListPagination from "@/components/ui/ListPagination";
import { paginate } from "@/lib/pagination";
import { normalizeResourceType } from "@/lib/resource-types";

type Category = "all" | "pdf" | "articles" | "extras" | "announcements";

const TYPE_ICON: Record<string, React.ReactNode> = {
  pdf: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  ),
  extras: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
      />
    </svg>
  ),
  articles: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
      />
    </svg>
  ),
  announcements: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46"
      />
    </svg>
  ),
};

const TYPE_ACCENT: Record<string, string> = {
  pdf: "from-lav-500/15 to-lav-100/40 text-lav-700",
  articles: "from-plum/8 to-lav-50 text-plum",
  extras: "from-gold-400/15 to-ivory text-gold-700",
  announcements: "from-lav-600/12 to-lav-100/30 text-lav-800",
};

const TYPE_BAR: Record<string, string> = {
  pdf: "bg-lav-500",
  articles: "bg-plum/50",
  extras: "bg-gold-400",
  announcements: "bg-lav-700",
};

export default function ResourcesPage() {
  const t = useTranslations("resources");
  const locale = useLocale();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });
  const [active, setActive] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/resources")
      .then((r) => r.json())
      .then((data) => setResources(Array.isArray(data) ? data : []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false));
  }, []);

  const cats: Category[] = ["all", "pdf", "articles", "extras", "announcements"];

  const counts = useMemo(() => {
    const map: Record<Category, number> = {
      all: resources.length,
      pdf: 0,
      articles: 0,
      extras: 0,
      announcements: 0,
    };
    resources.forEach((r) => {
      const type = normalizeResourceType(r.type);
      map[type]++;
    });
    return map;
  }, [resources]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((r) => {
      const type = normalizeResourceType(r.type);
      const catMatch = active === "all" || type === active;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        t(`categories.${r.type}`).toLowerCase().includes(q)
      );
    });
  }, [active, query, t, resources]);

  useEffect(() => {
    setPage(1);
  }, [active, query]);

  const paginated = useMemo(() => paginate(filtered, page), [filtered, page]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(locale === "el" ? "el-GR" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="bg-ivory min-h-screen">
      <section className="relative pt-28 sm:pt-32 lg:pt-36 pb-14 sm:pb-16 lg:pb-20 px-4 sm:px-6 overflow-hidden bg-warm-mesh">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[480px] h-[400px] rounded-full bg-lav-200/25 blur-3xl" />
          <div className="absolute bottom-0 left-1/5 w-[320px] h-[280px] rounded-full bg-gold-400/8 blur-3xl" />
        </div>
        <div ref={heroRef} className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="inline-flex items-center gap-2 mb-7"
          >
            <div className="w-6 h-px bg-lav-500" />
            <span className="text-eyebrow text-lav-600">{t("hero.label")}</span>
            <div className="w-6 h-px bg-lav-500" />
          </motion.div>

          <div className="overflow-hidden mb-1">
            <motion.h1
              initial={{ y: 70, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.1, ease: EASE_LUXURY }}
              className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-plum leading-tight tracking-tight"
            >
              {t("hero.headline")}
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: 70, opacity: 0 }}
              animate={heroInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 1, delay: 0.18, ease: EASE_LUXURY }}
              className="font-display font-light text-4xl sm:text-5xl md:text-6xl text-gradient leading-tight tracking-tight"
            >
              {t("hero.headline2")}
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.38 }}
            className="text-plum/50 text-lg max-w-xl mx-auto font-light leading-relaxed"
          >
            {t("hero.sub")}
          </motion.p>
        </div>
      </section>

      <section className="pb-28 px-6 -mt-4">
        <div className="max-w-5xl mx-auto">
          <div className="glass rounded-[1.75rem] border border-lav-100/80 shadow-medium p-5 md:p-7 mb-10">
            <div className="flex flex-col lg:flex-row lg:items-end gap-5 lg:gap-8">
              <div className="flex-1">
                <label htmlFor="resource-search" className="sr-only">
                  {t("searchPlaceholder")}
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-plum/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                  <input
                    id="resource-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/80 border border-lav-100 text-plum text-sm placeholder:text-plum/30 focus:outline-none focus:ring-2 focus:ring-lav-400/40 focus:border-lav-300 transition-all"
                  />
                </div>
              </div>
              <p className="text-sm text-plum/45 font-light max-lg:whitespace-normal whitespace-nowrap lg:pb-3">
                <span className="font-semibold text-lav-600 tabular-nums">{filtered.length}</span>{" "}
                {t("results")}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-lav-100/70">
              <p className="text-[10px] font-bold text-plum/30 uppercase tracking-[0.2em] mb-4">
                {t("filtersLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {cats.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActive(cat)}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                      active === cat
                        ? "bg-lav-600 text-white shadow-soft"
                        : "bg-white/70 border border-lav-200/80 text-plum/55 hover:border-lav-400 hover:text-plum hover:bg-white"
                    }`}
                  >
                    {t(`categories.${cat}`)}
                    <span
                      className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-full ${
                        active === cat ? "bg-white/15 text-white/90" : "bg-lav-50 text-lav-600"
                      }`}
                    >
                      {counts[cat]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-24">
              <p className="text-plum/40 text-lg font-light">
                {locale === "el" ? "Φόρτωση υλικού…" : "Loading materials…"}
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 rounded-[1.75rem] border border-dashed border-lav-200 bg-white/50">
              <p className="text-plum/40 text-lg font-light">
                {query.trim() ? t("emptySearch") : t("empty")}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <AnimatePresence mode="popLayout">
                  {paginated.items.map((r, i) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.45, delay: i * 0.05, ease: EASE_LUXURY }}
                      className="h-full min-w-0"
                    >
                      <ResourceCard
                        resource={r}
                        typeIcon={TYPE_ICON[r.type]}
                        typeAccent={TYPE_ACCENT[r.type] ?? ""}
                        typeBar={TYPE_BAR[r.type] ?? "bg-lav-400"}
                        categoryLabel={t(`categories.${r.type}`)}
                        formattedDate={formatDate(r.date)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <ListPagination
                className="mt-10"
                page={paginated.page}
                totalPages={paginated.totalPages}
                total={paginated.total}
                rangeStart={paginated.rangeStart}
                rangeEnd={paginated.rangeEnd}
                onPageChange={setPage}
                prevLabel={t("pagination.prev")}
                nextLabel={t("pagination.next")}
                rangeLabel={t("pagination.range", {
                  start: paginated.rangeStart,
                  end: paginated.rangeEnd,
                  total: paginated.total,
                })}
                pageLabel={
                  paginated.totalPages > 1
                    ? t("pagination.page", {
                        page: paginated.page,
                        totalPages: paginated.totalPages,
                      })
                    : undefined
                }
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
