
'use client'

import { useEffect, useState } from 'react'
import { Plus, CheckCircle2, XCircle, Package, Clock, AlertCircle } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import PurchaseFormModal from '@/components/dashboard/PurchaseFormModal'
import {
  getPurchases,
  getPurchaseSummary,
  receivePurchase,
  cancelPurchase,
  PurchaseSummary,
} from '@/lib/purchases'
import { formatCurrency, formatDateShort, getErrorMessage, getStatusColor, getStatusLabel } from '@/lib/utils'
import { Purchase } from '@/types'
import { useAuthStore } from '@/store/authStore'
import toast from 'react-hot-toast'

export default function PurchasesPage() {
  const member = useAuthStore((state) => state.member)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [summary, setSummary] = useState<PurchaseSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  async function loadData() {
    setLoading(true)
    try {
      const [purchasesData, summaryData] = await Promise.all([
        getPurchases(member?.store_id ?? undefined),
        getPurchaseSummary(member?.store_id ?? undefined),
      ])
      setPurchases(purchasesData)
      setSummary(summaryData)
    } catch {
      toast.error('Failed to load purchases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleReceive(id: number) {
    setActionLoading(id)
    try {
      await receivePurchase(id)
      toast.success('Purchase marked as received, stock updated')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setActionLoading(null)
    }
  }

  async function handleCancel(id: number) {
    setActionLoading(id)
    try {
      await cancelPurchase(id)
      toast.success('Purchase cancelled')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <>
      <Topbar title="Purchases" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Manage stock purchase orders</p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                       rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Purchase
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={summary?.total ?? '—'} icon={Package} iconColor="#6366f1" iconBg="#eef2ff" />
          <StatCard label="Pending" value={summary?.pending ?? '—'} icon={Clock} iconColor="#f59e0b" iconBg="#fffbeb" />
          <StatCard label="Received" value={summary?.received ?? '—'} icon={CheckCircle2} iconColor="#10b981" iconBg="#ecfdf5" />
          <StatCard label="Cancelled" value={summary?.cancelled ?? '—'} icon={XCircle} iconColor="#ef4444" iconBg="#fef2f2" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
            <AlertCircle className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No purchase orders yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {p.title}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(p.status)}`}
                  >
                    {getStatusLabel(p.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500 mb-3">
                  <div>
                    <p className="text-gray-400">Vendor</p>
                    <p className="text-gray-700 font-medium">{p.vendor ?? '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total</p>
                    <p className="text-gray-700 font-medium">{formatCurrency(p.total)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Paid</p>
                    <p className="text-gray-700 font-medium">{formatCurrency(p.paid)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="text-gray-700 font-medium">{formatDateShort(p.date)}</p>
                  </div>
                </div>

                {p.status !== 'received' && p.status !== 'cancelled' && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleReceive(p.id)}
                      disabled={actionLoading === p.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Received
                    </button>
                    <button
                      onClick={() => handleCancel(p.id)}
                      disabled={actionLoading === p.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                 bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PurchaseFormModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}
    </>
  )
}