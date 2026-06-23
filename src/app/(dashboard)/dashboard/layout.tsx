
import AuthGuard from '@/components/shared/AuthGuard'
import Sidebar from '@/components/shared/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-60 min-h-screen bg-gray-50">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}