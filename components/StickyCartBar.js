"use client";
import { useCart } from "@/lib/store";
import styles from "./StickyCartBar.module.css";

export default function StickyCartBar({ onOpen }) {
  const { count, items } = useCart();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className={styles.bar} role="complementary" aria-label="Cart summary">
      <button className={styles.viewBtn} onClick={onOpen} aria-label={`View cart, ${count} items`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <span className={styles.itemBadge}>{count}</span>
      </button>
    </div>
  );
}
