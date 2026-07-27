"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ContactRequest, ContactStatus, Resource, ResourceType } from "@/lib/db/types";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import ContactDetailModal from "@/components/admin/ContactDetailModal";
import AdminPagination from "@/components/admin/AdminPagination";
import WorkshopsAdmin from "@/components/admin/WorkshopsAdmin";
import { paginate } from "@/lib/pagination";
import { normalizeResourceType } from "@/lib/resource-types";

type Section = "overview" | "resources" | "contacts" | "workshops";
type ResourceFilter = "all" | ResourceType;

const NAV_ITEMS: { id: Section; label: string; soon?: boolean }[] = [
  { id: "overview", label: "Επισκόπηση" },
  { id: "resources", label: "Η τάξη μας" },
  { id: "contacts", label: "Αιτήματα" },
  { id: "workshops", label: "Workshops" },
];

const TYPE_LABELS: Record<ResourceType, string> = {
  pdf: "PDF & Υλικό",
  articles: "Άρθρα",
  extras: "Extras",
  announcements: "Ανακοινώσεις",
};

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "Νέο",
  replied: "Απαντήθηκε",
  archived: "Αρχειοθετημένο",
};

function Stat({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-6 border shadow-soft ${
        accent ? "bg-lav-600 border-lav-500 text-white" : "bg-white border-lav-100 text-plum"
      }`}
    >
      <div className={`text-3xl font-bold mb-1 font-display ${accent ? "text-white" : "text-plum"}`}>
        {value}
      </div>
      <div className={`text-sm ${accent ? "text-white/75" : "text-plum/50"}`}>{label}</div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<Section>("overview");
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "pdf" as ResourceType,
    url: "",
  });
  const [resourceFile, setResourceFile] = useState<File | null>(null);
  const [resourceFilePreview, setResourceFilePreview] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [overviewContactsPage, setOverviewContactsPage] = useState(1);
  const [contactsPage, setContactsPage] = useState(1);
  const [resourcesPage, setResourcesPage] = useState(1);
  const [resourceTypeFilter, setResourceTypeFilter] = useState<ResourceFilter>("all");

  const todayLabel = new Date().toLocaleDateString("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const loadData = useCallback(async () => {
    const sessionRes = await apiFetch("/api/admin/session");
    const session = await parseJsonResponse<{ authenticated: boolean }>(sessionRes);
    if (!session.authenticated) {
      router.replace("/admin");
      return;
    }

    const [contactsRes, resourcesRes] = await Promise.all([
      apiFetch("/api/contacts"),
      apiFetch("/api/resources?all=1"),
    ]);

    if (contactsRes.status === 401 || resourcesRes.status === 401) {
      router.replace("/admin");
      return;
    }

    const contactsData = await contactsRes.json();
    const resourcesData = await resourcesRes.json();
    setContacts(Array.isArray(contactsData) ? contactsData : []);
    setResources(Array.isArray(resourcesData) ? resourcesData : []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
  };

  const updateStatus = async (id: string, status: ContactStatus) => {
    const res = await apiFetch("/api/contacts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      setSelectedContact((prev) => (prev?.id === id ? updated : prev));
    }
  };

  const handleResourceFileChange = (file: File | null) => {
    if (resourceFilePreview) URL.revokeObjectURL(resourceFilePreview);
    setResourceFile(file);
    setResourceFilePreview(file ? URL.createObjectURL(file) : null);
  };

  const resetResourceForm = () => {
    setNewResource({ title: "", description: "", type: "pdf", url: "" });
    handleResourceFileChange(null);
    setEditingResourceId(null);
    setRemoveExistingFile(false);
    setShowResourceForm(false);
  };

  const startEditResource = (resource: Resource) => {
    setEditingResourceId(resource.id);
    setNewResource({
      title: resource.title,
      description: resource.description,
      type: normalizeResourceType(resource.type),
      url: resource.url ?? "",
    });
    handleResourceFileChange(null);
    setRemoveExistingFile(false);
    setShowResourceForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveResource = async () => {
    if (!newResource.title.trim() || !newResource.description.trim()) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", newResource.title.trim());
      formData.append("description", newResource.description.trim());
      formData.append("type", newResource.type);
      if (newResource.url.trim()) formData.append("url", newResource.url.trim());
      if (resourceFile) formData.append("file", resourceFile);
      if (editingResourceId && removeExistingFile) formData.append("removeFile", "1");

      const res = editingResourceId
        ? await apiFetch(`/api/resources/${editingResourceId}`, {
            method: "PATCH",
            body: formData,
          })
        : await apiFetch("/api/resources", {
            method: "POST",
            body: formData,
          });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Αποτυχία");

      if (editingResourceId) {
        setResources((prev) => prev.map((r) => (r.id === editingResourceId ? data : r)));
      } else {
        setResources((prev) => [data, ...prev]);
      }
      resetResourceForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Αποτυχία αποθήκευσης υλικού.");
    } finally {
      setSaving(false);
    }
  };

  const removeResource = async (id: string) => {
    if (!confirm("Διαγραφή αυτού του υλικού;")) return;
    const res = await apiFetch(`/api/resources?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      if (editingResourceId === id) resetResourceForm();
    }
  };

  const newCount = contacts.filter((c) => c.status === "new").length;

  const filteredResources = useMemo(() => {
    if (resourceTypeFilter === "all") return resources;
    return resources.filter((r) => normalizeResourceType(r.type) === resourceTypeFilter);
  }, [resources, resourceTypeFilter]);

  const resourceFilterCounts = useMemo(() => {
    const counts: Record<ResourceFilter, number> = {
      all: resources.length,
      pdf: 0,
      articles: 0,
      extras: 0,
      announcements: 0,
    };
    resources.forEach((r) => {
      counts[normalizeResourceType(r.type)]++;
    });
    return counts;
  }, [resources]);

  const overviewContactsPaginated = paginate(contacts, overviewContactsPage);
  const contactsPaginated = paginate(contacts, contactsPage);
  const resourcesPaginated = paginate(filteredResources, resourcesPage);

  useEffect(() => {
    setResourcesPage(1);
  }, [resourceTypeFilter]);

  useEffect(() => {
    if (overviewContactsPage > overviewContactsPaginated.totalPages) {
      setOverviewContactsPage(overviewContactsPaginated.totalPages);
    }
  }, [contacts.length, overviewContactsPage, overviewContactsPaginated.totalPages]);

  useEffect(() => {
    if (contactsPage > contactsPaginated.totalPages) {
      setContactsPage(contactsPaginated.totalPages);
    }
  }, [contacts.length, contactsPage, contactsPaginated.totalPages]);

  useEffect(() => {
    if (resourcesPage > resourcesPaginated.totalPages) {
      setResourcesPage(resourcesPaginated.totalPages);
    }
  }, [filteredResources.length, resourcesPage, resourcesPaginated.totalPages]);

  const resourceFilterOptions: ResourceFilter[] = [
    "all",
    "pdf",
    "articles",
    "extras",
    "announcements",
  ];

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-lav-200 bg-ivory/40 text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lav-400/40 placeholder:text-plum/30";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <p className="text-plum/40">Φόρτωση πίνακα…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-ivory">
      <aside className="w-64 flex flex-col py-8 px-5 flex-shrink-0 bg-white border-r border-lav-100">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="relative w-10 h-10 flex-shrink-0">
            <Image src="/finallogo.png" alt="The Pouma Academy" fill className="object-contain" sizes="40px" />
          </div>
          <div>
            <span className="text-plum font-semibold text-sm block leading-tight">The Pouma Academy</span>
            <span className="text-lav-600 text-[10px] font-bold tracking-[0.18em] uppercase">Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                section === item.id
                  ? "bg-lav-600 text-white font-medium shadow-soft"
                  : "text-plum/50 hover:text-plum hover:bg-lav-50"
              }`}
            >
              <span className="flex items-center justify-between gap-2 w-full">
                <span>{item.label}</span>
                {item.id === "contacts" && newCount > 0 && (
                  <span
                    className={`text-[10px] font-bold min-w-[1.25rem] h-5 px-1.5 rounded-full flex items-center justify-center ${
                      section === item.id ? "bg-white/25 text-white" : "bg-lav-100 text-lav-700"
                    }`}
                  >
                    {newCount}
                  </span>
                )}
                {item.soon && (
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
                      section === item.id
                        ? "bg-white/20 text-white/90"
                        : "bg-gold-400/15 text-gold-500 border border-gold-400/25"
                    }`}
                  >
                    Σύντομα
                  </span>
                )}
              </span>
            </button>
          ))}
        </nav>

        <div className="border-t border-lav-100 pt-5 space-y-2">
          <Link
            href="/el/resources"
            target="_blank"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-lav-100 bg-lav-50/60 text-plum text-sm font-medium hover:bg-lav-50 hover:border-lav-200 transition-all"
          >
            <span className="w-8 h-8 rounded-lg bg-white border border-lav-100 flex items-center justify-center text-lav-600 text-xs flex-shrink-0">
              ↗
            </span>
            <span className="leading-tight">Προβολή «Η τάξη μας»</span>
          </Link>
          <Link
            href="/el"
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-lav-100 bg-white text-plum/70 text-sm font-medium hover:bg-ivory hover:text-plum hover:border-lav-200 transition-all"
          >
            <span className="w-8 h-8 rounded-lg bg-lav-50 border border-lav-100 flex items-center justify-center text-plum/50 text-xs flex-shrink-0">
              ←
            </span>
            <span className="leading-tight">Επιστροφή στο site</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-red-100 bg-red-50/50 text-red-600/90 text-sm font-medium hover:bg-red-50 hover:border-red-200 transition-all cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-white border border-red-100 flex items-center justify-center text-red-400 text-xs flex-shrink-0">
              ⎋
            </span>
            <span className="leading-tight">Αποσύνδεση</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        <AnimatePresence mode="wait">
          {section === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lav-600 via-lav-700 to-plum p-8 md:p-10 mb-8 shadow-medium">
                <div className="absolute top-0 right-0 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-gold-400/15 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                  <div>
                    <p className="text-[11px] font-bold text-white/50 uppercase tracking-[0.22em] mb-3">
                      Επισκόπηση
                    </p>
                    <h1 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] text-white leading-tight tracking-tight mb-2">
                      Καλώς ήρθες, Δήμητρα
                    </h1>
                    <p className="text-white/75 text-base md:text-lg font-light max-w-md">
                      Ο πίνακας διαχείρισης της Ακαδημίας σου — {todayLabel}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadData()}
                    className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/15 border border-white/25 text-white text-sm font-medium hover:bg-white/25 transition-colors cursor-pointer backdrop-blur-sm"
                  >
                    Ανανέωση ↻
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <Stat value={String(newCount)} label="Νέα αιτήματα" accent />
                <Stat value={String(contacts.length)} label="Σύνολο αιτημάτων" />
                <Stat value={String(resources.length)} label="Υλικό στην τάξη" />
              </div>

              <div className="bg-white rounded-2xl border border-lav-100 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-lav-100 flex items-center justify-between">
                  <h3 className="text-plum font-medium">Πρόσφατα αιτήματα</h3>
                  <button
                    type="button"
                    onClick={() => setSection("contacts")}
                    className="text-lav-600 text-xs hover:text-lav-700 cursor-pointer"
                  >
                    Όλα →
                  </button>
                </div>
                {contacts.length === 0 ? (
                  <p className="px-6 py-10 text-plum/35 text-sm text-center">Δεν υπάρχουν αιτήματα ακόμα.</p>
                ) : (
                  <>
                  {overviewContactsPaginated.items.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedContact(c)}
                      className={`w-full flex items-center justify-between px-6 py-4 hover:bg-lav-50/80 transition-colors text-left cursor-pointer ${
                        i < overviewContactsPaginated.items.length - 1 ? "border-b border-lav-50" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-9 h-9 rounded-full bg-lav-100 text-lav-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-plum font-medium text-sm truncate">{c.name}</p>
                          <p className="text-plum/40 text-xs truncate">{c.goal || c.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                          c.status === "new" ? "bg-lav-100 text-lav-700" : "bg-plum/5 text-plum/40"
                        }`}
                      >
                        {STATUS_LABELS[c.status]}
                      </span>
                    </button>
                  ))}
                  <AdminPagination
                    page={overviewContactsPaginated.page}
                    totalPages={overviewContactsPaginated.totalPages}
                    total={overviewContactsPaginated.total}
                    rangeStart={overviewContactsPaginated.rangeStart}
                    rangeEnd={overviewContactsPaginated.rangeEnd}
                    onPageChange={setOverviewContactsPage}
                  />
                  </>
                )}
              </div>
            </motion.div>
          )}

          {section === "resources" && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-display text-plum">Η τάξη μας</h1>
                  <p className="text-plum/45 text-sm mt-1">Διαχείριση υλικού που εμφανίζεται στη δημόσια σελίδα</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (showResourceForm && !editingResourceId) {
                      resetResourceForm();
                    } else {
                      resetResourceForm();
                      setShowResourceForm(true);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-lav-600 text-white text-sm font-medium hover:bg-lav-700 transition-colors cursor-pointer"
                >
                  + Νέο υλικό
                </button>
              </div>

              <AnimatePresence>
                {showResourceForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-2xl border border-lav-200 p-6 mb-6 shadow-soft overflow-hidden"
                  >
                    <h3 className="text-plum font-medium mb-4">
                      {editingResourceId ? "Επεξεργασία υλικού" : "Προσθήκη υλικού"}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="Τίτλος *"
                        value={newResource.title}
                        onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                        className={inputClass}
                      />
                      <select
                        value={newResource.type}
                        onChange={(e) =>
                          setNewResource({ ...newResource, type: e.target.value as ResourceType })
                        }
                        className={`${inputClass} cursor-pointer`}
                      >
                        {(Object.keys(TYPE_LABELS) as ResourceType[]).map((type) => (
                          <option key={type} value={type}>
                            {TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Περιγραφή *"
                        rows={3}
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                        className={`${inputClass} md:col-span-2 resize-none`}
                      />
                      <input
                        placeholder="Σύνδεσμος (προαιρετικό)"
                        value={newResource.url}
                        onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                        className={`${inputClass} md:col-span-2`}
                      />
                      <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-2">
                          Αρχείο (PDF ή εικόνα, προαιρετικό)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleResourceFileChange(e.target.files?.[0] ?? null)}
                          className="block w-full text-sm text-plum/60 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-lav-100 file:text-lav-700 file:font-medium file:cursor-pointer hover:file:bg-lav-200"
                        />
                        {resourceFile && (
                          <p className="text-xs text-plum/40 mt-2">
                            Επιλέχθηκε: {resourceFile.name} ({(resourceFile.size / 1024).toFixed(0)} KB)
                          </p>
                        )}
                        {resourceFilePreview && resourceFile?.type.startsWith("image/") && (
                          <div className="mt-3 relative w-full max-w-xs aspect-video rounded-xl overflow-hidden border border-lav-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={resourceFilePreview} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        {resourceFile?.type === "application/pdf" && (
                          <p className="text-xs text-lav-600 mt-2">Θα εμφανιστεί μικρογραφία PDF στην κάρτα.</p>
                        )}
                        {editingResourceId && (() => {
                          const editing = resources.find((r) => r.id === editingResourceId);
                          if (!editing?.fileUrl || removeExistingFile) return null;
                          return (
                            <div className="mt-3 p-3 rounded-xl bg-lav-50 border border-lav-100">
                              <p className="text-xs text-plum/50 mb-2">
                                Τρέχον αρχείο: {editing.fileUrl.split("/").pop()}
                              </p>
                              <label className="inline-flex items-center gap-2 text-xs text-red-500/80 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={removeExistingFile}
                                  onChange={(e) => setRemoveExistingFile(e.target.checked)}
                                  className="rounded border-lav-300"
                                />
                                Αφαίρεση τρέχοντος αρχείου
                              </label>
                              <p className="text-[11px] text-plum/35 mt-2">
                                Ανέβασε νέο αρχείο παρακάτω για αντικατάσταση.
                              </p>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={saveResource}
                        disabled={saving}
                        className="px-4 py-2 rounded-xl bg-lav-600 text-white text-sm cursor-pointer hover:bg-lav-700 disabled:opacity-50"
                      >
                        {saving
                          ? "Αποθήκευση…"
                          : editingResourceId
                            ? "Ενημέρωση"
                            : "Αποθήκευση"}
                      </button>
                      <button
                        type="button"
                        onClick={resetResourceForm}
                        className="px-4 py-2 rounded-xl border border-lav-200 text-plum/50 text-sm cursor-pointer hover:bg-lav-50"
                      >
                        Ακύρωση
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {resources.length > 0 && (
                <div className="bg-white rounded-2xl border border-lav-100 shadow-soft p-5 mb-6">
                  <p className="text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-3">
                    Φίλτρα κατηγορίας
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resourceFilterOptions.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        onClick={() => setResourceTypeFilter(filter)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          resourceTypeFilter === filter
                            ? "bg-lav-600 text-white shadow-soft"
                            : "bg-ivory border border-lav-200 text-plum/55 hover:border-lav-400 hover:text-plum"
                        }`}
                      >
                        {filter === "all" ? "Όλα" : TYPE_LABELS[filter]}
                        <span
                          className={`text-[11px] tabular-nums px-1.5 py-0.5 rounded-full ${
                            resourceTypeFilter === filter ? "bg-white/20" : "bg-lav-100 text-lav-700"
                          }`}
                        >
                          {resourceFilterCounts[filter]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {resources.length === 0 ? (
                <p className="text-plum/35 text-center py-16 bg-white rounded-2xl border border-dashed border-lav-200">
                  Δεν υπάρχει υλικό. Πρόσθεσε το πρώτο post.
                </p>
              ) : filteredResources.length === 0 ? (
                <p className="text-plum/35 text-center py-16 bg-white rounded-2xl border border-dashed border-lav-200">
                  Δεν υπάρχει υλικό σε αυτή την κατηγορία.
                </p>
              ) : (
                <div className="bg-white rounded-2xl border border-lav-100 shadow-soft overflow-hidden">
                <div className="space-y-3 p-3">
                  {resourcesPaginated.items.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-start justify-between gap-4 p-5 rounded-2xl bg-white border border-lav-100 shadow-soft hover:border-lav-200 transition-all"
                    >
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-lav-100 text-lav-700 flex items-center justify-center text-[10px] font-bold uppercase flex-shrink-0">
                          {r.type.slice(0, 3)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-plum font-medium">{r.title}</p>
                          <p className="text-plum/45 text-sm mt-1 line-clamp-2">{r.description}</p>
                          <p className="text-plum/30 text-xs mt-2">
                            {TYPE_LABELS[r.type]} · {r.date}
                            {r.fileUrl ? ` · 📎 ${r.fileUrl.split("/").pop()}` : ""}
                            {r.url ? ` · 🔗 ${r.url}` : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditResource(r)}
                          className="text-lav-600 hover:text-lav-800 text-sm px-3 py-1.5 rounded-lg border border-lav-200 hover:bg-lav-50 cursor-pointer"
                        >
                          Επεξεργασία
                        </button>
                        <button
                          type="button"
                          onClick={() => removeResource(r.id)}
                          className="text-red-400/70 hover:text-red-500 text-sm px-3 py-1.5 rounded-lg border border-red-100 hover:bg-red-50 cursor-pointer"
                        >
                          Διαγραφή
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <AdminPagination
                  page={resourcesPaginated.page}
                  totalPages={resourcesPaginated.totalPages}
                  total={resourcesPaginated.total}
                  rangeStart={resourcesPaginated.rangeStart}
                  rangeEnd={resourcesPaginated.rangeEnd}
                  onPageChange={setResourcesPage}
                />
                </div>
              )}
            </motion.div>
          )}

          {section === "contacts" && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-2xl font-display text-plum mb-2">Αιτήματα επικοινωνίας</h1>
              <p className="text-plum/45 text-sm mb-8">Όλες οι υποβολές από τη φόρμα επικοινωνίας</p>

              {contacts.length === 0 ? (
                <p className="text-plum/35 text-center py-16 bg-white rounded-2xl border border-dashed border-lav-200">
                  Δεν υπάρχουν αιτήματα ακόμα.
                </p>
              ) : (
                <div className="bg-white rounded-2xl border border-lav-100 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px]">
                    <thead>
                      <tr className="border-b border-lav-100">
                        {["Σπουδαστής", "Επίπεδο", "Στόχος", "Ημερομηνία", "Κατάσταση"].map((h) => (
                          <th
                            key={h}
                            className="text-left px-5 py-4 text-[10px] font-bold text-plum/35 uppercase tracking-widest"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {contactsPaginated.items.map((c, i) => (
                        <tr
                          key={c.id}
                          onClick={() => setSelectedContact(c)}
                          className={`hover:bg-lav-50/60 cursor-pointer ${i < contactsPaginated.items.length - 1 ? "border-b border-lav-50" : ""}`}
                        >
                          <td className="px-5 py-4">
                            <div className="text-plum font-medium text-sm">{c.name}</div>
                            <div className="text-plum/40 text-xs">{c.email}</div>
                            {c.phone && <div className="text-plum/30 text-xs">{c.phone}</div>}
                            {c.message && (
                              <p className="text-plum/45 text-xs mt-2 max-w-xs line-clamp-2">{c.message}</p>
                            )}
                          </td>
                          <td className="px-5 py-4 text-plum/55 text-sm">{c.level || "—"}</td>
                          <td className="px-5 py-4 text-plum/55 text-sm">{c.goal || "—"}</td>
                          <td className="px-5 py-4 text-plum/35 text-xs whitespace-nowrap">
                            {new Date(c.createdAt).toLocaleDateString("el-GR")}
                          </td>
                          <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={c.status}
                              onChange={(e) => updateStatus(c.id, e.target.value as ContactStatus)}
                              className="text-xs rounded-lg border border-lav-200 px-2 py-1.5 bg-ivory/50 text-plum cursor-pointer focus:outline-none focus:ring-2 focus:ring-lav-400/40"
                            >
                              {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => (
                                <option key={s} value={s}>
                                  {STATUS_LABELS[s]}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <AdminPagination
                  page={contactsPaginated.page}
                  totalPages={contactsPaginated.totalPages}
                  total={contactsPaginated.total}
                  rangeStart={contactsPaginated.rangeStart}
                  rangeEnd={contactsPaginated.rangeEnd}
                  onPageChange={setContactsPage}
                />
                </div>
              )}
            </motion.div>
          )}

          {section === "workshops" && (
            <motion.div
              key="workshops"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <WorkshopsAdmin />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedContact && (
          <ContactDetailModal
            contact={selectedContact}
            onClose={() => setSelectedContact(null)}
            onStatusChange={updateStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
