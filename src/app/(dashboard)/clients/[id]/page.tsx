'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Users, ShoppingBag, Wallet, TrendingUp, Eye } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import DataTable, { Column } from '@/components/ui/DataTable'
import ReceiptModal from '@/components/pos/ReceiptModal'
import { getClientHistory } from '@/lib/clients'
import { ClientHistory, Sale } from '@/types'
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function ClientDetailPage() {
  const params = useParams()
  const clientId = Number(params.id)

  const [history, setHistory] = useState<ClientHistory | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewingSale, setViewingSale] = useState<Sale | null>(null)

  useEffect(() => {
    getClientHistory(clientId)
      .then(setHistory)
      .catch(() => toast.error('Failed to load client history'))
      .finally(() => setLoading(false))
  }, [clientId])

  const columns: Column<Sale>[] = [
    { header: 'Sale #', render: (s) => <span className="font-medium text-gray-900">#{s.id}</span> },
    { header: 'Total', render: (s) => formatCurrency(s.total) },
    { header: 'Paid', render: (s) => formatCurrency(s.paid) },
    {
      header: 'Status',
      render: (s) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(s.status)}`}>
          {getStatusLabel(s.status)}
        </span>
      ),
    },
    { header: 'Date', render: (s) => formatDate(s.created_at) },
    {
      header: 'Action',
      render: (s) => (
        <button
          onClick={() => setViewingSale(s)}
          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                     text-gray-500 hover:bg-gray-50"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ]

  return (
    <>
      <Topbar title="Client Detail" />
      <div className="p-6 space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !history ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-400">Client not found</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">{history.client.name}</h2>
                <p className="text-sm text-gray-500">
                  {history.client.email ?? 'No email'} · {history.client.phone ?? 'No phone'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Spent"
                value={formatCurrency(history.total_spent)}
                icon={Wallet}
                iconColor="#10b981"
                iconBg="#ecfdf5"
              />
              <StatCard
                label="Total Orders"
                value={history.total_orders}
                icon={ShoppingBag}
                iconColor="#3b82f6"
                iconBg="#eff6ff"
              />
              <StatCard
                label="Average Order"
                value={formatCurrency(history.average_order)}
                icon={TrendingUp}
                iconColor="#f59e0b"
                iconBg="#fffbeb"
              />
            </div>

            {history.last_purchase && (
              <p className="text-sm text-gray-500">
                Last purchase: <span className="text-gray-900 font-medium">{formatDate(history.last_purchase)}</span>
              </p>
            )}

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Purchase History</h3>
              <DataTable
                columns={columns}
                data={history.sales}
                loading={false}
                emptyMessage="This client hasn't made any purchases yet"
              />
            </div>
          </>
        )}
      </div>

      {viewingSale && (
        <ReceiptModal sale={viewingSale} onClose={() => setViewingSale(null)} />
      )}
    </>
  )
}