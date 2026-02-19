import { NextResponse } from "next/server";
import { getCached } from "@/lib/cache";
import fallback from "@/data/products-fallback.json";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    // Try cache first, then fallback
    let all = [];
    try {
      const cached = await getCached();
      if (cached?.products?.length) {
        all = cached.products;
      }
    } catch {}

    if (!all.length) {
      all = fallback || [];
    }

    const product = all.find((p) => p.id === id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[GET /api/products/id]", e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
