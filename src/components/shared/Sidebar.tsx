
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getVisibleNavItems } from '@/lib/navigation'
import { useRouter } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const member = useAuthStore((state) => state.member)
  const logout = useAuthStore((state) => state.logout)

  const items = getVisibleNavItems(member?.role ?? null)

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
          <LayoutGrid className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-semibold text-gray-900 text-sm">POS System</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <Icon className="w-4.5 h-4.5" strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0">
            {member?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">
              {member?.name}
            </p>
            <p className="text-xs text-gray-500 capitalize truncate">
              {member?.role}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4.5 h-4.5" />
          Log out
        </button>
      </div>
    </aside>
  )
}