"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useCart } from "@/lib/store";
import styles from "./page.module.css";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { add, items } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [descOpen, setDescOpen] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const resolvedParams = await Promise.resolve(params);
        const productId = resolvedParams?.id;

        if (!productId) {
          router.push("/");
          return;
        }

        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (res.ok) {
          setProduct(data.product);
        } else {
          router.push("/");
        }
      } catch (e) {
        console.error("Failed to load product:", e);
        router.push("/");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params, router]);

  const handleAddToCart = () => {
    if (!product) return;
    add(product);
  };

  const inCart = product ? items.some((i) => i.id === product.id) : false;
  const cartItem = product ? items.find((i) => i.id === product.id) : null;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <span className={styles.icon}>🔍</span>
          <p>Product not found</p>
          <button onClick={() => router.push("/")} className={styles.goBackBtn}>
            Back to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button onClick={() => router.back()} className={styles.backBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>

      {/* Product Image */}
      <div className={styles.imageSection}>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={styles.productImage}
          />
        ) : (
          <div className={styles.noImage}>No Image</div>
        )}
        {product.brand && (
          <span className={styles.brandBadge}>{product.brand}</span>
        )}
      </div>

      {/* Product Info */}
      <div className={styles.content}>
        <span className={styles.categoryChip}>{product.category}</span>
        <h1 className={styles.title}>{product.name}</h1>

        {(product.shortDescription || product.description) && (
          <div className={styles.descriptionSection}>
            <button
              className={`${styles.descToggle} ${descOpen ? styles.descToggleOpen : ""}`}
              onClick={() => setDescOpen(!descOpen)}
              aria-expanded={descOpen}
            >
              <span>Description</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.descChevron}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {descOpen && (
              <p className={styles.description}>
                {product.description || product.shortDescription}
              </p>
            )}
          </div>
        )}

        {/* Price */}
        <div className={styles.priceBox}>
          <span className={styles.priceCurrency}>€</span>
          <span className={styles.priceAmount}>{product.price?.toFixed(2)}</span>
        </div>

        {/* Product details */}
        <div className={styles.detailsSection}>
          <h3 className={styles.detailsTitle}>Details</h3>
          <div className={styles.detailsList}>
            {product.brand && (
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Brand</span>
                <span className={styles.detailValue}>{product.brand}</span>
              </div>
            )}
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Category</span>
              <span className={styles.detailValue}>{product.category}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailKey}>Currency</span>
              <span className={styles.detailValue}>{product.currency || "EUR"}</span>
            </div>
            {product.productUrl && (
              <div className={styles.detailRow}>
                <span className={styles.detailKey}>Source</span>
                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.detailLink}
                >
                  View Original →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          className={`${styles.addToCartBtn} ${inCart ? styles.inCart : ""}`}
        >
          {inCart ? (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              In Cart{cartItem ? ` (${cartItem.qty})` : ""}
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add to Cart — €{product.price?.toFixed(2)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
