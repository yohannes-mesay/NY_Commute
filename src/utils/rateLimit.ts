// Simple client-side sliding-window rate limiter using localStorage
// Not security-grade; just prevents accidental rapid submissions client-side

type RateCheck = {
  ok: boolean;
  remaining: number;
  resetMs: number; // milliseconds until the window fully resets
};

const STORAGE_PREFIX = "rate_limit:";

function now(): number {
  return Date.now();
}

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateCheck {
  try {
    const storageKey = getKey(key);
    const raw = localStorage.getItem(storageKey);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = now() - windowMs;
    const recent = timestamps.filter((ts) => ts > cutoff);
    const remaining = Math.max(0, limit - recent.length);
    const oldest = recent.length > 0 ? recent[0] : 0;
    const resetMs =
      recent.length === 0 ? 0 : Math.max(0, windowMs - (now() - oldest));
    return { ok: remaining > 0, remaining, resetMs };
  } catch {
    // If storage is unavailable, do not block
    return { ok: true, remaining: limit, resetMs: 0 };
  }
}

export function recordRateEvent(key: string, windowMs: number): void {
  try {
    const storageKey = getKey(key);
    const raw = localStorage.getItem(storageKey);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = now() - windowMs;
    const recent = timestamps.filter((ts) => ts > cutoff);
    recent.push(now());
    // Keep array bounded to avoid unbounded growth
    const MAX_KEEP = 500;
    const trimmed = recent.slice(-MAX_KEEP);
    localStorage.setItem(storageKey, JSON.stringify(trimmed));
  } catch {
    // ignore storage errors
  }
}

export function checkAndRecord(
  key: string,
  limit: number,
  windowMs: number
): RateCheck {
  const result = checkRateLimit(key, limit, windowMs);
  if (result.ok) {
    recordRateEvent(key, windowMs);
  }
  return result;
}
