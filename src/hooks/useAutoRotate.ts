"use client";
import { useEffect, useState, useCallback } from "react";

type UseAutoRotateOptions = {
  length: number;
  intervalMs?: number;
  enabled?: boolean;
};

export function useAutoRotate({
  length,
  intervalMs = 6000,
  enabled = true,
}: UseAutoRotateOptions) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const pause = useCallback(() => setPaused(true), []);
  const resume = useCallback(() => setPaused(false), []);

  /** Manual navigation — pauses auto-advance until hover ends */
  const goTo = useCallback(
    (index: number | ((prev: number) => number)) => {
      setActive((prev) => {
        const next = typeof index === "function" ? index(prev) : index;
        return ((next % length) + length) % length;
      });
      setPaused(true);
    },
    [length]
  );

  useEffect(() => {
    if (!enabled || paused || length <= 1) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setActive((prev) => (prev + 1) % length);
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [enabled, paused, length, intervalMs]);

  return { active, setActive: goTo, pause, resume, paused };
}
