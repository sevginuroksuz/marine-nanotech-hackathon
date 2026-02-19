"use client";
import ProductCard from "./ProductCard";
import PullToRefresh from "./PullToRefresh";
import styles from "./ProductGrid.module.css";

function Skeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLineShort} />
        <div className={styles.skeletonFooter}>
          <div className={styles.skeletonPrice} />
          <div className={styles.skeletonBtn} />
        </div>
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading, loadingMore, loaderRef, hasMore, onRefresh }) {
  return (
    <PullToRefresh onRefresh={onRefresh} isRefreshing={loading}>
      <section className={styles.section}>
        {!loading && (
          <p className={styles.count} aria-live="polite">
            {products.length === 0 ? "No results found" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
        )}
        <div className={styles.grid}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} />)
            : products.map((p, i) => (
                <ProductCard key={p.id} product={p} animDelay={(i % 12) * 40} />
              ))
          }
          {loadingMore && Array.from({ length: 2 }).map((_, i) => <Skeleton key={`m${i}`} />)}
        </div>
        <div ref={loaderRef} style={{ height: 48 }} aria-hidden="true" />
        {!loading && !hasMore && products.length > 0 && (
          <p className={styles.end}>— You've reached the end —</p>
        )}
        {!loading && products.length === 0 && (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>🔍</span>
            <p className={styles.emptyTitle}>Nothing found</p>
            <p className={styles.emptyText}>Try a different search or category</p>
          </div>
        )}
      </section>
    </PullToRefresh>
  );
}
