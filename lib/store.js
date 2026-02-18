import { create } from "zustand";

export const useCart = create((set, get) => ({
  items: [],

  add(product) {
    set((s) => {
      const exists = s.items.find((i) => i.id === product.id);
      if (exists) {
        return { items: s.items.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { items: [...s.items, { ...product, qty: 1 }] };
    });
  },

  remove(id) {
    set((s) => ({ items: s.items.filter((i) => i.id !== id) }));
  },

  updateQty(id, qty) {
    if (qty < 1) { get().remove(id); return; }
    set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, qty } : i) }));
  },

  clear() { set({ items: [] }); },

  get total() {
    return get().items.reduce((s, i) => s + i.price * i.qty, 0);
  },

  get count() {
    return get().items.reduce((s, i) => s + i.qty, 0);
  },
}));