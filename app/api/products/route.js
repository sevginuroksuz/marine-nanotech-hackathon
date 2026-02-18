import { NextResponse } from "next/server";
import { scrapeAllProducts } from "@/lib/scraper";
import { getCached, setCache, isFresh } from "@/lib/cache";
import fallback from "@/data/products-fallback.json";

let revalidating = false;
async function revalidateInBackground() {
  if (revalidating) return;
  revalidating = true;
  try {
    const fresh = await scrapeAllProducts();
    if (fresh.length > 0) await setCache(fresh);
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
  const { searchParams } = new URL(req.url);
  const page     = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit    = Math.min(50, parseInt(searchParams.get("limit") || "20"));
  const category = searchParams.get("category") || "All";
  const q        = searchParams.get("q") || "";

  let all = [], source = "fallback";

  const cached = await getCached();
  if (cached?.products?.length) {
    all = cached.products;
    source = isFresh(cached.cachedAt) ? "cache" : "cache-stale";
    if (source === "cache-stale") revalidateInBackground();
  } else {
    // Use fallback immediately, scrape in background
    all = fallback;
    source = "fallback";
    revalidateInBackground();
  }

  const filtered = filter(all, { category, q });
  const start    = (page - 1) * limit;
  const products = filtered.slice(start, start + limit);

  return NextResponse.json(
    { products, total: filtered.length, page, hasMore: start + limit < filtered.length, source },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=3600" } }
  );
}