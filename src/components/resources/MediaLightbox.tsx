"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  kind: "image" | "pdf";
  title?: string;
};

export default function MediaLightbox({ open, onClose, src, kind, title }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Προβολή αρχείου"}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-10 min-w-11 min-h-11 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/25 text-white text-lg flex items-center justify-center transition-colors cursor-pointer touch-manipulation"
            aria-label="Κλείσιμο"
          >
            ✕
          </button>

          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-6xl max-h-[92vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {kind === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={title ?? ""}
                className="max-w-full max-h-[92vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
              />
            ) : (
              <iframe
                src={src}
                title={title ?? "PDF"}
                className="w-full h-[min(92vh,900px)] rounded-lg bg-white shadow-2xl"
              />
            )}
          </motion.div>

          <p className="absolute bottom-4 left-0 right-0 text-center text-white/40 text-xs pointer-events-none">
            Κλικ έξω ή Esc για κλείσιμο
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
