/**
 * Workshop scheduling helpers — timezone-correct status + countdown maths.
 *
 * Workshops are entered as a local date + time in Europe/Athens. We resolve
 * that wall-clock time to an absolute instant using the Intl API (DST-aware,
 * zero dependencies) so the lifecycle (upcoming → live → completed) is computed
 * consistently regardless of where the server runs (Netlify = UTC).
 */

import type { Workshop, WorkshopStatus, WorkshopView } from "@/lib/workshops/types";

export const WORKSHOP_TIMEZONE = "Europe/Athens";
export const DEFAULT_DURATION_MINUTES = 120;

/**
 * Convert a wall-clock date/time in `timeZone` to the matching UTC instant.
 * Works across DST boundaries by measuring the zone's offset at that instant.
 */
export function zonedDateTimeToInstant(
  date: string,
  time: string,
  timeZone: string = WORKSHOP_TIMEZONE
): Date {
  const [year, month, day] = date.split("-").map((n) => parseInt(n, 10));
  const [hour, minute] = time.split(":").map((n) => parseInt(n, 10));

  if (
    [year, month, day, hour, minute].some((n) => Number.isNaN(n))
  ) {
    return new Date(NaN);
  }

  // First guess: treat the wall-clock numbers as if they were UTC.
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);

  // Read back what that instant looks like in the target timezone…
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = formatter.formatToParts(new Date(utcGuess));
  const lookup: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== "literal") lookup[part.type] = parseInt(part.value, 10);
  }

  const asZoned = Date.UTC(
    lookup.year,
    lookup.month - 1,
    lookup.day,
    lookup.hour,
    lookup.minute,
    lookup.second
  );

  // …the difference is the zone offset, which we subtract to land on the
  // instant whose Athens wall-clock equals the entered values.
  const offset = asZoned - utcGuess;
  return new Date(utcGuess - offset);
}

export function getWorkshopStart(workshop: Workshop): Date {
  return zonedDateTimeToInstant(workshop.date, workshop.time);
}

export function getWorkshopEnd(workshop: Workshop): Date {
  const start = getWorkshopStart(workshop);
  const duration =
    workshop.durationMinutes && workshop.durationMinutes > 0
      ? workshop.durationMinutes
      : DEFAULT_DURATION_MINUTES;
  return new Date(start.getTime() + duration * 60_000);
}

export function getWorkshopStatus(
  workshop: Workshop,
  now: Date = new Date()
): WorkshopStatus {
  const start = getWorkshopStart(workshop).getTime();
  const end = getWorkshopEnd(workshop).getTime();
  const current = now.getTime();

  if (Number.isNaN(start)) return "upcoming";
  if (current < start) return "upcoming";
  if (current <= end) return "live";
  return "completed";
}

/** Enrich a stored workshop with computed scheduling fields for the client. */
export function toWorkshopView(
  workshop: Workshop,
  now: Date = new Date()
): WorkshopView {
  return {
    ...workshop,
    status: getWorkshopStatus(workshop, now),
    startsAt: getWorkshopStart(workshop).toISOString(),
    endsAt: getWorkshopEnd(workshop).toISOString(),
  };
}

export function isUpcoming(workshop: Workshop, now: Date = new Date()): boolean {
  return getWorkshopStatus(workshop, now) === "upcoming";
}

export function isCompleted(workshop: Workshop, now: Date = new Date()): boolean {
  return getWorkshopStatus(workshop, now) === "completed";
}

/** Sort comparator: soonest upcoming first. */
export function byStartAsc(a: Workshop, b: Workshop): number {
  return getWorkshopStart(a).getTime() - getWorkshopStart(b).getTime();
}

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  done: boolean;
}

/** Break a remaining-time delta into days/hours/minutes/seconds. */
export function getCountdownParts(targetMs: number, fromMs: number = Date.now()): CountdownParts {
  const totalMs = Math.max(0, targetMs - fromMs);
  const totalSeconds = Math.floor(totalMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    totalMs,
    done: totalMs <= 0,
  };
}

/** Locale-aware human date, e.g. "Τετάρτη 1 Ιουλίου 2026". */
export function formatWorkshopDate(workshop: Workshop, locale: string): string {
  const start = getWorkshopStart(workshop);
  if (Number.isNaN(start.getTime())) return workshop.date;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "el-GR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: WORKSHOP_TIMEZONE,
  }).format(start);
}

/** "18:00" rendered consistently in Athens time. */
export function formatWorkshopTime(workshop: Workshop, locale: string): string {
  const start = getWorkshopStart(workshop);
  if (Number.isNaN(start.getTime())) return workshop.time;
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "el-GR", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: WORKSHOP_TIMEZONE,
  }).format(start);
}
