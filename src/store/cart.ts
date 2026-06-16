'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartLine = {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartLine[];
  add: (line: CartLine) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, quantity: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (line) =>
        set((s) => {
          const existing = s.items.find((i) => i.productId === line.productId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.productId === line.productId ? { ...i, quantity: i.quantity + line.quantity } : i
              )
            };
          }
          return { items: [...s.items, line] };
        }),
      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),
      setQty: (productId, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0)
    }),
    { name: 'nexora-cart' }
  )
);
