'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Plan, createPlan, updatePlan } from '@/lib/plans'
import { getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function PlanFormModal({
  plan,
  onClose,
  onSaved,
}: {
  plan?: Plan | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!plan
  const [name, setName] = useState(plan?.name ?? '')
  const [price, setPrice] = useState(plan?.price ?? 0)
  const [billingCycle, setBillingCycle] = useState(plan?.billing_cycle ?? 'monthly')
  const [maxStores, setMaxStores] = useState(plan?.max_stores ?? 1)
  const [maxMembers, setMaxMembers] = useState(plan?.max_members ?? 3)
  const [featuresText, setFeaturesText] = useState((plan?.features ?? []).join('\n'))
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || price < 0) {
      toast.error('Please fill in a valid plan name and price')
      return
    }

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean)

    setLoading(true)
    try {
      const payload = {
        name,
        price,
        billing_cycle: billingCycle,
        max_stores: maxStores,
        max_members: maxMembers,
        features,
      }
      if (isEdit && plan) {
        await updatePlan(plan.id, payload)
        toast.success('Plan updated successfully')
      } else {
        await createPlan(payload)
        toast.success('Plan created successfully')
      }
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Plan' : 'Add Plan'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. starter"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (KES)</label>
            <input
              type="number"
              required
              min={0}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Billing Cycle</label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Stores <span className="text-gray-400">(-1 = unlimited)</span>
            </label>
            <input
              type="number"
              value={maxStores}
              onChange={(e) => setMaxStores(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Max Members <span className="text-gray-400">(-1 = unlimited)</span>
            </label>
            <input
              type="number"
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Features <span className="text-gray-400">(one per line)</span>
          </label>
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={5}
            placeholder={'1 store\nUp to 3 staff members\nUnlimited products'}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Plan' : 'Add Plan'}
        </button>
      </form>
    </Modal>
  )
}