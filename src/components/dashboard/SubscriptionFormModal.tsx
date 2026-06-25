
'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { Member } from '@/types'
import { createSubscription } from '@/lib/subscriptions'
import { getMembers } from '@/lib/members'
import { getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function SubscriptionFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void
  onSaved: () => void
}) {
  const [members, setMembers] = useState<Member[]>([])
  const [memberId, setMemberId] = useState<number | ''>('')
  const [name, setName] = useState('')
  const [type, setType] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [time, setTime] = useState('06:30')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getMembers().then(setMembers).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!memberId || !name.trim()) {
      toast.error('Please select a member and enter a report name')
      return
    }

    setLoading(true)
    try {
      await createSubscription({
        member_id: memberId as number,
        name,
        type,
        time,
      })
      toast.success('Subscription created successfully')
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title="New Subscription" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Report Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Morning Report"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Member
          </label>
          <select
            required
            value={memberId}
            onChange={(e) => setMemberId(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Select member</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.email})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Frequency
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Time
            </label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Creating...' : 'Create Subscription'}
        </button>
      </form>
    </Modal>
  )
}