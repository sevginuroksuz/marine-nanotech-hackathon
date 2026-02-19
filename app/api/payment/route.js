import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderNumber, total } = body;

    // Mock payment for demo (in production, use Stripe/PayPal)
    if (process.env.STRIPE_SECRET_KEY) {
      // Real Stripe integration (dynamic import to avoid build errors when not installed)
      try {
        const stripeModule = await import("stripe");
        const Stripe = stripeModule.default || stripeModule;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(total * 100), // cents
          currency: "eur",
          metadata: { orderNumber },
        });

        return NextResponse.json({
          success: true,
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e) {
        console.warn("[payment] Stripe not available, falling back to mock:", e.message);
      }
    }

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
