
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreFilterState {
  selectedStoreId: number | null // null = "All Stores"
  setSelectedStoreId: (id: number | null) => void
}

export const useStoreFilterStore = create<StoreFilterState>()(
  persist(
    (set) => ({
      selectedStoreId: null,
      setSelectedStoreId: (id) => set({ selectedStoreId: id }),
    }),
    {
      name: 'pos-store-filter',
    }
  )
)