
'use client'

import { useEffect, useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import PageHeader from '@/components/ui/PageHeader'
import DataTable, { Column } from '@/components/ui/DataTable'
import VendorFormModal from '@/components/dashboard/VendorFormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { getVendors, deleteVendor } from '@/lib/vendors'
import { getErrorMessage } from '@/lib/utils'
import { Vendor } from '@/types'
import toast from 'react-hot-toast'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Vendor | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vendor | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setVendors(await getVendors())
    } catch {
      toast.error('Failed to load vendors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase())
  )

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteVendor(deleteTarget.id)
      toast.success('Vendor deleted')
      setDeleteTarget(null)
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Vendor>[] = [
    { header: 'Name', render: (v) => <span className="font-medium text-gray-900">{v.name}</span> },
    { header: 'Contact', render: (v) => v.contact ?? '—' },
    { header: 'Phone', render: (v) => v.phone ?? '—' },
    { header: 'Location', render: (v) => v.location ?? '—' },
    {
      header: 'Action',
      render: (v) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditing(v)
              setShowModal(true)
            }}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(v)}
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
      <Topbar title="Vendors" />
      <div className="p-6 space-y-5">
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search vendors..."
          buttonLabel="Add Vendor"
          onButtonClick={() => {
            setEditing(null)
            setShowModal(true)
          }}
        />
        <DataTable columns={columns} data={filtered} loading={loading} emptyMessage="No vendors found" />
      </div>

      {showModal && (
        <VendorFormModal
          vendor={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Vendor"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}