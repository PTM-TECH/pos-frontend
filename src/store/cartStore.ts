// src/store/cartStore.ts
import { create } from 'zustand'
import { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  discount: number
  clientId: number | null
  addItem: (item: CartItem) => void
  incrementItem: (productId: number) => void
  decrementItem: (productId: number) => void
  removeItem: (productId: number) => void
  setDiscount: (discount: number) => void
  setClientId: (clientId: number | null) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  discount: 0,
  clientId: null,

  addItem: (item) => set((state) => {
    const existing = state.items.find((i) => i.product_id === item.product_id)
    if (existing) {
      return {
        items: state.items.map((i) =>
          i.product_id === item.product_id
            ? { ...i, quantity: Math.min(i.quantity + 1, i.available_stock) }
            : i
        ),
      }
    }
    return { items: [...state.items, item] }
  }),

  incrementItem: (productId) => set((state) => ({
    items: state.items.map((i) =>
      i.product_id === productId
        ? { ...i, quantity: Math.min(i.quantity + 1, i.available_stock) }
        : i
    ),
  })),

  decrementItem: (productId) => set((state) => ({
    items: state.items
      .map((i) =>
        i.product_id === productId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
      .filter((i) => i.quantity > 0),
  })),

  removeItem: (productId) => set((state) => ({
    items: state.items.filter((i) => i.product_id !== productId),
  })),

  setDiscount: (discount) => set({ discount }),
  setClientId: (clientId) => set({ clientId }),
  clearCart: () => set({ items: [], discount: 0, clientId: null }),

  getSubtotal: () => {
    return get().items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    )
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    return Math.max(subtotal - get().discount, 0)
  },
}))