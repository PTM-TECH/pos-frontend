
'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { Column } from '@/components/ui/DataTable'
import ClientFormModal from '@/components/dashboard/ClientFormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { getClients, deleteClient } from '@/lib/clients'
import { getErrorMessage } from '@/lib/utils'
import { Client } from '@/types'
import toast from 'react-hot-toast'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setClients(await getClients())
    } catch {
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteClient(deleteTarget.id)
      toast.success('Client deleted')
      setDeleteTarget(null)
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Client>[] = [
    { header: 'Name', render: (c) => <span className="font-medium text-gray-900">{c.name}</span> },
    { header: 'Email', render: (c) => c.email ?? '—' },
    { header: 'Phone', render: (c) => c.phone ?? '—' },
    { header: 'Gender', render: (c) => <span className="capitalize">{c.gender ?? '—'}</span> },
    {
      header: 'Action',
      render: (c) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditing(c)
              setShowModal(true)
            }}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(c)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Topbar title="Clients" />
      <div className="p-6 space-y-5">
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search clients..."
          buttonLabel="Add Client"
          onButtonClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
        />
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No clients found" />
      </div>

      {showModal && (
        <ClientFormModal
          client={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Client"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}