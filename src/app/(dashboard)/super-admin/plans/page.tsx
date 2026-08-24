'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Crown } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import PlanFormModal from '@/components/super-admin/PlanFormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { getPlans, deletePlan, Plan } from '@/lib/plans'
import { formatCurrency, getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Plan | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Plan | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      setPlans(await getPlans())
    } catch {
      toast.error('Failed to load plans')
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
      await deletePlan(deleteTarget.id)
      toast.success('Plan deleted')
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
      <Topbar title="Plans" />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Manage subscription plans offered to tenants</p>
          <button
            onClick={() => {
              setEditing(null)
              setShowModal(true)
            }}
            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                       rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Plan
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-400">No plans found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 capitalize">{plan.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{plan.billing_cycle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditing(plan)
                        setShowModal(true)
                      }}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center
                                 text-gray-500 hover:bg-gray-50"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(plan)}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center
                                 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-3">{formatCurrency(plan.price)}</p>

                <div className="text-xs text-gray-500 mb-3">
                  {plan.max_stores === -1 ? 'Unlimited' : plan.max_stores} stores ·{' '}
                  {plan.max_members === -1 ? 'Unlimited' : plan.max_members} members
                </div>

                {plan.features && plan.features.length > 0 && (
                  <ul className="text-xs text-gray-500 space-y-1">
                    {plan.features.slice(0, 4).map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PlanFormModal
          plan={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Plan"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}