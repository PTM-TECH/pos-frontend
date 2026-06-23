
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Member } from '@/types'

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
      setAuth: (token, member) => set({ token, member }),
      logout: () => set({ token: null, member: null }),
      isAuthenticated: () => !!get().token,
    }),
    {
      name: 'pos-auth-storage',
    }
  )
)