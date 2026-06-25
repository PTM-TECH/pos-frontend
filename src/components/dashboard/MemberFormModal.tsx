
'use client'

import { useState, useEffect } from 'react'
import Modal from '@/components/ui/Modal'
import { Member, Role, Store } from '@/types'
import { createMember, updateMember } from '@/lib/members'
import { getStores } from '@/lib/stores'
import { getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function MemberFormModal({
  member,
  roles,
  onClose,
  onSaved,
}: {
  member?: Member | null
  roles: Role[]
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!member
  const [stores, setStores] = useState<Store[]>([])
  const [name, setName] = useState(member?.name ?? '')
  const [email, setEmail] = useState(member?.email ?? '')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [storeId, setStoreId] = useState<number | ''>('')
  const [state, setState] = useState(member?.state ?? 'active')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getStores().then(setStores).catch(() => {})
    if (member?.role) {
      const matchedRole = roles.find((r) => r.name === member.role)
      if (matchedRole) setRoleId(matchedRole.id)
    }
    if (member?.store_id) {
      setStoreId(member.store_id)
    }
  }, [member, roles])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !roleId) {
      toast.error('Please fill in name, email and role')
      return
    }
    if (!isEdit && password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      if (isEdit && member) {
        await updateMember(member.id, {
          name,
          phone: phone || undefined,
          role_id: roleId as number,
          store_id: storeId === '' ? null : storeId,
          state,
        })
        toast.success('Member updated successfully')
      } else {
        await createMember({
          name,
          email,
          password,
          phone: phone || undefined,
          role_id: roleId as number,
          store_id: storeId === '' ? null : storeId,
        })
        toast.success('Member added successfully')
      }
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Member' : 'Add Member'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            disabled={isEdit}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>

        {!isEdit && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Phone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+254..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Role
            </label>
            <select
              required
              value={roleId}
              onChange={(e) => setRoleId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name.charAt(0).toUpperCase() + r.name.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Store
            </label>
            <select
              value={storeId}
              onChange={(e) =>
                setStoreId(e.target.value === '' ? '' : Number(e.target.value))
              }
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All stores (Owner)</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Member' : 'Add Member'}
        </button>
      </form>
    </Modal>
  )
}