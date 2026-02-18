"use client";
import styles from "./header.module.css";
import { useRouter } from "next/navigation";

export default function Header({ searchInput, onSearch, categories, activeCategory, onCategory, cartCount, onCartOpen }) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.logo}>⚓ Yachtdrop</div>
          <div className={styles.logoSub}>Parts delivered to your berth</div>
        </div>
        <div className={styles.actions}>
          <button 
            className={styles.trackBtn} 
            onClick={() => router.push("/track")}
            aria-label="Track my orders"
          >
            📦 My Orders
          </button>
          <button className={styles.cartBtn} onClick={onCartOpen} aria-label={`Cart, ${cartCount} items`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 && <span className={styles.badge}>{cartCount > 9 ? "9+" : cartCount}</span>}
          </button>
        </div>
      </div>

      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          value={searchInput}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search anchors, safety gear, engine parts…"
          aria-label="Search products"
        />
        {searchInput && (
          <button className={styles.clearBtn} onClick={() => onSearch("")} aria-label="Clear search">✕</button>
        )}
      </div>

      <div className={`${styles.chips} no-scroll`} role="list">
        {categories.map((cat) => (
          <button
            key={cat}
            role="listitem"
            className={`${styles.chip} ${activeCategory === cat ? styles.chipActive : ""}`}
            onClick={() => onCategory(cat)}
            aria-pressed={activeCategory === cat}
          >
            {cat}
          </button>
        ))}
      </div>
    </header>
  );
}