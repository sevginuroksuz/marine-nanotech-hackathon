"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchOrder() {
      try {
        // Await params in case it's a Promise (Next.js 15)
        const resolvedParams = await Promise.resolve(params);
        const orderNumber = resolvedParams?.orderNumber;
        
        if (!orderNumber) {
          setError("Invalid order number");
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        
        console.log("API Response:", data);
        console.log("Order data:", data.order);
        
        if (res.ok) {
          setOrder(data.order);
        } else {
          setError(data.error || "Order not found");
        }
      } catch (e) {
        console.error("Order fetch error:", e);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [params]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading order...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>❌ {error}</h2>
          <button onClick={() => router.push("/")} className={styles.homeBtn}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const statusEmoji = {
    pending: "⏳",
    confirmed: "✅",
    preparing: "📦",
    delivering: "🚤",
    completed: "⚓",
    cancelled: "❌",
  };

  const statusText = {
    pending: "Order Received",
    confirmed: "Order Confirmed",
    preparing: "Preparing Your Order",
    delivering: "Out for Delivery",
    completed: "Delivered",
    cancelled: "Cancelled",
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button onClick={() => router.push("/")} className={styles.backBtn}>
          ← Back to Store
        </button>

        <div className={styles.header}>
          <span className={styles.statusIcon}>{statusEmoji[order.status]}</span>
          <h1 className={styles.title}>Order {order.orderNumber}</h1>
          <p className={styles.statusText}>{statusText[order.status]}</p>
        </div>

        <div className={styles.section}>
          <h3>Delivery Details</h3>
          <div className={styles.details}>
            <div className={styles.row}>
              <span className={styles.label}>Type:</span>
              <span>{order.mode === "delivery" ? "🚤 Delivery to Boat" : "📍 Marina Pickup"}</span>
            </div>
            <div className={styles.row}>
              <span className={styles.label}>Customer:</span>
              <span style={{color: 'var(--navy)', fontWeight: 500}}>{order.name || "N/A"}</span>
            </div>
            {order.phone && (
              <div className={styles.row}>
                <span className={styles.label}>Phone:</span>
                <span style={{color: 'var(--navy)', fontWeight: 500}}>{order.phone}</span>
              </div>
            )}
            <div className={styles.row}>
              <span className={styles.label}>Marina:</span>
              <span style={{color: 'var(--navy)', fontWeight: 500}}>{order.marina || "N/A"}</span>
            </div>
            {order.berth && (
              <div className={styles.row}>
                <span className={styles.label}>Berth:</span>
                <span style={{color: 'var(--navy)', fontWeight: 500}}>{order.berth}</span>
              </div>
            )}
            <div className={styles.row}>
              <span className={styles.label}>Order Date:</span>
              <span style={{color: 'var(--navy)', fontWeight: 500}}>
                {new Date(order.createdAt).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Order Items</h3>
          <div className={styles.items}>
            {order.items.map((item, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQty}>x{item.qty}</span>
                </div>
                <span className={styles.itemPrice}>
                  €{(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.total}>
            <span className={styles.totalLabel}>Total:</span>
            <span className={styles.totalAmount}>€{order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h3>Payment Status</h3>
          <div className={styles.payment}>
            <span className={order.paymentStatus === "paid" ? styles.paid : styles.pending}>
              {order.paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
