import { timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { siteConfig } from "@/lib/seo";

export const ADMIN_COOKIE = "pouma_admin";

function sessionToken() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    return "";
  }
  return secret ?? "pouma-admin-authenticated-v1";
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL ?? siteConfig.email).trim().toLowerCase();
}

export function validateAdminCredentials(email: string, password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const expectedEmail = getAdminEmail();

  if (!expectedPassword) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[admin-auth] Login blocked: ADMIN_PASSWORD is not set in this environment. " +
          "Add ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Netlify → Site configuration → Environment variables, then redeploy."
      );
      return false;
    }
    return (
      email.trim().toLowerCase() === expectedEmail &&
      password === "dev-only-change-me"
    );
  }

  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SESSION_SECRET) {
    console.error(
      "[admin-auth] Login blocked: ADMIN_SESSION_SECRET is not set in this environment. " +
        "Add it in Netlify → Site configuration → Environment variables, then redeploy."
    );
    return false;
  }

  return (
    safeEqual(email.trim().toLowerCase(), expectedEmail) &&
    safeEqual(password, expectedPassword)
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const token = sessionToken();
  if (!token) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === token;
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function getAdminSessionValue() {
  return sessionToken();
}
