"use client";
import { useRouter } from "next/navigation";
import styles from "./SuccessScreen.module.css";

export default function SuccessScreen({ orderNumber, trackingUrl, onDone }) {
  const router = useRouter();

  const handleTrackOrder = () => {
    if (trackingUrl) {
      router.push(trackingUrl);
    }
  };

  return (
    <div className={styles.screen} role="dialog" aria-label="Order confirmed" aria-modal="true">
      <div className={styles.inner}>
        <span className={styles.icon}>⚓</span>
        <h2 className={styles.title}>Order Confirmed!</h2>
        <p className={styles.orderNum}>{orderNumber}</p>
        <p className={styles.msg}>Your parts are on their way.<br />We'll deliver to your berth shortly.</p>
        {trackingUrl && (
          <button className={styles.trackBtn} onClick={handleTrackOrder}>
            📍 Track Your Order
          </button>
        )}
        <button className={styles.btn} onClick={onDone}>Back to Store</button>
      </div>
    </div>
  );
}