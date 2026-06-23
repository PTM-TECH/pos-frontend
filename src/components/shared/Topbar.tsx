
'use client'

import { useEffect, useState, useRef } from 'react'
import { Bell, AlertTriangle } from 'lucide-react'
import {
  getUnreadCount,
  getNotifications,
  markAllAsRead,
} from '@/lib/notifications'
import { Notification } from '@/types'
import { formatDate } from '@/lib/utils'

export default function Topbar({ title }: { title: string }) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  async function fetchCount() {
    try {
      const count = await getUnreadCount()
      setUnreadCount(count)
    } catch {
      // silent fail — non-critical
    }
  }

  async function fetchNotifications() {
    try {
      const data = await getNotifications()
      setNotifications(data)
    } catch {
      // silent fail
    }
  }

  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 30000) // poll every 30s
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleBellClick() {
    if (!open) {
      await fetchNotifications()
    }
    setOpen(!open)
  }

  async function handleMarkAllRead() {
    await markAllAsRead()
    setUnreadCount(0)
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleBellClick}
          className="relative w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-900">
                Notifications
              </span>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  No notifications yet
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0
                      ${!n.is_read ? 'bg-amber-50/50' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800 leading-snug">
                        {n.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(n.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}