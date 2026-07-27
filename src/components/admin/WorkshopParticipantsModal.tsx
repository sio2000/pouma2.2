"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import AdminPagination from "@/components/admin/AdminPagination";
import { apiFetch, parseJsonResponse } from "@/lib/api-client";
import { paginate } from "@/lib/pagination";
import {
  buildEmailsCsv,
  buildEmailsList,
  buildParticipantsCsv,
  exportFilename,
} from "@/lib/workshops/csv";
import type { WorkshopRegistration, WorkshopView } from "@/lib/workshops/types";

interface Props {
  workshop: Pick<WorkshopView, "id" | "title" | "slug" | "status">;
  onClose: () => void;
}

function downloadFile(filename: string, content: string) {
  // Prepend a UTF-8 BOM so Excel opens Greek characters correctly.
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function WorkshopParticipantsModal({ workshop, onClose }: Props) {
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(`/api/workshops/${workshop.id}/registrations`);
      if (!res.ok) throw new Error("load failed");
      const data = await parseJsonResponse<{ registrations: WorkshopRegistration[] }>(res);
      setRegistrations(Array.isArray(data.registrations) ? data.registrations : []);
    } catch {
      setError("Αποτυχία φόρτωσης συμμετοχών.");
    } finally {
      setLoading(false);
    }
  }, [workshop.id]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter((r) =>
      `${r.firstName} ${r.lastName} ${r.email} ${r.phone}`.toLowerCase().includes(q)
    );
  }, [registrations, query]);

  const paged = paginate(filtered, page);

  const handleExportEmails = () => {
    if (registrations.length === 0) return;
    downloadFile(exportFilename(workshop.slug, "emails.csv"), buildEmailsCsv(registrations));
  };

  const handleExportAll = () => {
    if (registrations.length === 0) return;
    downloadFile(
      exportFilename(workshop.slug, "participants.csv"),
      buildParticipantsCsv(registrations)
    );
  };

  const handleCopyEmails = async () => {
    if (registrations.length === 0) return;
    try {
      await navigator.clipboard.writeText(buildEmailsList(registrations));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Δεν ήταν δυνατή η αντιγραφή.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[130] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Κλείσιμο"
        onClick={onClose}
        className="absolute inset-0 bg-plum/40 backdrop-blur-sm cursor-default"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 20 }}
        className="relative w-full max-w-3xl bg-ivory rounded-3xl shadow-strong border border-lav-100 max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-lav-100 bg-white">
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-lav-600 uppercase tracking-[0.2em]">
              Συμμετοχές
            </p>
            <h3 className="font-display text-xl text-plum truncate">{workshop.title}</h3>
            <p className="text-plum/40 text-xs mt-0.5">
              {registrations.length} {registrations.length === 1 ? "συμμετοχή" : "συμμετοχές"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="flex-shrink-0 w-9 h-9 rounded-full border border-lav-100 bg-white text-plum/60 hover:text-plum hover:bg-lav-50 flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 sm:p-6 flex flex-col gap-4 overflow-hidden">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <input
              type="search"
              placeholder="Αναζήτηση ονόματος, email ή τηλεφώνου…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-lav-200 bg-white text-plum text-sm focus:outline-none focus:ring-2 focus:ring-lav-400/40 placeholder:text-plum/30"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportEmails}
                disabled={registrations.length === 0}
                className="px-3.5 py-2.5 rounded-xl bg-lav-600 text-white text-xs font-medium hover:bg-lav-700 disabled:opacity-40 cursor-pointer transition-colors"
              >
                ⬇ Export emails
              </button>
              <button
                type="button"
                onClick={handleCopyEmails}
                disabled={registrations.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-lav-200 bg-white text-plum text-xs font-medium hover:bg-lav-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                {copied ? "✓ Αντιγράφηκαν" : "⧉ Copy emails"}
              </button>
              <button
                type="button"
                onClick={handleExportAll}
                disabled={registrations.length === 0}
                className="px-3.5 py-2.5 rounded-xl border border-lav-200 bg-white text-plum/70 text-xs font-medium hover:bg-lav-50 disabled:opacity-40 cursor-pointer transition-colors"
              >
                ⬇ Export όλων (CSV)
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="bg-white rounded-2xl border border-lav-100 shadow-soft overflow-hidden flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-plum/40 text-sm text-center py-14">Φόρτωση…</p>
            ) : filtered.length === 0 ? (
              <p className="text-plum/35 text-sm text-center py-14">
                {registrations.length === 0
                  ? "Δεν υπάρχουν συμμετοχές ακόμα."
                  : "Καμία συμμετοχή δεν ταιριάζει στην αναζήτηση."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-lav-100">
                      {["Όνομα", "Επώνυμο", "Email", "Τηλέφωνο", "Ημ/νία"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-3 text-[10px] font-bold text-plum/35 uppercase tracking-widest"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paged.items.map((r, i) => (
                      <tr
                        key={r.id}
                        className={i < paged.items.length - 1 ? "border-b border-lav-50" : ""}
                      >
                        <td className="px-4 py-3 text-plum text-sm">{r.firstName}</td>
                        <td className="px-4 py-3 text-plum text-sm">{r.lastName}</td>
                        <td className="px-4 py-3 text-plum/70 text-sm break-all">{r.email}</td>
                        <td className="px-4 py-3 text-plum/70 text-sm whitespace-nowrap">{r.phone}</td>
                        <td className="px-4 py-3 text-plum/40 text-xs whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString("el-GR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {!loading && filtered.length > 0 && (
              <AdminPagination
                page={paged.page}
                totalPages={paged.totalPages}
                total={paged.total}
                rangeStart={paged.rangeStart}
                rangeEnd={paged.rangeEnd}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
