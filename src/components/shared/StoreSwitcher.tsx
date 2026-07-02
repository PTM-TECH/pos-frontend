
'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, Store as StoreIcon } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useStoreFilterStore } from '@/store/storeFilterStore'
import { getStores } from '@/lib/stores'
import { Store } from '@/types'

export default function StoreSwitcher() {
  const member = useAuthStore((state) => state.member)
  const selectedStoreId = useStoreFilterStore((state) => state.selectedStoreId)
  const setSelectedStoreId = useStoreFilterStore((state) => state.setSelectedStoreId)

  const [stores, setStores] = useState<Store[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (member?.role === 'owner') {
      getStores().then(setStores).catch(() => {})
    }
  }, [member])

  // Only owners get a switcher — everyone else is locked to their store
  if (member?.role !== 'owner') return null

  const selectedStore = stores.find((s) => s.id === selectedStoreId)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200
                   text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <StoreIcon className="w-4 h-4 text-gray-500" />
        {selectedStore ? selectedStore.name : 'All Stores'}
        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 z-20 overflow-hidden">
            <button
              onClick={() => {
                setSelectedStoreId(null)
                setOpen(false)
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                ${!selectedStoreId ? 'text-emerald-600 font-medium bg-emerald-50/50' : 'text-gray-700'}`}
            >
              All Stores
            </button>
            <div className="border-t border-gray-100" />
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => {
                  setSelectedStoreId(store.id)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors
                  ${selectedStoreId === store.id ? 'text-emerald-600 font-medium bg-emerald-50/50' : 'text-gray-700'}`}
              >
                {store.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}