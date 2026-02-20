"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import styles from "./page.module.css";

export default function TrackOrderPage() {
  const router = useRouter();
  const { t } = useT();
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
      const localOrders = JSON.parse(localStorage.getItem("yachtdrop_orders") || "[]");

      if (trackBy === "order") {
        const num = orderNumber.trim().toUpperCase();
        // Check localStorage first
        const localMatch = localOrders.find(o => o.orderNumber === num);
        if (localMatch) {
          router.push(`/orders/${num}`);
          return;
        }
        // Fallback to API
        const res = await fetch(`/api/orders/${num}`);
        if (res.ok) {
          router.push(`/orders/${num}`);
        } else {
          setError("Order not found. Make sure you're using the same device you ordered from.");
        }
      } else {
        const ph = phone.trim();
        // Check localStorage first
        const localMatches = localOrders.filter(o =>
          o.phone && o.phone.replace(/\s/g, "").includes(ph.replace(/\s/g, ""))
        );
        if (localMatches.length > 0) {
          sessionStorage.setItem("trackPhone", ph);
          router.push("/my-orders");
          return;
        }
        // Fallback to API
        const res = await fetch(`/api/orders?phone=${encodeURIComponent(ph)}`);
        if (res.ok) {
          sessionStorage.setItem("trackPhone", ph);
          router.push("/my-orders");
        } else {
          setError("No orders found for this phone number.");
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
      <button className={styles.backBtn} onClick={() => router.push("/")}>{t("track.back")}</button>

      <div className={styles.card}>
        <div className={styles.icon}>🚤</div>
        <h1 className={styles.title}>{t("track.title")}</h1>
        <p className={styles.subtitle}>{t("track.subtitle")}</p>

        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${trackBy === "phone" ? styles.toggleActive : ""}`}
            onClick={() => setTrackBy("phone")}
            type="button"
          >
            {t("track.byPhone")}
          </button>
          <button
            className={`${styles.toggleBtn} ${trackBy === "order" ? styles.toggleActive : ""}`}
            onClick={() => setTrackBy("order")}
            type="button"
          >
            {t("track.byOrder")}
          </button>
        </div>

        <form onSubmit={handleTrack} className={styles.form}>
          {trackBy === "phone" ? (
            <div className={styles.inputGroup}>
              <label htmlFor="phone" className={styles.label}>
                {t("track.phoneLabel")}
              </label>
              <input
                id="phone"
                type="tel"
                className={styles.input}
                placeholder={t("track.phonePlaceholder")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoFocus
              />
              <p className={styles.hint}>
                {t("track.phoneHint")}
              </p>
            </div>
          ) : (
            <div className={styles.inputGroup}>
              <label htmlFor="orderNumber" className={styles.label}>
                {t("track.orderLabel")}
              </label>
              <input
                id="orderNumber"
                type="text"
                className={styles.input}
                placeholder={t("track.orderPlaceholder")}
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                autoFocus
              />
              <p className={styles.hint}>
                {t("track.orderHint")}
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
            {loading ? t("track.searching") : trackBy === "phone" ? t("track.viewMyOrders") : t("track.trackOrder")}
          </button>
        </form>

        <div className={styles.help}>
          <h3>{t("track.tipTitle")}</h3>
          <p>
            {trackBy === "phone" 
              ? t("track.tipPhone")
              : t("track.tipOrder")
            }
          </p>
        </div>
      </div>
    </div>
  );
}
