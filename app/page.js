"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useCart } from "@/lib/store";
import Header from "@/components/Header";
import ProductGrid from "@/components/ProductGrid";
import CartDrawer from "@/components/CartDrawer";
import CheckoutSheet from "@/components/CheckoutSheet";
import StickyCartBar from "@/components/StickyCartBar";
import SuccessScreen from "@/components/SuccessScreen";

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
  const loaderRef = useRef(null);
  const isFirst   = useRef(true);
  const { count } = useCart();

  const load = useCallback(async (reset = false) => {
    const p = reset ? 1 : page;
    reset ? setLoading(true) : setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: p, limit: 12, category, q: query });
      const res  = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts((prev) => reset ? data.products : [...prev, ...data.products]);
      setHasMore(data.hasMore);
      if (!reset) setPage(p + 1);
      else setPage(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page, category, query]);

  useEffect(() => { load(true); }, [category, query]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore && !loadingMore && !loading)
        setPage((p) => p + 1);
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

  const handleOrder = (orderNum, trackingUrl) => {
    setCheckoutOpen(false);
    setOrderDone({ orderNumber: orderNum, trackingUrl });
  };

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: "var(--navy)", position: "relative" }}>
      <Header
        searchInput={searchInput}
        onSearch={setSearchInput}
        categories={CATEGORIES}
        activeCategory={category}
        onCategory={(c) => { setCategory(c); setPage(1); }}
        cartCount={count}
        onCartOpen={() => setCartOpen(true)}
      />
      <ProductGrid
        products={products}
        loading={loading}
        loadingMore={loadingMore}
        loaderRef={loaderRef}
        hasMore={hasMore}
      />
      {count > 0 && !cartOpen && (
        <StickyCartBar
          onOpen={() => setCartOpen(true)}
          onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
        />
      )}
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
    </main>
  );
}