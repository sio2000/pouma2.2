"use client";

type Props = {
  page: number;
  totalPages: number;
  total: number;
  rangeStart: number;
  rangeEnd: number;
  onPageChange: (page: number) => void;
  prevLabel: string;
  nextLabel: string;
  rangeLabel: string;
  pageLabel?: string;
  className?: string;
};

export default function ListPagination({
  page,
  totalPages,
  total,
  rangeStart,
  rangeEnd,
  onPageChange,
  prevLabel,
  nextLabel,
  rangeLabel,
  pageLabel,
  className = "",
}: Props) {
  if (total === 0) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}
    >
      <p className="text-sm text-plum/45 font-light">
        {rangeLabel}
        {pageLabel && totalPages > 1 && (
          <span className="text-plum/30"> · {pageLabel}</span>
        )}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2.5 rounded-full border border-lav-200/80 bg-white/80 text-plum text-sm font-medium hover:bg-white hover:border-lav-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-soft"
        >
          {prevLabel}
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2.5 rounded-full border border-lav-200/80 bg-white/80 text-plum text-sm font-medium hover:bg-white hover:border-lav-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all shadow-soft"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
