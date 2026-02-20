"use client";
import { useState, useEffect } from "react";
import { useCart, useToast } from "@/lib/store";
import { useT } from "@/lib/i18n";
import styles from "./EmergencyMode.module.css";

// Keywords that identify safety/emergency products
const EMERGENCY_KEYWORDS = [
  "life jacket", "life vest", "lifejacket", "buoyancy",
  "flare", "signal", "distress",
  "first aid", "medical", "bandage",
  "fire extinguisher", "extinguisher",
  "safety", "rescue", "emergency",
  "life raft", "liferaft", "life ring", "lifering",
  "whistle", "horn", "torch", "flashlight",
  "epirb", "plb", "beacon",
  "harness", "tether", "jackline",
  "man overboard", "mob",
];

function isEmergencyProduct(product) {
  const text = `${product.name} ${product.shortDescription || ""} ${product.category || ""}`.toLowerCase();
  return EMERGENCY_KEYWORDS.some((kw) => text.includes(kw)) || product.category === "Safety";
}

export default function EmergencyMode({ products = [] }) {
  const { t } = useT();
  const { add } = useCart();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [emergencyProducts, setEmergencyProducts] = useState([]);

  useEffect(() => {
    if (open && products.length > 0) {
      const filtered = products.filter(isEmergencyProduct);
      setEmergencyProducts(filtered);
    }
  }, [open, products]);

  const handleAddAll = () => {
    emergencyProducts.slice(0, 5).forEach((p) => add(p));
    toast.show(t("emergency.added"), "success", 3000);
    setOpen(false);
  };

  const handleAddOne = (product) => {
    add(product);
  };

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        className={styles.emergencyBtn}
        onClick={() => setOpen(true)}
        aria-label={t("emergency.button")}
      >
        <span className={styles.emergencyPulse} />
        <span className={styles.emergencyIcon}>🚨</span>
        <span className={styles.emergencyLabel}>{t("emergency.button")}</span>
      </button>

      {/* Emergency Modal */}
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div className={styles.modal} role="dialog" aria-label={t("emergency.title")} aria-modal="true">
            <div className={styles.modalHeader}>
              <div>
                <h2 className={styles.modalTitle}>{t("emergency.title")}</h2>
                <p className={styles.modalSubtitle}>{t("emergency.subtitle")}</p>
              </div>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label={t("emergency.close")}>
                ✕
              </button>
            </div>

            <div className={styles.categoryTags}>
              <span className={styles.tag}>🦺 {t("language.en") === "English" ? "Life Jackets" : t("emergency.categories").split(",")[0]?.trim()}</span>
              <span className={styles.tag}>🔥 {t("language.en") === "English" ? "Flares" : t("emergency.categories").split(",")[1]?.trim()}</span>
              <span className={styles.tag}>🏥 {t("language.en") === "English" ? "First Aid" : t("emergency.categories").split(",")[2]?.trim()}</span>
              <span className={styles.tag}>🧯 {t("language.en") === "English" ? "Extinguishers" : t("emergency.categories").split(",")[3]?.trim()}</span>
            </div>

            {emergencyProducts.length > 0 ? (
              <>
                {/* Quick order button */}
                <button className={styles.quickOrderBtn} onClick={handleAddAll}>
                  {t("emergency.quickOrder")}
                </button>

                <div className={styles.productList}>
                  {emergencyProducts.slice(0, 12).map((p) => (
                    <div key={p.id} className={styles.productItem}>
                      {p.imageUrl && (
                        <img src={p.imageUrl} alt={p.name} className={styles.productImg} />
                      )}
                      <div className={styles.productInfo}>
                        <p className={styles.productName}>{p.name}</p>
                        <p className={styles.productPrice}>€{p.price?.toFixed(2)}</p>
                      </div>
                      <button
                        className={styles.addBtn}
                        onClick={() => handleAddOne(p)}
                        aria-label={t("products.addToCart", { name: p.name })}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>{t("emergency.noProducts")}</p>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
