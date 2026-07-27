/**
 * Lightweight in-memory rate limiter (fixed window).
 *
 * Suitable for the single-instance Netlify function model this project uses —
 * no external store required. State is per-process, so it resets on cold start;
 * combined with the DB unique-email constraint it is plenty to stop abusive
 * submission loops without adding infrastructure.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Opportunistically drop expired buckets so the map can't grow unbounded.
function sweep(now: number) {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * @param key      Identifier to throttle on (e.g. `register:<ip>`).
 * @param limit    Max requests allowed per window.
 * @param windowMs Window length in milliseconds.
 */
export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client IP from common proxy headers (Netlify/Vercel/standard). */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for") ||
    headers.get("x-real-ip");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
