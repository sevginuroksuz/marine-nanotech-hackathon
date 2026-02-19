import { NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
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
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) await mkdir(dir, { recursive: true });
    await writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (e) {
    console.error("[orders] save failed:", e.message);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, phone, email, marina, berth, mode, items, total } = body;

    // Validate
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (mode === "delivery" && (!marina?.trim() || !berth?.trim())) {
      return NextResponse.json({ error: "Marina and berth required for delivery" }, { status: 400 });
    }
    if (mode === "pickup" && !marina?.trim()) {
      return NextResponse.json({ error: "Marina required for pickup" }, { status: 400 });
    }

    // Generate order
    const orderNumber = `YD-${Math.floor(Math.random() * 90000 + 10000)}`;
    const order = {
      orderNumber,
      status: "confirmed",
      name,
      phone: phone || "",
      email: email || "",
      marina,
      berth: berth || "",
      mode,
      items,
      total,
      createdAt: new Date().toISOString(),
      paymentStatus: "paid",
    };

    // Save
    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    // Send email notification (async, don't wait)
    sendEmailNotification(order).catch(err => 
      console.error("[orders] email failed:", err.message)
    );

    return NextResponse.json({ 
      success: true, 
      orderNumber,
      trackingUrl: `/orders/${orderNumber}` 
    });

  } catch (e) {
    console.error("[orders] POST error:", e);
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  const orders = await getOrders();
  
  if (orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  if (phone) {
    const phoneOrders = orders.filter(o => 
      o.phone && o.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
    );
    if (phoneOrders.length === 0) {
      return NextResponse.json({ error: "No orders found for this phone number" }, { status: 404 });
    }
    // Sort by newest first
    phoneOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return NextResponse.json({ orders: phoneOrders });
  }

  return NextResponse.json({ orders });
}

async function sendEmailNotification(order) {
  // Try Resend if API key exists
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // from: "YachtDrop <orders@yachtdrop.com>", // Domain doğrulandıktan sonra aç
          from: "YachtDrop <onboarding@resend.dev>",
          to: process.env.NOTIFICATION_EMAIL || "sevginuroksuz@gmail.com",
          subject: `New Order: ${order.orderNumber}`,
          html: `
            <h2>New YachtDrop Order</h2>
            <p><strong>Order #:</strong> ${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.name}</p>
            <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
            <p><strong>Type:</strong> ${order.mode === "delivery" ? "🚤 Delivery to Boat" : "📍 Marina Pickup"}</p>
            <p><strong>Marina:</strong> ${order.marina}</p>
            ${order.berth ? `<p><strong>Berth:</strong> ${order.berth}</p>` : ""}
            <p><strong>Total:</strong> €${order.total.toFixed(2)}</p>
            <hr>
            <h3>Items:</h3>
            <ul>
              ${order.items.map(item => `
                <li>${item.name} x${item.qty} - €${(item.price * item.qty).toFixed(2)}</li>
              `).join("")}
            </ul>
          `,
        }),
      });
      
      if (!response.ok) {
        console.error("[email] Resend error:", await response.text());
      }
    } catch (e) {
      console.error("[email] Resend failed:", e.message);
    }
  } else {
    // Log to console in dev
    console.log("\n📧 ORDER NOTIFICATION:");
    console.log(JSON.stringify(order, null, 2));
  }
}
