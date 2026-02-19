"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [countdown, setCountdown] = useState(5);
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

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(() => {
      router.push(`/orders/${orderNumber}`);
    }, 5000);

    return () => { clearInterval(timer); clearTimeout(redirectTimer); };
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
        <div className={styles.icon}>✅</div>
        <h1 className={styles.title}>Order Confirmed!</h1>
        <p className={styles.message}>
          Your order <strong>{orderNumber}</strong> has been placed successfully.
        </p>

        {order && (
          <div className={styles.orderSummary}>
            <h3 className={styles.summaryTitle}>Order Summary</h3>
            
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
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>€{order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <p className={styles.submessage}>
          Redirecting to order details in {countdown} seconds...
        </p>
        
        <div className={styles.actions}>
          <button
            onClick={() => router.push(`/orders/${orderNumber}`)}
            className={styles.primaryBtn}
          >
            View Order Details
          </button>
          <button
            onClick={() => router.push("/")}
            className={styles.secondaryBtn}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className={styles.card}><div className={styles.spinner} /><p className={styles.loadingText}>Loading...</p></div></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}