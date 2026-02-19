import { NextResponse } from "next/server";
import { scrapeAllProducts } from "@/lib/scraper";
import { getCached, setCache, isFresh } from "@/lib/cache";
import fallback from "@/data/products-fallback.json";

let revalidating = false;
async function revalidateInBackground() {
  if (revalidating) return;
  revalidating = true;
  try {
    const fresh = await Promise.race([
      scrapeAllProducts(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Scrape timeout")), 15000))
    ]);
    if (fresh && fresh.length > 0) await setCache(fresh);
  } catch (e) {
    console.error("[revalidate]", e.message);
  } finally {
    revalidating = false;
  }
}

function filter(products, { category, q }) {
  let r = products;
  if (category && category !== "All")
    r = r.filter((p) => p.category === category);
  if (q?.trim()) {
    const qq = q.trim().toLowerCase();
    r = r.filter(
      (p) =>
        p.name?.toLowerCase().includes(qq) ||
        p.shortDescription?.toLowerCase().includes(qq) ||
        p.brand?.toLowerCase().includes(qq)
    );
  }
  return r;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page     = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit    = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const category = searchParams.get("category") || "All";
    const q        = searchParams.get("q") || "";

    let all = [], source = "fallback";

    try {
      const cached = await getCached();
      if (cached?.products?.length) {
        all = cached.products;
        source = isFresh(cached.cachedAt) ? "cache" : "cache-stale";
        if (source === "cache-stale") revalidateInBackground();
      }
    } catch (cacheErr) {
      console.error("[cache] read failed:", cacheErr.message);
    }

    // Always have fallback ready
    if (!all || all.length === 0) {
      all = fallback || [];
      source = "fallback";
      if (source === "fallback") revalidateInBackground();
    }

    const filtered = filter(all, { category, q });
    const start    = (page - 1) * limit;
    const products = filtered.slice(start, start + limit);

    return NextResponse.json(
      { 
        products, 
        total: filtered.length, 
        page, 
        hasMore: start + limit < filtered.length, 
        source,
        timestamp: new Date().toISOString()
      },
      { 
        headers: { 
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600",
          "Content-Type": "application/json"
        } 
      }
    );
  } catch (e) {
    console.error("[GET /api/products]", e);
    return NextResponse.json(
      { 
        error: "Failed to fetch products",
        products: fallback?.slice(0, 12) || [],
        total: 0,
        page: 1,
        hasMore: false,
        source: "fallback-error"
      },
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}