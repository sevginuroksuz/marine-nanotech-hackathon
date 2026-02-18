// components/CheckoutSheet.js
"use client";
import { useState } from "react";
import { useCart } from "@/lib/store";
import styles from "./CheckoutSheet.module.css";

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
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  const [mode,   setMode]   = useState("delivery"); // "delivery" | "pickup"
  const [marina, setMarina] = useState("");
  const [berth,  setBerth]  = useState("");
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [error,  setError]  = useState("");

  const handleSubmit = () => {
    if (!name.trim())   { setError("Please enter your name."); return; }
    if (mode === "delivery" && !marina.trim()) { setError("Please enter a marina name."); return; }
    if (mode === "delivery" && !berth.trim())  { setError("Please enter your berth or pontoon."); return; }
    if (mode === "pickup" && !marina)          { setError("Please select a pickup marina."); return; }
    setError("");
    const orderNum = `YD-${Math.floor(Math.random() * 90000 + 10000)}`;
    clear();
    onOrder(orderNum);
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.sheet} role="dialog" aria-label="Checkout" aria-modal="true">
        <div className={styles.handle} />

        <div className={styles.topRow}>
          <h2 className={styles.title}>Checkout</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close checkout">✕</button>
        </div>

        <div className={styles.body}>
          {/* Delivery / Pickup toggle */}
          <div className={styles.toggleWrap} role="group" aria-label="Fulfilment method">
            <button
              className={`${styles.toggle} ${mode === "delivery" ? styles.toggleActive : ""}`}
              onClick={() => setMode("delivery")}
              aria-pressed={mode === "delivery"}
            >
              🚤 Delivery to Boat
            </button>
            <button
              className={`${styles.toggle} ${mode === "pickup" ? styles.toggleActive : ""}`}
              onClick={() => setMode("pickup")}
              aria-pressed={mode === "pickup"}
            >
              📍 Marina Pickup
            </button>
          </div>

          {/* Fields */}
          <div className={styles.fields}>
            <label className={styles.label}>Your name
              <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Captain's name" />
            </label>
            <label className={styles.label}>Phone (optional)
              <input className={styles.input} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+34 600 000 000" />
            </label>

            {mode === "delivery" ? (
              <>
                <label className={styles.label}>Marina name
                  <input className={styles.input} value={marina} onChange={(e) => setMarina(e.target.value)} placeholder="e.g. Port Vell" />
                </label>
                <label className={styles.label}>Berth / Pontoon
                  <input className={styles.input} value={berth} onChange={(e) => setBerth(e.target.value)} placeholder="e.g. Pontoon B, Berth 12" />
                </label>
              </>
            ) : (
              <label className={styles.label}>Pickup location
                <select className={styles.select} value={marina} onChange={(e) => setMarina(e.target.value)}>
                  <option value="">Select marina…</option>
                  {MARINAS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </label>
            )}
          </div>

          {/* Order summary */}
          <div className={styles.summary}>
            {items.map((item) => (
              <div key={item.id} className={styles.summaryRow}>
                <span className={styles.summaryName}>{item.name} ×{item.qty}</span>
                <span className={styles.summaryAmt}>€{(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span className={styles.totalAmt}>€{total.toFixed(2)}</span>
            </div>
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button className={styles.placeBtn} onClick={handleSubmit}>
            {mode === "delivery" ? "🚤 Place Order — Deliver to Boat" : "📍 Place Order — Pickup"}
          </button>
        </div>
      </div>
    </>
  );
}
