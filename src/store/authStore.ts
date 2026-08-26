
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Member } from '@/types'
import { useStoreFilterStore } from './storeFilterStore'

interface AuthState {
  token: string | null
  member: Member | null
  setAuth: (token: string, member: Member) => void
  logout: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      member: null,
      setAuth: (token, member) => {
        useStoreFilterStore.getState().setSelectedStoreId(null)
        set({ token, member })
      },
      logout: () => {
        set({ token: null, member: null })
        useStoreFilterStore.getState().setSelectedStoreId(null)
      },
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'pos-auth-storage',
    }
  )
)