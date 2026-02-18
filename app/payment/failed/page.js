"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNumber) {
      router.push("/");
      return;
    }

    // Fetch order details
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${orderNumber}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        }
      } catch (e) {
        console.error("Failed to load order:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderNumber, router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>❌</div>
        <h1 className={styles.title}>Payment Failed</h1>
        <p className={styles.message}>
          We couldn't process your payment for order <strong>{orderNumber}</strong>
        </p>

        {order && (
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Order Details</h3>
            
            <div className={styles.deliveryInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Type:</span>
                <span className={styles.infoValue}>
                  {order.mode === "delivery" ? "🚤 Delivery to Boat" : "📍 Marina Pickup"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Marina:</span>
                <span className={styles.infoValue}>{order.marina}</span>
              </div>
              {order.berth && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Berth:</span>
                  <span className={styles.infoValue}>{order.berth}</span>
                </div>
              )}
            </div>

            <div className={styles.items}>
              {order.items.map((item, i) => (
                <div key={i} className={styles.item}>
                  <span className={styles.itemName}>{item.name} ×{item.qty}</span>
                  <span className={styles.itemPrice}>€{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className={styles.total}>
              <span className={styles.totalLabel}>Amount Due:</span>
              <span className={styles.totalAmount}>€{order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <p className={styles.submessage}>
          Don't worry, your order is saved. You can try again or contact support.
        </p>
        
        <div className={styles.actions}>
          <button
            onClick={() => router.push(`/orders/${orderNumber}`)}
            className={styles.primaryBtn}
          >
            View Order & Retry Payment
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.secondaryBtn}
          >
            Back to Store
          </button>
        </div>
      </div>
    </div>
  );
}
