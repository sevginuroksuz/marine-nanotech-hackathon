"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./header.module.css";
import VoiceSearch from "./VoiceSearch";
import { useT } from "@/lib/i18n";

const CATEGORY_KEYS = ["all","anchoring","navigation","safety","electrics","motor","ropes","maintenance"];
const CATEGORY_VALUES = ["All","Anchoring & Docking","Navigation","Safety","Electrics","Motor","Ropes","Maintenance"];

export default function Header({ searchInput, onSearch, onVoiceSearch, categories, activeCategory, onCategory, cartCount, onCartOpen }) {
  const pathname = usePathname();
  const { t } = useT();

  const handleVoiceResult = (text) => {
    onVoiceSearch(text);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.logo}>⚓ {t("app.title")}</div>
          <div className={styles.logoSub}>{t("app.subtitle")}</div>
        </div>
        <div className={styles.actions}>
          <Link href="/profile" className={`${styles.profileBtn} ${pathname === "/profile" ? styles.profileBtnActive : ""}`} aria-current={pathname === "/profile" ? "page" : undefined} aria-label={t("nav.profile")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        </div>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
          />
          {searchInput && (
            <button className={styles.clearBtn} onClick={() => onSearch("")} aria-label={t("search.clear")}>✕</button>
          )}
        </div>
        <VoiceSearch onResult={handleVoiceResult} />
      </div>

      <div className={`${styles.chips} no-scroll`} role="list">
        {CATEGORY_KEYS.map((key, i) => (
          <button
            key={key}
            role="listitem"
            className={`${styles.chip} ${activeCategory === CATEGORY_VALUES[i] ? styles.chipActive : ""}`}
            onClick={() => onCategory(CATEGORY_VALUES[i])}
            aria-pressed={activeCategory === CATEGORY_VALUES[i]}
          >
            {t(`categories.${key}`)}
          </button>
        ))}
      </div>
    </header>
  );
}
