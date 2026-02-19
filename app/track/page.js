"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function TrackOrderPage() {
  const router = useRouter();
  const [trackBy, setTrackBy] = useState("phone"); // "phone" or "order"
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e) => {
    e.preventDefault();
    
    if (trackBy === "order" && !orderNumber.trim()) {
      setError("Please enter an order number");
      return;
    }

    if (trackBy === "phone" && !phone.trim()) {
      setError("Please enter your phone number");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (trackBy === "order") {
        // Track by order number - redirect to order details
        const res = await fetch(`/api/orders/${orderNumber.trim()}`);
        const data = await res.json();

        if (res.ok) {
          router.push(`/orders/${orderNumber.trim()}`);
        } else {
          setError(data.error || "Order not found");
        }
      } else {
        // Track by phone - redirect to orders list
        const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone.trim())}`);
        const data = await res.json();

        if (res.ok) {
          // Store phone in sessionStorage and redirect
          sessionStorage.setItem("trackPhone", phone.trim());
          router.push("/my-orders");
        } else {
          setError(data.error || "No orders found for this phone number");
        }
      }
    } catch (e) {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => router.push("/")}>
        ← Back
      </button>

      <div className={styles.card}>
        <div className={styles.icon}>🚤</div>
        <h1 className={styles.title}>Track Your Order</h1>
        <p className={styles.subtitle}>
          Find your delivery status
        </p>

        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${trackBy === "phone" ? styles.toggleActive : ""}`}
            onClick={() => setTrackBy("phone")}
            type="button"
          >
            📱 Phone Number
          </button>
          <button
            className={`${styles.toggleBtn} ${trackBy === "order" ? styles.toggleActive : ""}`}
            onClick={() => setTrackBy("order")}
            type="button"
          >
            🔢 Order Number
          </button>
        </div>

        <form onSubmit={handleTrack} className={styles.form}>
          {trackBy === "phone" ? (
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={styles.input}
                placeholder="+34 600 123 456"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
              <p className={styles.hint}>
                Enter the phone number you used when placing your order
              </p>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label htmlFor="orderNumber" className={styles.label}>
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                className={styles.input}
                placeholder="YD-12345"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                autoFocus
              />
              <p className={styles.hint}>
                Your order number starts with YD- followed by 5 digits
              </p>
            </div>
          )}

          {error && (
            <div className={styles.error}>
              ❌ {error}
            </div>
          )}

          <button 
            type="submit" 
            className={styles.trackBtn}
            disabled={loading}
          >
            {loading ? "Searching..." : trackBy === "phone" ? "View My Orders" : "Track Order"}
          </button>
        </form>

        <div className={styles.help}>
          <h3>💡 Tip</h3>
          <p>
            {trackBy === "phone" 
              ? "Using your phone number, you can view all your orders in one place."
              : "You can find your order number in the confirmation screen or email."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
