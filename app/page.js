"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart, useToast } from "@/lib/store";
import { useT } from "@/lib/i18n";
import Header from "@/components/HeaderWrapper";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import CheckoutSheet from "@/components/CheckoutSheet";
import SuccessScreen from "@/components/SuccessScreen";
import EmergencyMode from "@/components/EmergencyModeWrapper";
import { ToastContainer } from "@/components/Toast";
import fallbackData from "@/data/products-fallback.json";

const CATEGORIES = ["All","Anchoring & Docking","Navigation","Safety","Electrics","Motor","Ropes","Maintenance"];

export default function Home() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [category,    setCategory]    = useState("All");
  const [query,       setQuery]       = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [cartOpen,    setCartOpen]    = useState(false);
  const [checkoutOpen,setCheckoutOpen]= useState(false);
  const [orderDone,   setOrderDone]   = useState(null);
  const [error,       setError]       = useState(null);
  const loaderRef = useRef(null);
  const isFirst   = useRef(true);
  const { count } = useCart();
  const { toasts, remove: removeToast } = useToast();
  const { t } = useT();

  const load = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    reset ? setLoading(true) : setLoadingMore(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: p, limit: 12, category, q: query });
      const res  = await fetch(`/api/products?${params}`, { 
        signal: AbortSignal.timeout(8000) // 8 second timeout
      });
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const data = await res.json();
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error("Invalid response format");
      }
      
      setProducts((prev) => reset ? data.products : [...prev, ...data.products]);
      setHasMore(data.hasMore ?? true);
      if (!reset) setPage(p + 1);
      else setPage(2);
      setError(null);
    } catch (e) {
      console.error("[load] fetch failed:", e.message);
      
      // On error, use fallback data if it's the first load
      if (reset && fallbackData && fallbackData.length > 0) {
        const filtered = category === "All" 
          ? fallbackData 
          : fallbackData.filter(pr => pr.category === category);
        setProducts(filtered.slice(0, 12));
        setHasMore(filtered.length > 12);
        setPage(2);
        setError("Using cached data (offline mode)");
      } else if (!reset) {
        // Silently fail on pagination
        setError(null);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, category, query]);

  useEffect(() => { load(true); }, [category, query]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !loadingMore && !loading) {
        setPage((p) => p + 1);
      }
    }, { threshold: 0.1 });
    if (loaderRef.current) obs.observe(loaderRef.current);
    return () => obs.disconnect();
  }, [hasMore, loadingMore, loading]);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    if (page > 1) load(false);
  }, [page]);

  useEffect(() => {
    const t = setTimeout(() => setQuery(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    if (cartOpen || checkoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen, checkoutOpen]);

  // Listen for TabBar cart button
  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener("yachtdrop:opencart", openCart);
    return () => window.removeEventListener("yachtdrop:opencart", openCart);
  }, []);

  const handleSearchChange = (text) => {
    setSearchInput(text);
  };

  const handleVoiceSearch = (text) => {
    // Voice search: immediate without debounce
    setSearchInput(text);
    setQuery(text);
    setPage(1);
  };

  const handleOrder = (order) => {
    setCheckoutOpen(false);
    setOrderDone(order);
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "var(--navy)", position: "relative" }}>
      <Header
        searchInput={searchInput}
        onSearch={handleSearchChange}
        onVoiceSearch={handleVoiceSearch}
        categories={CATEGORIES}
        activeCategory={category}
        onCategory={(c) => { setCategory(c); setPage(1); }}
        cartCount={count}
        onCartOpen={() => setCartOpen(true)}
      />
      {error && (
        <div style={{
          padding: "8px 12px",
          margin: "8px 8px 0",
          background: "rgba(34, 211, 238, 0.1)",
          border: "1px solid rgba(34, 211, 238, 0.3)",
          borderRadius: "8px",
          color: "#22d3ee",
          fontSize: "0.85rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span>ℹ️</span>
          {error}
        </div>
      )}
      <ProductGrid
        products={products}
        loading={loading}
        loadingMore={loadingMore}
        loaderRef={loaderRef}
        hasMore={hasMore}
        onRefresh={() => load(true)}
      />
      <EmergencyMode products={products} />
      {cartOpen && (
        <CartDrawer
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}
      {checkoutOpen && (
        <CheckoutSheet
          onClose={() => setCheckoutOpen(false)}
          onOrder={handleOrder}
        />
      )}
      {orderDone && (
        <SuccessScreen
          orderNumber={orderDone.orderNumber}
          trackingUrl={orderDone.trackingUrl}
          onDone={() => setOrderDone(null)}
        />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </main>
  );
}