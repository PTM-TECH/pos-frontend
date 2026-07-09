// src/app/(dashboard)/super-admin/payments/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import DataTable, { Column } from '@/components/ui/DataTable'
import api from '@/lib/api'
import { formatCurrency, formatDate, getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Payment {
  id:              number
  subscription_id: number
  amount:          number
  currency:        string
  method:          string
  reference:       string | null
  status:          string
  paid_at:         string | null
  created_at:      string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading,  setLoading]  = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const response = await api.get('/payments/')
      setPayments(response.data.data)
    } catch {
      toast.error('Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleVerify(id: number, approved: boolean) {
    try {
      await api.patch(`/payments/${id}/verify`, { payment_id: id, approved })
      toast.success(approved ? 'Payment approved!' : 'Payment rejected')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    }
  }

  const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    failed:  'bg-red-50 text-red-700 border-red-200',
  }

  const columns: Column<Payment>[] = [
    { header: 'ID', render: (p) => `#${p.id}` },
    { header: 'M-Pesa Code', render: (p) => p.reference ?? '—' },
    { header: 'Amount', render: (p) => formatCurrency(p.amount) },
    { header: 'Method', render: (p) => <span className="capitalize">{p.method}</span> },
    {
      header: 'Status',
      render: (p) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize
          ${STATUS_COLORS[p.status] ?? ''}`}>
          {p.status}
        </span>
      )
    },
    { header: 'Submitted', render: (p) => formatDate(p.created_at) },
    {
      header: 'Action',
      render: (p) => p.status === 'pending' ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleVerify(p.id, true)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5
                       bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approve
          </button>
          <button
            onClick={() => handleVerify(p.id, false)}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5
                       bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      ) : <span className="text-xs text-gray-400">Processed</span>
    }
  ]

  return (
    <>
      <Topbar title="Payments" />
      <div className="p-6 space-y-5">
        <DataTable
          columns={columns}
          data={payments}
          loading={loading}
          emptyMessage="No payments found"
        />
      </div>
    </>
  )
}