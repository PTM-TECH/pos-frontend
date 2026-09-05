"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Building2, CreditCard, RefreshCw, XCircle } from "lucide-react";
import {
  getPlatformNotifications,
  getUnreadCount,
  markAllAsRead,
  PlatformNotification,
} from "@/lib/platformNotifications";
import { formatDate } from "@/lib/utils";

const EVENT_ICONS: Record<string, any> = {
  tenant_registered: Building2,
  payment_submitted: CreditCard,
  subscription_activated: CreditCard,
  plan_switched: RefreshCw,
  payment_rejected: XCircle,
};

export default function PlatformNotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<PlatformNotification[]>(
    [],
  );
  const [unreadCount, setUnreadCount] = useState(0);

  async function loadUnreadCount() {
    try {
      setUnreadCount(await getUnreadCount());
    } catch {}
  }

  async function loadNotifications() {
    try {
      setNotifications(await getPlatformNotifications());
    } catch {}
  }

  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  async function handleOpen() {
    setOpen(!open);
    if (!open) {
      await loadNotifications();
      await markAllAsRead();
      setUnreadCount(0);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
      >
        <Bell className="w-4 h-4 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-20 max-h-96 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900">
                Platform Notifications
              </p>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => {
                const Icon = EVENT_ICONS[n.event_type] ?? Bell;
                return (
                  <Link
                    key={n.id}
                    href={
                      n.tenant_id ? `/super-admin/tenants/${n.tenant_id}` : "#"
                    }
                    onClick={() => setOpen(false)}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800">{n.message}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {formatDate(n.created_at)}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}
