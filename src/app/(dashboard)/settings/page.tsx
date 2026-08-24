'use client'

import Topbar from '@/components/shared/Topbar'
import ChangePasswordForm from '@/components/dashboard/ChangePasswordForm'
import { useAuthStore } from '@/store/authStore'
import BusinessBrandingForm from '@/components/dashboard/BusinessBrandingForm'

export default function SettingsPage() {
  const member = useAuthStore((state) => state.member)

  return (
    <>
      <Topbar title="Settings" />
      <div className="p-6 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-lg">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Account</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="text-gray-900 font-medium">{member?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Email</span>
              <span className="text-gray-900 font-medium">{member?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Role</span>
              <span className="text-gray-900 font-medium capitalize">{member?.role}</span>
            </div>
            {member?.store && (
              <div className="flex justify-between">
                <span className="text-gray-500">Store</span>
                <span className="text-gray-900 font-medium">{member.store}</span>
              </div>
            )}
          </div>
        </div>

        <ChangePasswordForm />
        {['owner', 'admin'].includes(member?.role ?? '') && <BusinessBrandingForm />}
      </div>
    </>
  )
}