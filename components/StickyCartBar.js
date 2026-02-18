"use client";
import { useCart } from "@/lib/store";
import styles from "./StickyCartBar.module.css";

export default function StickyCartBar({ onOpen, onCheckout }) {
  const { count, items } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  return (
    <div className={styles.bar} role="complementary" aria-label="Cart summary">
      <button className={styles.viewBtn} onClick={onOpen} aria-label={`View cart, ${count} items`}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        <span>View Cart · {count} {count === 1 ? "item" : "items"}</span>
      </button>
      <button className={styles.checkoutBtn} onClick={onCheckout}>
        €{total.toFixed(2)} →
      </button>
    </div>
  );
}