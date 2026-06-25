
'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import { Vendor } from '@/types'
import { createVendor, updateVendor } from '@/lib/vendors'
import { getErrorMessage } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function VendorFormModal({
  vendor,
  onClose,
  onSaved,
}: {
  vendor?: Vendor | null
  onClose: () => void
  onSaved: () => void
}) {
  const isEdit = !!vendor
  const [name, setName] = useState(vendor?.name ?? '')
  const [contact, setContact] = useState(vendor?.contact ?? '')
  const [phone, setPhone] = useState(vendor?.phone ?? '')
  const [location, setLocation] = useState(vendor?.location ?? '')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Vendor name is required')
      return
    }

    setLoading(true)
    try {
      const payload = { name, contact: contact || undefined, phone: phone || undefined, location: location || undefined }
      if (isEdit && vendor) {
        await updateVendor(vendor.id, payload)
        toast.success('Vendor updated successfully')
      } else {
        await createVendor(payload)
        toast.success('Vendor added successfully')
      }
      onSaved()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={isEdit ? 'Edit Vendor' : 'Add Vendor'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Vendor Name
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
            Contact Person
          </label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
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
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
          {loading ? 'Saving...' : isEdit ? 'Update Vendor' : 'Add Vendor'}
        </button>
      </form>
    </Modal>
  )
}