import { usePrivacyStore } from '@/store/privacyStore'
import { formatCurrency } from './utils'

export function useCurrencyDisplay() {
  const amountsHidden = usePrivacyStore((state) => state.amountsHidden)

  return function displayCurrency(amount: number): string {
    if (amountsHidden) return 'KES ******'
    return formatCurrency(amount)
  }
}