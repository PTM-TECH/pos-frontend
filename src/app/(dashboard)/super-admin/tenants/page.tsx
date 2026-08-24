
'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Eye } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import DataTable, { Column } from '@/components/ui/DataTable'
import PageHeader from '@/components/ui/PageHeader'
import api from '@/lib/api'
import Link from 'next/link'
import { formatDate, getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Tenant {
  id:           number
  name:         string
  email:        string
  phone:        string | null
  status:       string
  created_at:   string
  subscription: any
}

export default function TenantsPage() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [query,   setQuery]   = useState('')
  const [loading, setLoading] = useState(true)

  async function loadData() {
    setLoading(true)
    try {
      const response = await api.get('/tenants/')
      setTenants(response.data.data)
    } catch {
      toast.error('Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSuspend(id: number) {
    try {
      await api.patch(`/tenants/${id}/suspend`)
      toast.success('Tenant suspended')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    }
  }

  async function handleActivate(id: number) {
    try {
      await api.patch(`/tenants/${id}/activate`)
      toast.success('Tenant activated')
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    }
  }

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(query.toLowerCase()) ||
    t.email.toLowerCase().includes(query.toLowerCase())
  )

  const STATUS_COLORS: Record<string, string> = {
    trial:     'bg-blue-50 text-blue-700 border-blue-200',
    active:    'bg-emerald-50 text-emerald-700 border-emerald-200',
    suspended: 'bg-red-50 text-red-700 border-red-200',
    cancelled: 'bg-gray-50 text-gray-700 border-gray-200',
  }

  const columns: Column<Tenant>[] = [
    {
      header: 'Business',
      render: (t) => (
        <div>
          <p className="font-medium text-gray-900">{t.name}</p>
          <p className="text-xs text-gray-500">{t.email}</p>
        </div>
      )
    },
    { header: 'Phone', render: (t) => t.phone ?? '—' },
    {
      header: 'Plan',
      render: (t) => (
        <span className="capitalize text-sm">
          {t.subscription?.plan ?? '—'}
        </span>
      )
    },
    {
      header: 'Status',
      render: (t) => (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize
          ${STATUS_COLORS[t.status] ?? 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {t.status}
        </span>
      )
    },
    { header: 'Joined', render: (t) => formatDate(t.created_at) },
    {
      header: 'Action',
      render: (t) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/super-admin/tenants/${t.id}`}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5
                       border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </Link>
          {t.status !== 'active' ? (
            <button
              onClick={() => handleActivate(t.id)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5
                         bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Activate
            </button>
          ) : (
            <button
              onClick={() => handleSuspend(t.id)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5
                         bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
            >
              <XCircle className="w-3.5 h-3.5" />
              Suspend
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <>
      <Topbar title="Tenants" />
      <div className="p-6 space-y-5">
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search tenants..."
          buttonLabel=""
          onButtonClick={() => {}}
          showButton={false}
        />
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="No tenants found"
        />
      </div>
    </>
  )
}