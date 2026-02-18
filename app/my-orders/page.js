"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const trackPhone = sessionStorage.getItem("trackPhone");
    if (!trackPhone) {
      router.push("/track");
      return;
    }

    setPhone(trackPhone);
    fetchOrders(trackPhone);
  }, [router]);

  const fetchOrders = async (phoneNumber) => {
    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phoneNumber)}`);
      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders);
      } else {
        setError(data.error || "No orders found");
      }
    } catch (e) {
      setError("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#f57c00",
      confirmed: "#1976d2",
      preparing: "#7b1fa2",
      delivering: "#00897b",
      completed: "#388e3c",
      cancelled: "#d32f2f",
    };
    return colors[status] || "#666";
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      pending: "⏳",
      confirmed: "✅",
      preparing: "📦",
      delivering: "🚤",
      completed: "⚓",
      cancelled: "❌",
    };
    return emojis[status] || "📋";
  };

  const getStatusText = (status) => {
    const texts = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      delivering: "Delivering",
      completed: "Delivered",
      cancelled: "Cancelled",
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>❌ {error}</h2>
          <button onClick={() => router.push("/track")} className={styles.btn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => router.push("/")}>
          ← Back to Store
        </button>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.phone}>📱 {phone}</p>
      </div>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div 
            key={order.orderNumber} 
            className={styles.orderCard}
            onClick={() => router.push(`/orders/${order.orderNumber}`)}
          >
            <div className={styles.orderHeader}>
              <div>
                <span className={styles.orderNumber}>{order.orderNumber}</span>
                <span className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <span 
                className={styles.status}
                style={{ 
                  background: `${getStatusColor(order.status)}15`,
                  color: getStatusColor(order.status)
                }}
              >
                {getStatusEmoji(order.status)} {getStatusText(order.status)}
              </span>
            </div>

            <div className={styles.orderDetails}>
              <div className={styles.detailRow}>
                <span className={styles.label}>
                  {order.mode === "delivery" ? "🚤 Delivery" : "📍 Pickup"}
                </span>
                <span className={styles.value}>{order.marina}</span>
              </div>
              {order.berth && (
                <div className={styles.detailRow}>
                  <span className={styles.label}>Berth:</span>
                  <span className={styles.value}>{order.berth}</span>
                </div>
              )}
              <div className={styles.detailRow}>
                <span className={styles.label}>Items:</span>
                <span className={styles.value}>{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className={styles.orderFooter}>
              <span className={styles.total}>€{order.total.toFixed(2)}</span>
              <span className={styles.arrow}>→</span>
            </div>
          </div>
        ))}
      </div>

      {orders.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping to see your orders here</p>
          <button onClick={() => router.push("/")} className={styles.btn}>
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}
