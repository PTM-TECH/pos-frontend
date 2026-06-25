
'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Bell, Clock } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import SubscriptionFormModal from '@/components/dashboard/SubscriptionFormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { getSubscriptions, deleteSubscription } from '@/lib/subscriptions'
import { getErrorMessage } from '@/lib/utils'
import { Subscription } from '@/types'
import toast from 'react-hot-toast'

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setSubscriptions(await getSubscriptions())
    } catch {
      toast.error('Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteSubscription(deleteTarget.id)
      toast.success('Subscription deleted')
      setDeleteTarget(null)
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <Topbar title="Subscriptions" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Manage scheduled report deliveries to members
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                       rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Subscription
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
            <Bell className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No subscriptions yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subscriptions.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Bell className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">
                        {s.name}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {s.type} report
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-50">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {s.time}
                  </span>
                  <span>{s.member}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <SubscriptionFormModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Subscription"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}