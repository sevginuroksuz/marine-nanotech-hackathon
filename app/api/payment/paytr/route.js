import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();
    const { orderNumber, total, name, phone, email } = body;

    // PayTR credentials (get from .env)
    const merchant_id = process.env.PAYTR_MERCHANT_ID || "DEMO";
    const merchant_key = process.env.PAYTR_MERCHANT_KEY || "DEMO_KEY";
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "DEMO_SALT";

    // Demo mode check
    const isDemoMode = !process.env.PAYTR_MERCHANT_ID;

    if (isDemoMode) {
      // Return mock payment for demo
      console.log("[paytr] Demo mode - mock payment");
      return NextResponse.json({
        success: true,
        demo: true,
        message: "Demo payment - no real transaction",
        token: "DEMO_TOKEN",
      });
    }

    // Real PayTR integration
    const merchant_oid = `${orderNumber}-${Date.now()}`;
    const user_ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const payment_amount = Math.round(total * 100); // kuruş cinsinden
    const currency = "EUR";
    const test_mode = process.env.NODE_ENV !== "production" ? "1" : "0";
    
    // Success/Fail URLs
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const merchant_ok_url = `${baseUrl}/payment/success?order=${orderNumber}`;
    const merchant_fail_url = `${baseUrl}/payment/failed?order=${orderNumber}`;

    // Basket (sepet) bilgisi
    const user_basket = JSON.stringify([
      [`Order ${orderNumber}`, `${total} EUR`, 1]
    ]);

    // Debug mode
    const debug_on = test_mode;
    const no_installment = "1"; // Taksit kapalı
    const max_installment = "0";
    const timeout_limit = "30"; // 30 dakika

    // Hash token oluşturma
    const hashSTR = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = hashSTR + merchant_salt;
    const token = crypto
      .createHmac("sha256", merchant_key)
      .update(paytr_token)
      .digest("base64");

    // PayTR'ye istek gönder
    const params = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email: email || `${phone}@yachtdrop.com`,
      payment_amount: payment_amount.toString(),
      paytr_token: token,
      user_basket,
      debug_on,
      no_installment,
      max_installment,
      user_name: name,
      user_address: "Marina",
      user_phone: phone,
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit,
      currency,
      test_mode,
    });

    const response = await fetch("https://www.paytr.com/odeme/api/get-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({
        success: true,
        token: data.token,
        iframeUrl: `https://www.paytr.com/odeme/guvenli/${data.token}`,
      });
    } else {
      console.error("[paytr] Token error:", data);
      return NextResponse.json(
        { error: data.reason || "Payment initialization failed" },
        { status: 400 }
      );
    }

  } catch (e) {
    console.error("[paytr] error:", e);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}
