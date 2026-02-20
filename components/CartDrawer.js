"use client";
import { useCart } from "@/lib/store";
import { useT } from "@/lib/i18n";
import styles from "./CartDrawer.module.css";
import SwipeableCartItem from "./SwipeableCartItem";

export default function CartDrawer({ onClose, onCheckout }) {
  const { items, remove, updateQty } = useCart();
  const { t } = useT();
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div className={styles.drawer} role="dialog" aria-label={t("cart.title")} aria-modal="true">
        <div className={styles.handle} />
        <div className={styles.topRow}>
          <h2 className={styles.title}>{t("cart.title")}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t("cart.close")}>✕</button>
        </div>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>⚓</span>
            <p>{t("cart.empty")}</p>
          </div>
        ) : (
          <>
            <ul className={styles.list}>
              {items.map((item) => (
                <SwipeableCartItem
                  key={item.id}
                  item={item}
                  onRemove={() => remove(item.id)}
                >
                  <li className={styles.itemInner}>
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className={styles.itemImg} />
                    )}
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>{item.name}</p>
                    </div>
                    <div className={styles.qtyRow}>
                      <button onClick={() => updateQty(item.id, item.qty - 1)} aria-label="Decrease" className={styles.qtyBtn}>−</button>
                      <span className={styles.qty}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} aria-label="Increase" className={styles.qtyBtn}>+</button>
                    </div>
                    <p className={styles.itemPrice}>€{(item.price * item.qty).toFixed(2)}</p>
                  </li>
                </SwipeableCartItem>
              ))}
            </ul>
            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>{t("cart.total")}</span>
                <span className={styles.totalAmt}>€{total.toFixed(2)}</span>
              </div>
              <button className={styles.checkoutBtn} onClick={onCheckout}>{t("cart.checkout")}</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
