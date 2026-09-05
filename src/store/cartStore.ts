// src/store/cartStore.ts
import { create } from "zustand";
import { CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  discount: number;
  clientId: number | null;
  addItem: (item: CartItem) => void;
  incrementItem: (productId: number) => void;
  decrementItem: (productId: number) => void;
  setItemQuantity: (productId: number, quantity: number) => void;
  setItemSellingPrice: (productId: number, sellingPrice: number) => void;
  removeItem: (productId: number) => void;
  setDiscount: (discount: number) => void;
  setClientId: (clientId: number | null) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getTotalDiscount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  clientId: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find(
        (i) => i.product_id === item.product_id,
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product_id === item.product_id
              ? { ...i, quantity: Math.min(i.quantity + 1, i.available_stock) }
              : i,
          ),
        };
      }
      return { items: [...state.items, item] };
    }),

  setItemSellingPrice: (productId: number, sellingPrice: number) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === productId
          ? { ...i, selling_price: Math.max(sellingPrice, 0) }
          : i,
      ),
    })),

  incrementItem: (productId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.product_id === productId
          ? { ...i, quantity: Math.min(i.quantity + 1, i.available_stock) }
          : i,
      ),
    })),

  setItemQuantity: (productId: number, quantity: number) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product_id === productId
            ? {
                ...i,
                quantity: Math.max(0, Math.min(quantity, i.available_stock)),
              }
            : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  decrementItem: (productId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.product_id === productId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.product_id !== productId),
    })),

  setDiscount: (discount) => set({ discount }),
  setClientId: (clientId) => set({ clientId }),
  clearCart: () => set({ items: [], discount: 0, clientId: null }),

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
  },

  getTotalDiscount: () => {
    return get().items.reduce(
      (sum, item) =>
        sum + (item.unit_price - item.selling_price) * item.quantity,
      0,
    );
  },

  getTotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.quantity * item.selling_price,
      0,
    );
  },
}));
