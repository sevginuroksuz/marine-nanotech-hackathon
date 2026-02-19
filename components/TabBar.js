"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./TabBar.module.css";
import { useCart } from "@/lib/store";

const BrowseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const OrdersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);

const TABS = [
  { id: "browse", label: "Browse", Icon: BrowseIcon, path: "/" },
  { id: "cart", label: "Cart", Icon: CartIcon, path: null },
  { id: "orders", label: "Orders", Icon: OrdersIcon, path: "/track" },
];

export default function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className={styles.tabBar} role="navigation" aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive = tab.path && (pathname === tab.path || (tab.id === "browse" && pathname === "/"));
        const badge = (tab.id === "cart") && count > 0 ? count : 0;

        // Cart tab dispatches a custom event to open the cart drawer
        if (tab.id === "cart") {
          return (
            <button
              key={tab.id}
              className={`${styles.tab} ${count > 0 ? styles.tabHighlight : ""}`}
              onClick={() => window.dispatchEvent(new CustomEvent("yachtdrop:opencart"))}
              aria-label={`Cart, ${count} items`}
            >
              <div className={styles.tabIcon}>
                <tab.Icon />
                {badge > 0 && <span className={styles.tabBadge}>{badge}</span>}
              </div>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          );
        }

        return (
          <Link
            key={tab.id}
            href={tab.path}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className={styles.tabIcon}>
              <tab.Icon />
            </div>
            <span className={styles.tabLabel}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
