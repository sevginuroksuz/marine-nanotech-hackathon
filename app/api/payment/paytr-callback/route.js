import { NextResponse } from "next/server";
import crypto from "crypto";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const ORDERS_FILE = join(process.cwd(), "data", "orders.json");

async function getOrders() {
  try {
    if (!existsSync(ORDERS_FILE)) return [];
    const data = await readFile(ORDERS_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders) {
  try {
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error("[orders] save failed:", e.message);
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    const merchant_oid = formData.get("merchant_oid");
    const status = formData.get("status");
    const total_amount = formData.get("total_amount");
    const hash = formData.get("hash");

    const merchant_key = process.env.PAYTR_MERCHANT_KEY || "DEMO_KEY";
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT || "DEMO_SALT";

    // Hash doğrulama
    const hashSTR = merchant_oid + merchant_salt + status + total_amount;
    const calculatedHash = crypto
      .createHmac("sha256", merchant_key)
      .update(hashSTR)
      .digest("base64");

    if (hash !== calculatedHash) {
      console.error("[paytr-callback] Invalid hash");
      return new NextResponse("INVALID_HASH", { status: 400 });
    }

    // Order number'ı merchant_oid'den çıkar (YD-12345-timestamp formatında)
    const orderNumber = merchant_oid.split("-").slice(0, 2).join("-");

    // Order'ı güncelle
    const orders = await getOrders();
    const orderIndex = orders.findIndex(o => o.orderNumber === orderNumber);

    if (orderIndex === -1) {
      console.error("[paytr-callback] Order not found:", orderNumber);
      return new NextResponse("ORDER_NOT_FOUND", { status: 404 });
    }

    if (status === "success") {
      orders[orderIndex].paymentStatus = "paid";
      orders[orderIndex].status = "confirmed";
      orders[orderIndex].paidAt = new Date().toISOString();
      orders[orderIndex].paymentMethod = "PayTR";
      orders[orderIndex].transactionId = merchant_oid;
      
      console.log(`[paytr-callback] Payment successful for ${orderNumber}`);
    } else {
      orders[orderIndex].paymentStatus = "failed";
      orders[orderIndex].paymentFailReason = formData.get("failed_reason_msg") || "Unknown";
      
      console.log(`[paytr-callback] Payment failed for ${orderNumber}`);
    }

    await saveOrders(orders);

    // PayTR'ye OK yanıtı dön (ZORUNLU!)
    return new NextResponse("OK", { status: 200 });

  } catch (e) {
    console.error("[paytr-callback] error:", e);
    return new NextResponse("ERROR", { status: 500 });
  }
}
