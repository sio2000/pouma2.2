export const PRELOADER_STORAGE_KEY = "pouma-preloader-seen";

export function hasSeenPreloader(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(PRELOADER_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markPreloaderSeen(): void {
  try {
    localStorage.setItem(PRELOADER_STORAGE_KEY, "1");
  } catch {
    /* ignore storage failures */
  }
}

export function setPreloaderReady(): void {
  document.documentElement.classList.remove("preloader-pending");
  document.documentElement.classList.add("preloader-ready");
  document.body.style.overflow = "";
}

export function setPreloaderPending(): void {
  document.documentElement.classList.add("preloader-pending");
  document.documentElement.classList.remove("preloader-ready");
  document.body.style.overflow = "hidden";
}
