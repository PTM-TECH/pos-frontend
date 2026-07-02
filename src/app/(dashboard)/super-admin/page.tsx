
import Topbar from '@/components/shared/Topbar'
import { Building2, CreditCard, TrendingUp, Users } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'

export default function SuperAdminDashboard() {
  return (
    <>
      <Topbar title="Platform Dashboard" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Overview of all tenants and platform revenue.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Tenants"    value="—" icon={Building2}   iconColor="#10b981" iconBg="#ecfdf5" />
          <StatCard label="Active Plans"     value="—" icon={Users}       iconColor="#3b82f6" iconBg="#eff6ff" />
          <StatCard label="Monthly Revenue"  value="—" icon={TrendingUp}  iconColor="#f59e0b" iconBg="#fffbeb" />
          <StatCard label="Total Payments"   value="—" icon={CreditCard}  iconColor="#8b5cf6" iconBg="#f5f3ff" />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-400">
            Full platform analytics will be available once the FastAPI backend is connected.
          </p>
        </div>
      </div>
    </>
  )
}