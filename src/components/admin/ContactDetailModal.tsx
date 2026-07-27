"use client";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { ContactRequest, ContactStatus } from "@/lib/db/types";

const STATUS_LABELS: Record<ContactStatus, string> = {
  new: "Νέο",
  replied: "Απαντήθηκε",
  archived: "Αρχειοθετημένο",
};

type Props = {
  contact: ContactRequest;
  onClose: () => void;
  onStatusChange: (id: string, status: ContactStatus) => void;
};

export default function ContactDetailModal({ contact, onClose, onStatusChange }: Props) {
  const created = new Date(contact.createdAt).toLocaleString("el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-plum/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-lav-100 overflow-hidden"
      >
        <div className="bg-gradient-to-br from-lav-600 to-plum px-6 py-5 text-white">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
                {contact.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h2 id="contact-modal-title" className="font-display text-xl truncate">
                  {contact.name}
                </h2>
                <p className="text-white/65 text-sm mt-0.5">{created}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Κλείσιμο"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[min(70vh,520px)] overflow-y-auto">
          <DetailRow label="Email">
            <a href={`mailto:${contact.email}`} className="text-lav-600 hover:underline break-all">
              {contact.email}
            </a>
          </DetailRow>
          {contact.phone && (
            <DetailRow label="Τηλέφωνο">
              <a href={`tel:${contact.phone}`} className="text-lav-600 hover:underline">
                {contact.phone}
              </a>
            </DetailRow>
          )}
          <DetailRow label="Επίπεδο">{contact.level || "—"}</DetailRow>
          <DetailRow label="Στόχος">{contact.goal || "—"}</DetailRow>
          {contact.message && (
            <DetailRow label="Μήνυμα">
              <p className="text-plum/70 text-sm leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </DetailRow>
          )}
          <div>
            <span className="block text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-2">
              Κατάσταση
            </span>
            <select
              value={contact.status}
              onChange={(e) => onStatusChange(contact.id, e.target.value as ContactStatus)}
              className="w-full text-sm rounded-xl border border-lav-200 px-4 py-2.5 bg-ivory/50 text-plum cursor-pointer focus:outline-none focus:ring-2 focus:ring-lav-400/40"
            >
              {(Object.keys(STATUS_LABELS) as ContactStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-lav-100 flex gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 text-center px-4 py-2.5 rounded-xl bg-lav-600 text-white text-sm font-medium hover:bg-lav-700 transition-colors"
          >
            Απάντηση με email
          </a>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-lav-200 text-plum/55 text-sm hover:bg-lav-50 transition-colors cursor-pointer"
          >
            Κλείσιμο
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <span className="block text-[10px] font-bold text-plum/35 uppercase tracking-widest mb-1.5">
        {label}
      </span>
      <div className="text-plum text-sm font-medium">{children}</div>
    </div>
  );
}
