import { create } from "zustand";

export const useCart = create((set, get) => ({
  items: [],
  count: 0,
  total: 0,

  add(product) {
    set((s) => {
      const exists = s.items.find((i) => i.id === product.id);
      const newItems = exists
        ? s.items.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...s.items, { ...product, qty: 1 }];
      
      const newCount = newItems.reduce((sum, i) => sum + i.qty, 0);
      const newTotal = newItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      
      return { items: newItems, count: newCount, total: newTotal };
    });
    // Trigger toast
    useToast.getState().show(`${product.name} added to cart`);
  },

  remove(id) {
    set((s) => {
      const newItems = s.items.filter((i) => i.id !== id);
      const newCount = newItems.reduce((sum, i) => sum + i.qty, 0);
      const newTotal = newItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      return { items: newItems, count: newCount, total: newTotal };
    });
  },

  updateQty(id, qty) {
    if (qty < 1) { get().remove(id); return; }
    set((s) => {
      const newItems = s.items.map((i) => i.id === id ? { ...i, qty } : i);
      const newCount = newItems.reduce((sum, i) => sum + i.qty, 0);
      const newTotal = newItems.reduce((sum, i) => sum + i.price * i.qty, 0);
      return { items: newItems, count: newCount, total: newTotal };
    });
  },

  clear() {
    set({ items: [], count: 0, total: 0 });
  },
}));

// Global toast store
export const useToast = create((set) => ({
  toasts: [],
  show(message, type = "success", duration = 2500) {
    const id = Date.now() + Math.random();
    set((s) => ({ toasts: [...s.toasts, { id, message, type, duration }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },
  remove(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));