
'use client'
import AuthGuard from '@/components/shared/AuthGuard'
import Sidebar from '@/components/shared/Sidebar'
import TrialBanner from '@/components/shared/TrialBanner'
import UpdatePrompt from '@/components/shared/UpdatePrompt'
import { useEffect } from 'react'
import { initSyncManager } from '@/lib/db/syncManager'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(()=>{
    initSyncManager()
  }, [])

  return (
    <AuthGuard>
      <TrialBanner/>
      <UpdatePrompt />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-60 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}