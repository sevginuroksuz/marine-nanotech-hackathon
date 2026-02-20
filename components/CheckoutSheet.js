"use client";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { useT } from "@/lib/i18n";
import styles from "./CheckoutSheet.module.css";
import dynamic from "next/dynamic";

const MarinaMap = dynamic(() => import("./MarinaMap"), { ssr: false });

const MARINAS = [
  "Port Vell, Barcelona",
  "Marina Ibiza",
  "Port Adriano, Mallorca",
  "Real Club Náutico, Valencia",
  "Marina Marbella",
  "Puerto Banús, Marbella",
  "Marina Alicante",
];

export default function CheckoutSheet({ onClose, onOrder }) {
  const { items, clear } = useCart();
  const { t } = useT();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const [mode,   setMode]   = useState("delivery");
  const [marina, setMarina] = useState("");
  const [berth,  setBerth]  = useState("");
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [email,  setEmail]  = useState("");
  const [error,  setError]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { setError(t("checkout.errors.name")); return; }
    if (!email.trim() || !email.includes("@")) { setError(t("checkout.errors.email")); return; }
    if (mode === "delivery" && !marina.trim()) { setError(t("checkout.errors.marina")); return; }
    if (mode === "delivery" && !berth.trim())  { setError(t("checkout.errors.berth")); return; }
    if (mode === "pickup"   && !marina)        { setError(t("checkout.errors.pickupMarina")); return; }
    
    setError("");
    setSubmitting(true);

    try {
      // Create order via API
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          marina: marina.trim(),
          berth: berth.trim(),
          mode,
          items,
          total,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        setError(orderData.error || "Order failed");
        setSubmitting(false);
        return;
      }

      // Order placed successfully - save to localStorage for tracking
      const savedOrder = {
        orderNumber: orderData.orderNumber,
        status: "confirmed",
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        marina: marina.trim(),
        berth: berth.trim(),
        mode,
        items,
        total,
        createdAt: new Date().toISOString(),
        paymentStatus: "paid",
        trackingUrl: orderData.trackingUrl || `/orders/${orderData.orderNumber}`,
      };
      try {
        const existing = JSON.parse(localStorage.getItem("yachtdrop_orders") || "[]");
        existing.unshift(savedOrder);
        localStorage.setItem("yachtdrop_orders", JSON.stringify(existing));
      } catch {}

      clear();
      if (onOrder) {
        onOrder(orderData.orderNumber, orderData.trackingUrl || `/orders/${orderData.orderNumber}`);
      }

    } catch (e) {
      console.error("[checkout] error:", e);
      setError(t("checkout.errors.generic"));
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.sheet} role="dialog" aria-label="Checkout" aria-modal="true">
        <div className={styles.handle} />
        <div className={styles.topRow}>
          <div />
          <button 
            className={styles.closeBtn} 
            onClick={onClose} 
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>
              <div className={styles.toggleWrap} role="group" aria-label="Fulfilment method">
                <button
                  className={`${styles.toggle} ${mode === "delivery" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("delivery")} aria-pressed={mode === "delivery"}
                >{t("checkout.deliveryToBoat")}</button>
                <button
                  className={`${styles.toggle} ${mode === "pickup" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("pickup")} aria-pressed={mode === "pickup"}
                >{t("checkout.marinaPickup")}</button>
              </div>

              <div className={styles.fields}>
                <label className={styles.label}>{t("checkout.yourName")}
                  <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder={t("checkout.namePlaceholder")} />
                </label>
                <label className={styles.label}>{t("checkout.email")}
                  <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("checkout.emailPlaceholder")} />
                </label>
                <label className={styles.label}>{t("checkout.phone")}
                  <input className={styles.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t("checkout.phonePlaceholder")} />
                </label>
                {mode === "delivery" ? (
                  <>
                    <label className={styles.label}>{t("checkout.marinaName")}
                      <div style={{ display: "flex", gap: "8px" }}>
                        <input className={styles.input} value={marina} onChange={(e) => setMarina(e.target.value)} placeholder={t("checkout.marinaPlaceholder")} style={{ flex: 1 }} />
                        <button
                          type="button"
                          onClick={() => setShowMap(true)}
                          style={{
                            flexShrink: 0,
                            background: "rgba(34, 211, 238, 0.08)",
                            border: "1px solid rgba(34, 211, 238, 0.18)",
                            color: "var(--cyan)",
                            borderRadius: "12px",
                            padding: "8px 12px",
                            fontSize: "0.85rem",
                            cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          aria-label="Open marina map"
                        >
                          🗺️
                        </button>
                      </div>
                    </label>
                    <label className={styles.label}>{t("checkout.berthPontoon")}
                      <input className={styles.input} value={berth} onChange={(e) => setBerth(e.target.value)} placeholder={t("checkout.berthPlaceholder")} />
                    </label>
                  </>
                ) : (
                  <label className={styles.label}>{t("checkout.pickupLocation")}
                    <select className={styles.select} value={marina} onChange={(e) => setMarina(e.target.value)}>
                      <option value="">{t("checkout.selectMarina")}</option>
                      {MARINAS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </label>
                )}
              </div>

              <div className={styles.summary}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryRow}>
                    <span className={styles.summaryName}>{item.name} ×{item.qty}</span>
                    <span className={styles.summaryAmt}>€{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className={styles.summaryTotal}>
                  <span>{t("cart.total")}</span>
                  <span className={styles.totalAmt}>€{total.toFixed(2)}</span>
                </div>
              </div>

              {error && <p className={styles.error} role="alert">{error}</p>}
              <button 
                className={styles.placeBtn} 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? t("checkout.processing") : t("checkout.placeOrder")}
              </button>
        </div>
        {showMap && (
          <MarinaMap
            onSelectMarina={(name) => { setMarina(name); setShowMap(false); }}
            onClose={() => setShowMap(false)}
          />
        )}
      </div>
    </>
  );
}