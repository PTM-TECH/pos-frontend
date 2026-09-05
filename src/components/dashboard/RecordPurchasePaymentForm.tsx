'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { recordPurchasePayment } from '@/lib/purchases'
import { getErrorMessage } from '@/lib/utils'
import { selectOnFocus } from '@/lib/formHelpers'
import { Purchase } from '@/types'

export default function RecordPurchasePaymentForm({
  purchase,
  onRecorded,
}: {
  purchase: Purchase
  onRecorded: () => void
}) {
  const [amount, setAmount] = useState(purchase.balance)
  const [loading, setLoading] = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await recordPurchasePayment(purchase.id, amount)
      toast.success('Payment recorded')
      onRecorded()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 space-y-2">
      <p className="text-xs font-medium text-blue-800">Record a payment to this vendor</p>
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onFocus={selectOnFocus}
          onChange={(e) => setAmount(Number(e.target.value))}
          max={purchase.balance}
          min={1}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Recording...' : 'Record Payment'}
        </button>
      </div>
    </div>
  )
}