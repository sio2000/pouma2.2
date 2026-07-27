/**
 * Shared localStorage keys + helpers for the workshop popup lifecycle.
 * Used by both the popup (to decide whether to show) and the registration
 * form (to suppress the popup after a successful signup).
 */

export const DISMISS_UNTIL_KEY = "pouma_ws_popup_dismissed_until";
export const REGISTERED_FLAG = "pouma_ws_registered";
export const SHOW_DELAY_MS = 10_000;
export const DISMISS_HOURS = 24;

export function registeredFlagFor(workshopId: string): string {
  return `pouma_ws_registered_${workshopId}`;
}

/** Whether the popup should currently be suppressed for this workshop. */
export function isPopupSuppressed(workshopId?: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    if (localStorage.getItem(REGISTERED_FLAG) === "1") return true;
    if (workshopId && localStorage.getItem(registeredFlagFor(workshopId)) === "1") {
      return true;
    }
    const until = Number(localStorage.getItem(DISMISS_UNTIL_KEY) || 0);
    if (until && Date.now() < until) return true;
  } catch {
    return true;
  }
  return false;
}

/** Hide the popup for the next DISMISS_HOURS hours. */
export function dismissPopup(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      DISMISS_UNTIL_KEY,
      String(Date.now() + DISMISS_HOURS * 60 * 60 * 1000)
    );
  } catch {
    // ignore
  }
}
