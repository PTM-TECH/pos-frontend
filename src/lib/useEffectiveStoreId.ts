
import { useAuthStore } from '@/store/authStore'
import { useStoreFilterStore } from '@/store/storeFilterStore'

export function useEffectiveStoreId(): number | undefined {
  const member = useAuthStore((state) => state.member)
  const selectedStoreId = useStoreFilterStore((state) => state.selectedStoreId)

  if (member?.role === 'owner') {
    return selectedStoreId ?? undefined
  }

  return member?.store_id ?? undefined
}