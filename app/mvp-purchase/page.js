"use client";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/store";
import Header from "@/components/header";
import styles from "./page.module.css";

export default function MVPPurchasePage() {
  const { add, count } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const CATEGORIES = ["All", "Anchoring", "Navigation", "Safety", "Electrics", "Motor", "Ropes", "Maintenance"];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();

      if (res.ok) {
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error("Failed to fetch products:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    add(product);
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (product.shortDescription && product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <Header
        searchInput={searchQuery}
        onSearch={setSearchQuery}
        categories={CATEGORIES}
        activeCategory={selectedCategory}
        onCategory={setSelectedCategory}
        cartCount={count}
        onCartOpen={() => {}}
      />

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🔍</span>
                <h2 className={styles.emptyTitle}>No products found</h2>
                <p className={styles.emptyText}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filteredProducts.map((product, index) => (
                  <article key={product.id} className={styles.productCard} style={{ animationDelay: `${index * 50}ms` }}>
                    <div className={styles.imageContainer}>
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className={styles.productImage}
                          loading="lazy"
                        />
                      )}
                      <span className={styles.categoryBadge}>{product.category}</span>
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      {product.shortDescription && (
                        <p className={styles.productDescription}>{product.shortDescription}</p>
                      )}
                      <div className={styles.productMeta}>
                        <span className={styles.price}>€{product.price?.toFixed(2)}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={styles.addToCartBtn}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19"/>
                            <line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
