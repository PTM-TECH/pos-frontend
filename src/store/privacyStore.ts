import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface PrivacyState {
  amountsHidden: boolean
  toggleAmountsHidden: () => void
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set) => ({
      amountsHidden: false,
      toggleAmountsHidden: () => set((state) => ({ amountsHidden: !state.amountsHidden })),
    }),
    { name: 'pos-privacy-preference' }
  )
)