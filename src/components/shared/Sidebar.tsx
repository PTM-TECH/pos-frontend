
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { getMainNavItems, getSuperAdminNavItems } from '@/lib/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const member = useAuthStore((state) => state.member)
  const logout = useAuthStore((state) => state.logout)
  const mainItems       = getMainNavItems(member?.role ?? null)
  const superAdminItems = getSuperAdminNavItems()
  const isSuperAdmin    = member?.role === 'super_admin'

  function handleLogout() {
    logout()
    router.replace('/login')
  }

  function NavLink({ item }: { item: typeof mainItems[0] }) {
    const isActive = pathname === item.href
    const Icon     = item.icon
    return (
      <Link
        href={item.href}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
      >
        <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
        {item.label}
      </Link>
    )
  }

  return (
    <aside className="w-60 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100">
        <img src="/logo.png" alt="PapoPOS" className="w-8 h-8 rounded-lg object-contain" />
        <span className="font-semibold text-gray-900 text-sm">PapoPOS</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {/* Main navigation */}
        {mainItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Super admin section */}
        {isSuperAdmin && superAdminItems.length > 0 && (
          <>
            <div className="pt-4 pb-1 px-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Platform Admin
              </div>
            </div>
            {superAdminItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center
                          text-xs font-semibold text-gray-600 shrink-0">
            {member?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{member?.name}</p>
            <p className="text-xs text-gray-500 capitalize truncate">{member?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                     text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  )
}