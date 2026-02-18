import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
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

export async function GET(req, { params }) {
  // Await params in Next.js 15+
  const { orderNumber } = await params;
  
  const orders = await getOrders();
  const order = orders.find(o => o.orderNumber === orderNumber);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ order });
}
