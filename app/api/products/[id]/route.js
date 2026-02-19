import { NextResponse } from "next/server";
import { getCached } from "@/lib/cache";
import fallback from "@/data/products-fallback.json";

function generateDescription(product) {
  const { name, brand, category, price, currency } = product;
  const brandText = brand ? `Manufactured by ${brand}, this` : "This";
  const catLower = category?.toLowerCase() || "marine";
  
  const descriptions = {
    "anchoring & docking": `${brandText} ${name.toLowerCase()} is a premium anchoring and docking solution designed for marine vessels of all sizes. Built with high-quality materials to withstand harsh saltwater conditions, it ensures reliable performance and long-lasting durability. Ideal for recreational boats, sailing yachts, and commercial vessels operating in coastal and offshore environments.`,
    "navigation": `${brandText} ${name.toLowerCase()} is an essential navigation instrument for safe and precise marine passage. Engineered for accuracy in all weather conditions, it provides reliable data for route planning and real-time positioning. Suitable for both leisure cruising and professional maritime operations.`,
    "safety": `${brandText} ${name.toLowerCase()} is a critical safety equipment piece for maritime operations. Designed to meet international marine safety standards, it provides reliable protection for crew and passengers. Every vessel should be equipped with proper safety gear — this product helps ensure compliance and peace of mind on the water.`,
    "electrics": `${brandText} ${name.toLowerCase()} is a marine-grade electrical component built to perform reliably in the demanding marine environment. Featuring corrosion-resistant construction and waterproof design, it ensures consistent electrical performance aboard your vessel. Compatible with standard marine electrical systems.`,
    "motor": `${brandText} ${name.toLowerCase()} is a high-performance marine motor component engineered for reliability and efficiency. Designed to withstand the rigours of marine use, it delivers consistent performance whether cruising coastal waters or navigating open seas. Built with premium materials for extended service life.`,
    "ropes": `${brandText} ${name.toLowerCase()} is a marine-grade rope product engineered for strength, durability, and resistance to UV degradation and saltwater exposure. Suitable for mooring, rigging, anchoring, and general deck use. Features excellent handling characteristics and knot-holding ability.`,
    "maintenance": `${brandText} ${name.toLowerCase()} is a professional-grade marine maintenance product designed to keep your vessel in optimal condition. Formulated specifically for the marine environment, it provides effective cleaning, protection, or repair capabilities. Essential for regular boat care and upkeep.`,
  };

  return descriptions[catLower] || `${brandText} ${name.toLowerCase()} is a quality marine product from our ${catLower} collection. Designed for the demanding marine environment, it combines durability with reliable performance. Suitable for a wide range of vessels and maritime applications. Available for delivery to your berth or marina pickup through YachtDrop.`;
}

export async function GET(req, { params }) {
  try {
    const { id } = await params;

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

    // Generate a description if none exists
    if (!product.shortDescription) {
      product.description = generateDescription(product);
    }

    return NextResponse.json({ product });
  } catch (e) {
    console.error("[GET /api/products/id]", e);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
