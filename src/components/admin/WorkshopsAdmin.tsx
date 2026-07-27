"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminPagination from "@/components/admin/AdminPagination";
import WorkshopParticipantsModal from "@/components/admin/WorkshopParticipantsModal";
import ResourceImage from "@/components/resources/ResourceImage";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import { paginate } from "@/lib/pagination";
import { resolveMediaUrl } from "@/lib/upload-url";
import type { WorkshopStatus, WorkshopView } from "@/lib/workshops/types";

type WorkshopWithCount = WorkshopView & { registrationCount: number };
type Filter = "active" | "completed" | "all";

const STATUS_META: Record<WorkshopStatus, { label: string; cls: string }> = {
  upcoming: { label: "Προσεχώς", cls: "bg-lav-100 text-lav-700" },
  live: { label: "Live", cls: "bg-green-100 text-green-700" },
  completed: { label: "Ολοκληρώθηκε", cls: "bg-plum/5 text-plum/45" },
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "active", label: "Ενεργά" },
  { id: "completed", label: "Ολοκληρωμένα" },
  { id: "all", label: "Όλα" },
];

const PUBLIC_LOCALE = "el";

const emptyForm = {
  title: "",
  subtitle: "",
  description: "",
  slug: "",
  date: "",
  time: "",
  durationMinutes: "120",
  active: true,
};

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-lav-200 bg-ivory/40 text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lav-400/40 placeholder:text-plum/30";
const labelClass = "block text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-2";

export default function WorkshopsAdmin() {
  const [workshops, setWorkshops] = useState<WorkshopWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("active");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [removeBanner, setRemoveBanner] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [participants, setParticipants] = useState<WorkshopWithCount | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/api/workshops?scope=all");
      if (!res.ok) {
        setWorkshops([]);
        setLoading(false);
        return;
      }
      const data = await parseJsonResponse<WorkshopWithCount[]>(res);
      setWorkshops(Array.isArray(data) ? data : []);
    } catch {
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const active = workshops.filter((w) => w.status !== "completed").length;
    const completed = workshops.filter((w) => w.status === "completed").length;
    return { active, completed, all: workshops.length };
  }, [workshops]);

  const filtered = useMemo(() => {
    if (filter === "active") return workshops.filter((w) => w.status !== "completed");
    if (filter === "completed") return workshops.filter((w) => w.status === "completed");
    return workshops;
  }, [workshops, filter]);

  const paged = paginate(filtered, page);

  const setBanner = (file: File | null) => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview);
    setBannerFile(file);
    setBannerPreview(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setBanner(null);
    setEditingId(null);
    setRemoveBanner(false);
    setShowForm(false);
    setFormError(null);
  };

  const startCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const startEdit = (w: WorkshopWithCount) => {
    setEditingId(w.id);
    setForm({
      title: w.title,
      subtitle: w.subtitle ?? "",
      description: w.description ?? "",
      slug: w.slug,
      date: w.date,
      time: w.time,
      durationMinutes: String(w.durationMinutes ?? 120),
      active: w.active,
    });
    setBanner(null);
    setRemoveBanner(false);
    setFormError(null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const save = async () => {
    if (!form.title.trim()) return setFormError("Συμπλήρωσε τίτλο.");
    if (!form.date) return setFormError("Επίλεξε ημερομηνία.");
    if (!form.time) return setFormError("Επίλεξε ώρα.");

    setSaving(true);
    setFormError(null);
    try {
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("subtitle", form.subtitle.trim());
      fd.append("description", form.description);
      fd.append("slug", form.slug.trim());
      fd.append("date", form.date);
      fd.append("time", form.time);
      fd.append("durationMinutes", String(parseInt(form.durationMinutes, 10) || 120));
      fd.append("active", form.active ? "true" : "false");
      if (bannerFile) fd.append("banner", bannerFile);
      if (editingId && removeBanner) fd.append("removeBanner", "1");

      const res = editingId
        ? await apiFetch(`/api/workshops/${editingId}`, { method: "PATCH", body: fd })
        : await apiFetch("/api/workshops", { method: "POST", body: fd });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Αποτυχία αποθήκευσης.");

      await load();
      resetForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Αποτυχία αποθήκευσης.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (w: WorkshopWithCount) => {
    if (
      !confirm(
        `Διαγραφή του workshop «${w.title}»; Θα διαγραφούν και οι ${w.registrationCount} συμμετοχές του. Η ενέργεια δεν αναιρείται.`
      )
    ) {
      return;
    }
    const res = await apiFetch(`/api/workshops/${w.id}`, { method: "DELETE" });
    if (res.ok) {
      setWorkshops((prev) => prev.filter((x) => x.id !== w.id));
      if (editingId === w.id) resetForm();
    } else {
      alert("Αποτυχία διαγραφής.");
    }
  };

  const editingBanner = editingId
    ? resolveMediaUrl(workshops.find((w) => w.id === editingId)?.bannerUrl)
    : null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display text-plum">Workshops</h1>
          <p className="text-plum/45 text-sm mt-1">
            Δημιουργία & διαχείριση εργαστηρίων, συμμετοχών και emails
          </p>
        </div>
        <button
          type="button"
          onClick={() => (showForm && !editingId ? resetForm() : startCreate())}
          className="px-4 py-2.5 rounded-xl bg-lav-600 text-white text-sm font-medium hover:bg-lav-700 transition-colors cursor-pointer self-start"
        >
          + Νέο workshop
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl border border-lav-200 p-6 mb-6 shadow-soft overflow-hidden"
          >
            <h3 className="text-plum font-medium mb-4">
              {editingId ? "Επεξεργασία workshop" : "Νέο workshop"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Τίτλος *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputClass}
                  placeholder="π.χ. AI Marketing Masterclass"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Υπότιτλος</label>
                <input
                  value={form.subtitle}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className={inputClass}
                  placeholder="Σύντομη περιγραφή μιας γραμμής"
                />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass}>Περιγραφή</label>
                <textarea
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className={`${inputClass} resize-y`}
                  placeholder="Αναλυτική περιγραφή. Χρησιμοποίησε κενές γραμμές για παραγράφους."
                />
              </div>
              <div>
                <label className={labelClass}>Slug (URL)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className={inputClass}
                  placeholder="auto από τον τίτλο"
                />
                <p className="text-[11px] text-plum/30 mt-1.5">
                  /workshop/{form.slug.trim() || "…"}
                </p>
              </div>
              <div>
                <label className={labelClass}>Διάρκεια (λεπτά)</label>
                <input
                  type="number"
                  min={15}
                  step={15}
                  value={form.durationMinutes}
                  onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Ημερομηνία *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                />
              </div>
              <div>
                <label className={labelClass}>Ώρα * (Αθήνα)</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className={`${inputClass} cursor-pointer`}
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Banner (εικόνα)</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-plum/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-lav-100 file:text-lav-700 file:font-medium file:cursor-pointer hover:file:bg-lav-200"
                />
                {(bannerPreview || (editingBanner && !removeBanner)) && (
                  <div className="mt-3 relative w-full max-w-sm aspect-video rounded-xl overflow-hidden border border-lav-100">
                    <ResourceImage src={bannerPreview || editingBanner || ""} alt="" fill />
                  </div>
                )}
                {editingId && editingBanner && (
                  <label className="inline-flex items-center gap-2 text-xs text-red-500/80 cursor-pointer mt-3">
                    <input
                      type="checkbox"
                      checked={removeBanner}
                      onChange={(e) => setRemoveBanner(e.target.checked)}
                      className="rounded border-lav-300"
                    />
                    Αφαίρεση τρέχοντος banner
                  </label>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="inline-flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="rounded border-lav-300 h-4 w-4 text-lav-600"
                  />
                  <span className="text-sm text-plum/70">
                    Ενεργό (ορατό στο κοινό & ανοιχτές εγγραφές)
                  </span>
                </label>
              </div>
            </div>

            {formError && (
              <p className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                {formError}
              </p>
            )}

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="px-4 py-2 rounded-xl bg-lav-600 text-white text-sm cursor-pointer hover:bg-lav-700 disabled:opacity-50"
              >
                {saving ? "Αποθήκευση…" : editingId ? "Ενημέρωση" : "Δημιουργία"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl border border-lav-200 text-plum/50 text-sm cursor-pointer hover:bg-lav-50"
              >
                Ακύρωση
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter tabs */}
      {workshops.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => {
                setFilter(f.id);
                setPage(1);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                filter === f.id
                  ? "bg-lav-600 text-white shadow-soft"
                  : "bg-white border border-lav-200 text-plum/55 hover:border-lav-400 hover:text-plum"
              }`}
            >
              {f.label}
              <span
                className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-full ${
                  filter === f.id ? "bg-white/20" : "bg-lav-100 text-lav-700"
                }`}
              >
                {counts[f.id]}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <p className="text-plum/40 text-center py-16">Φόρτωση…</p>
      ) : workshops.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-lav-200">
          <p className="text-plum/40 mb-1">Δεν υπάρχουν workshops ακόμα.</p>
          <p className="text-plum/30 text-sm">Δημιούργησε το πρώτο σου workshop.</p>
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-plum/35 text-center py-16 bg-white rounded-2xl border border-dashed border-lav-200">
          Δεν υπάρχουν workshops σε αυτή την κατηγορία.
        </p>
      ) : (
        <div className="bg-white rounded-2xl border border-lav-100 shadow-soft overflow-hidden">
          <div className="space-y-3 p-3">
            {paged.items.map((w) => {
              const banner = resolveMediaUrl(w.bannerUrl);
              const meta = STATUS_META[w.status];
              return (
                <div
                  key={w.id}
                  className="flex flex-col lg:flex-row lg:items-center gap-4 p-4 rounded-2xl bg-white border border-lav-100 shadow-soft hover:border-lav-200 transition-all"
                >
                  <div className="relative w-full lg:w-32 aspect-video lg:aspect-[4/3] rounded-xl overflow-hidden bg-lav-50 flex-shrink-0">
                    {banner ? (
                      <ResourceImage src={banner} alt={w.title} fill />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-lav-300 text-2xl">
                        ✦
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.cls}`}>
                        {meta.label}
                      </span>
                      {!w.active && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Ανενεργό
                        </span>
                      )}
                    </div>
                    <p className="text-plum font-medium truncate">{w.title}</p>
                    <p className="text-plum/40 text-xs mt-1">
                      {new Date(w.date).toLocaleDateString("el-GR")} · {w.time} · /workshop/{w.slug}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setParticipants(w)}
                      className="text-lav-700 bg-lav-50 hover:bg-lav-100 text-sm px-3 py-1.5 rounded-lg border border-lav-100 cursor-pointer font-medium"
                    >
                      Συμμετοχές
                      <span className="ml-1.5 text-[11px] tabular-nums bg-lav-600 text-white rounded-full px-1.5 py-0.5">
                        {w.registrationCount}
                      </span>
                    </button>
                    <a
                      href={`/${PUBLIC_LOCALE}/workshop/${w.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-plum/60 hover:text-plum text-sm px-3 py-1.5 rounded-lg border border-lav-200 hover:bg-lav-50 cursor-pointer"
                    >
                      Προβολή ↗
                    </a>
                    <button
                      type="button"
                      onClick={() => startEdit(w)}
                      className="text-lav-600 hover:text-lav-800 text-sm px-3 py-1.5 rounded-lg border border-lav-200 hover:bg-lav-50 cursor-pointer"
                    >
                      Επεξεργασία
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(w)}
                      className="text-red-400/70 hover:text-red-500 text-sm px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 cursor-pointer"
                    >
                      Διαγραφή
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <AdminPagination
            page={paged.page}
            totalPages={paged.totalPages}
            total={paged.total}
            rangeStart={paged.rangeStart}
            rangeEnd={paged.rangeEnd}
            onPageChange={setPage}
          />
        </div>
      )}

      <AnimatePresence>
        {participants && (
          <WorkshopParticipantsModal
            workshop={participants}
            onClose={() => setParticipants(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
