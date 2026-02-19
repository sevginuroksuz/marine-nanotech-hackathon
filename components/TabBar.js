"use client";
import { usePathname } from "next/navigation";
import styles from "./TabBar.module.css";
import { useCart } from "@/lib/store";

const TABS = [
  { id: "browse", label: "Browse", icon: "🛒", path: "/" },
  { id: "orders", label: "Orders", icon: "📦", path: "/track" },
  { id: "profile", label: "Profile", icon: "👤", path: "/profile" },
];

export default function TabBar() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav className={styles.tabBar} role="navigation" aria-label="Main navigation">
      {TABS.map((tab) => {
        const isActive = pathname === tab.path || (tab.id === "browse" && pathname === "/");
        const badge = tab.id === "browse" && count > 0 ? count : 0;

        return (
          <a
            key={tab.id}
            href={tab.path}
            className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <div className={styles.tabIcon}>
              <span>{tab.icon}</span>
              {badge > 0 && <span className={styles.tabBadge}>{badge}</span>}
            </div>
            <span className={styles.tabLabel}>{tab.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
