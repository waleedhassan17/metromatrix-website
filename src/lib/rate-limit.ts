/**
 * Best-effort, in-memory sliding-window rate limiter.
 *
 * Each serverless instance keeps its own memory, so limits are per instance
 * and reset on cold starts. That is enough to blunt casual abuse of a contact
 * form. For strict, global limits swap this for Upstash Redis
 * (@upstash/ratelimit); see README.
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  /** Seconds until the oldest hit leaves the window (0 when allowed). */
  retryAfter: number;
}

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
  reset(): void;
}

export function createRateLimiter({
  limit,
  windowMs,
  maxKeys = 5_000,
}: {
  limit: number;
  windowMs: number;
  maxKeys?: number;
}): RateLimiter {
  const hits = new Map<string, number[]>();

  const prune = (now: number) => {
    for (const [key, times] of hits) {
      const fresh = times.filter((t) => now - t < windowMs);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  };

  return {
    check(key, now = Date.now()) {
      if (hits.size > maxKeys) prune(now);
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        const oldest = recent[0] ?? now;
        return {
          allowed: false,
          remaining: 0,
          retryAfter: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)),
        };
      }
      recent.push(now);
      hits.set(key, recent);
      return { allowed: true, remaining: limit - recent.length, retryAfter: 0 };
    },
    reset() {
      hits.clear();
    },
  };
}

/** Extracts the client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || "unknown";
}
