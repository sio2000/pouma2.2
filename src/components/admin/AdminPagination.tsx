"use client";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
};

export default function AdminPagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  onPageChange,
}: Props) {
  if (total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-t border-lav-100 bg-lav-50/30">
      <p className="text-xs text-plum/45">
        {rangeStart}–{rangeEnd} από {total}
        {totalPages > 1 && (
          <span className="text-plum/30">
            {" "}
            · Σελίδα {page}/{totalPages}
          </span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 rounded-xl border border-lav-200 bg-white text-plum text-sm font-medium hover:bg-lav-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          ← Προηγούμενη
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 rounded-xl border border-lav-200 bg-white text-plum text-sm font-medium hover:bg-lav-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          Επόμενη →
        </button>
      </div>
    </div>
  );
}
