let _redis = null;
let _memoryCache = null; // In-memory fallback

async function getRedis() {
  if (_redis) return _redis;
  if (!process.env.UPSTASH_REDIS_REST_URL) return null;
  const { Redis } = await import("@upstash/redis");
  _redis = new Redis({
    url:   process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  return _redis;
}

const KEY       = "yachtdrop:products:v1";
const TTL_FRESH = 60 * 60;
const TTL_STALE = 60 * 60 * 6;

export async function getCached() {
  try {
    const r = await getRedis();
    if (!r) {
      // Use in-memory cache if Redis unavailable
      return _memoryCache;
    }
    const raw = await r.get(KEY);
    if (!raw) return _memoryCache;
    return typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch { return _memoryCache; }
}

export async function setCache(products) {
  try {
    // Always set in-memory cache
    _memoryCache = { products, cachedAt: Date.now() };
    
    const r = await getRedis();
    if (!r) return;
    await r.set(KEY, JSON.stringify({ products, cachedAt: Date.now() }), { ex: TTL_STALE });
  } catch (e) { console.error("[cache] set failed:", e.message); }
}

export function isFresh(cachedAt) {
  return Date.now() - (cachedAt || 0) < TTL_FRESH * 1000;
}