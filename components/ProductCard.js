"use client";
import { useState } from "react";
import { useCart } from "@/lib/store";
import styles from "./ProductCard.module.css";

export default function ProductCard({ product, animDelay = 0 }) {
  const { add, items } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [flash,     setFlash]     = useState(false);
  const inCart = items.some((i) => i.id === product.id);

  const handleAdd = () => {
    add(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 700);
  };

  return (
    <article className={styles.card} style={{ animationDelay: `${animDelay}ms` }} aria-label={product.name}>
      <span className={styles.pill}>{product.category}</span>
      <div className={styles.imgWrap}>
        {!imgLoaded && <div className={styles.imgSkeleton} />}
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.img}
            style={{ opacity: imgLoaded ? 1 : 0 }}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />
        )}
        <div className={styles.imgOverlay} />
      </div>
      <div className={styles.body}>
        <p className={styles.name}>{product.name}</p>
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
            aria-label={`Add ${product.name} to cart`}
          >
            {inCart
              ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            }
          </button>
        </div>
      </div>
    </article>
  );
}