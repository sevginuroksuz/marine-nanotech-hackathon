"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/store";
import { useT } from "@/lib/i18n";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, animDelay = 0 }) {
  const router = useRouter();
  const { add, items } = useCart();
  const { t } = useT();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [flash, setFlash] = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    add(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };

  const isOutOfStock = product.stock === 0;

  return (
    <article
      className={`${styles.card} ${isOutOfStock ? styles.outOfStock : ""} ${imgLoaded ? "" : styles.loading}`}
      style={{ animationDelay: `${animDelay}ms` }}
      aria-label={product.name}
    >
      {product.isNew && <span className={styles.newBadge}>New</span>}
      {product.discount && (
        <span className={styles.discountBadge}>-{product.discount}%</span>
      )}
      <span className={styles.pill}>{product.category}</span>

      <div className={styles.imgWrap} onClick={() => router.push(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
        {!imgLoaded && <div className={styles.imgSkeleton} />}
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`${styles.img} ${imgLoaded ? styles.loaded : ""}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}
        <div className={styles.imgOverlay} />

        {isOutOfStock && (
          <div className={styles.outOfStock}>
            <span className={styles.outOfStockText}>{t("products.outOfStock")}</span>
          </div>
        )}
      </div>

      <div className={styles.body}>
        <p className={styles.name} onClick={() => router.push(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</p>
        {product.shortDescription && (
          <p className={styles.desc}>{product.shortDescription}</p>
        )}
        <div className={styles.footer}>
          <span className={styles.price}>
            <span className={styles.curr}>€</span>
            {product.price?.toFixed(2) ?? "—"}
          </span>
          <button
            className={`${styles.addBtn} ${flash ? styles.addFlash : ""} ${inCart ? styles.addActive : ""}`}
            onClick={handleAdd}
            aria-label={t("products.addToCart", { name: product.name })}
            disabled={isOutOfStock}
          >
            {inCart ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
