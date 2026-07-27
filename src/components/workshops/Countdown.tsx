"use client";

import { useEffect, useRef, useState } from "react";
import { getCountdownParts, type CountdownParts } from "@/lib/workshops/status";

interface CountdownProps {
  /** Absolute target time in epoch milliseconds. */
  targetMs: number;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  variant?: "light" | "dark" | "compact";
  className?: string;
  /** Override the number weight/colour (defaults to "font-light"). */
  numbersClassName?: string;
  onComplete?: () => void;
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function Countdown({
  targetMs,
  labels,
  variant = "light",
  className = "",
  numbersClassName = "font-light",
  onComplete,
}: CountdownProps) {
  // Start null so SSR and first client render agree (avoids hydration drift);
  // the live value is computed right after mount.
  const [parts, setParts] = useState<CountdownParts | null>(null);
  const completeRef = useRef(onComplete);
  const firedRef = useRef(false);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    firedRef.current = false;
    const tick = () => {
      const next = getCountdownParts(targetMs);
      setParts(next);
      if (next.done && !firedRef.current) {
        firedRef.current = true;
        completeRef.current?.();
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const cells = [
    { value: parts ? parts.days : 0, label: labels.days, pad: false },
    { value: parts ? parts.hours : 0, label: labels.hours, pad: true },
    { value: parts ? parts.minutes : 0, label: labels.minutes, pad: true },
    { value: parts ? parts.seconds : 0, label: labels.seconds, pad: true },
  ];

  const isDark = variant === "dark";
  const isCompact = variant === "compact";

  const cellBase = isDark
    ? "bg-white/10 border-white/15 text-white"
    : "bg-white border-lav-100 text-plum shadow-soft";
  const labelColor = isDark ? "text-white/55" : "text-plum/45";
  const sizeNum = isCompact
    ? "text-xl sm:text-2xl"
    : "text-3xl sm:text-4xl md:text-5xl";
  const sizePad = isCompact ? "px-2.5 py-2" : "px-3 py-3 sm:px-5 sm:py-4";
  const gap = isCompact ? "gap-2" : "gap-2.5 sm:gap-4";

  return (
    <div
      className={`flex ${gap} ${className}`}
      role="timer"
      aria-live="off"
      suppressHydrationWarning
    >
      {cells.map((cell, i) => (
        <div
          key={i}
          className={`flex flex-col items-center justify-center rounded-2xl border ${cellBase} ${sizePad} min-w-[3.25rem] sm:min-w-[4.5rem] tabular-nums`}
        >
          <span
            className={`font-display leading-none ${sizeNum} ${numbersClassName}`}
            suppressHydrationWarning
          >
            {cell.pad ? pad(cell.value) : cell.value}
          </span>
          <span
            className={`mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] ${labelColor}`}
          >
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}
