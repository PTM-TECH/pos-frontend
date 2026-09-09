'use client'

import { LucideIcon } from 'lucide-react'
import { usePrivacyStore } from '@/store/privacyStore'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  iconBg: string
  isCurrency?: boolean
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  isCurrency = false,
}: StatCardProps) {

  const amountsHidden = usePrivacyStore((state) => state.amountsHidden)
  const displayValue = isCurrency && amountsHidden ? '******' : value
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1.5">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{displayValue}</p>
      </div>
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
    </div>
  )
}