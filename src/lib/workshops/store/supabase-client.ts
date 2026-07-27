/**
 * Server-only Supabase admin client (service role).
 *
 * The service-role key bypasses RLS, so this MUST never be imported into client
 * components. When the env vars are absent, `getSupabaseAdmin()` returns null
 * and the system transparently falls back to the Blobs store.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

function readEnv() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return { url, serviceKey };
}

/** True when both the Supabase URL and service-role key are present. */
export function isSupabaseConfigured(): boolean {
  const { url, serviceKey } = readEnv();
  return Boolean(url && serviceKey);
}

/** Lazily-created singleton admin client, or null when not configured. */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const { url, serviceKey } = readEnv();
  if (!url || !serviceKey) {
    cached = null;
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { "x-application-name": "pouma-workshops" } },
  });
  return cached;
}
