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
  const [mode,   setMode]   = useState("delivery");
  const [marina, setMarina] = useState("");
  const [berth,  setBerth]  = useState("");
  const [name,   setName]   = useState("");
  const [phone,  setPhone]  = useState("");
  const [email,  setEmail]  = useState("");
  const [error,  setError]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [paymentIframe, setPaymentIframe] = useState("");

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email.trim() || !email.includes("@")) { setError("Please enter a valid email."); return; }
    if (mode === "delivery" && !marina.trim()) { setError("Please enter a marina name."); return; }
    if (mode === "delivery" && !berth.trim())  { setError("Please enter your berth or pontoon."); return; }
    if (mode === "pickup"   && !marina)        { setError("Please select a pickup marina."); return; }
    
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

      // Initialize PayTR payment
      const paymentResponse = await fetch("/api/payment/paytr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderData.orderNumber,
          total,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
        }),
      });

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        setError(paymentData.error || "Payment initialization failed");
        setSubmitting(false);
        return;
      }

      // Show payment iframe
      if (paymentData.demo) {
        // Demo mode - redirect to success page
        clear();
        window.location.href = `/payment/success?order=${orderData.orderNumber}`;
      } else {
        // Real PayTR - show iframe
        setPaymentIframe(paymentData.iframeUrl);
        setPaymentStep(true);
        setSubmitting(false);
      }

    } catch (e) {
      console.error("[checkout] error:", e);
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.backdrop} onClick={paymentStep ? undefined : onClose} aria-hidden="true" />
      <div className={styles.sheet} role="dialog" aria-label="Checkout" aria-modal="true">
        <div className={styles.handle} />
        <div className={styles.topRow}>
          <h2 className={styles.title}>{paymentStep ? "Payment" : "Checkout"}</h2>
          <button 
            className={styles.closeBtn} 
            onClick={paymentStep ? undefined : onClose} 
            aria-label="Close"
            disabled={paymentStep}
          >
            ✕
          </button>
        </div>
        <div className={styles.body}>
          {paymentStep ? (
            <div className={styles.paymentContainer}>
              <p className={styles.paymentInfo}>
                Complete your payment securely with PayTR
              </p>
              <iframe
                src={paymentIframe}
                className={styles.paymentIframe}
                frameBorder="0"
                scrolling="no"
                title="PayTR Payment"
              />
              <p className={styles.paymentNote}>
                🔒 Secure payment powered by PayTR
              </p>
            </div>
          ) : (
            <>
              <div className={styles.toggleWrap} role="group" aria-label="Fulfilment method">
                <button
                  className={`${styles.toggle} ${mode === "delivery" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("delivery")} aria-pressed={mode === "delivery"}
                >🚤 Delivery to Boat</button>
                <button
                  className={`${styles.toggle} ${mode === "pickup" ? styles.toggleActive : ""}`}
                  onClick={() => setMode("pickup")} aria-pressed={mode === "pickup"}
                >📍 Marina Pickup</button>
              </div>

              <div className={styles.fields}>
                <label className={styles.label}>Your name
                  <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Captain's name" />
                </label>
                <label className={styles.label}>Email
                  <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="captain@example.com" />
                </label>
                <label className={styles.label}>Phone
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
              <button 
                className={styles.placeBtn} 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Processing..." : "💳 Proceed to Payment"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}