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
        <div className={styles.iconWrapper}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={styles.checkmark}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h2 className={styles.title}>Order Confirmed!</h2>
        <p className={styles.orderNum}>Order #{orderNumber}</p>
        <p className={styles.msg}>Your parts are on their way.<br/>We'll deliver to your berth shortly.</p>

        {trackingUrl && (
          <button className={styles.trackBtn} onClick={handleTrackOrder}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            Track Your Order
          </button>
        )}

        <button className={styles.btn} onClick={onDone}>Continue Shopping</button>

        <button className={styles.shareBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3"/>
            <circle cx="6" cy="12" r="3"/>
            <circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          Share Order Details
        </button>
      </div>
    </div>
  );
}
