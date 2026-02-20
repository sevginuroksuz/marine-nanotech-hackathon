import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderNumber, total } = body;

    // Mock payment for demo
    console.log("[payment] Mock payment processed:", { orderNumber, total });

    return NextResponse.json({
      success: true,
      mock: true,
      message: "Payment processed (demo mode)",
    });
  } catch (e) {
    console.error("[payment] error:", e);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
