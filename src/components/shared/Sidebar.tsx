"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Shield, Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import {
  getMainNavItems,
  getSuperAdminNavItems,
  getSuperAdminSidebarItems,
} from "@/lib/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const member = useAuthStore((state) => state.member);
  const logout = useAuthStore((state) => state.logout);
  const mainItems = getMainNavItems(member?.role ?? null);
  const superAdminItems = getSuperAdminNavItems();
  const isSuperAdmin = member?.role === "super_admin";
  const [mobileOpen, setMobileOpen] = useState(false);
  const superAdminSidebar = getSuperAdminSidebarItems();

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  function NavLink({ item }: { item: (typeof mainItems)[0] }) {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    return (
      <Link
        href={item.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }`}
      >
        <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
        {item.label}
      </Link>
    );
  }
  const SidebarContent = (
    <>
      <div className="h-16 flex items-center justify-between gap-2.5 px-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="PapoPOS"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="font-semibold text-gray-900 text-sm">PapoPOS</span>
        </div>
        {/* ADDED — close button, only shown inside the mobile drawer (hidden on desktop via lg:hidden) */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {isSuperAdmin ? (
          <>
            <div className="pt-1 pb-1 px-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                <Shield className="w-3 h-3" />
                Platform Admin
              </div>
            </div>
            {superAdminSidebar.platformAdmin.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}

            <div className="pt-4 pb-1 px-3">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Business
              </p>
            </div>
            {superAdminSidebar.business.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </>
        ) : (
          <>
            {mainItems
              .filter((item) => !item.group)
              .map((item) => (
                <NavLink key={item.href} item={item} />
              ))}

            {Array.from(
              new Set(mainItems.filter((i) => i.group).map((i) => i.group)),
            ).map((group) => (
              <div key={group}>
                <div className="pt-4 pb-1 px-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                    {group}
                  </p>
                </div>
                {mainItems
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <NavLink key={item.href} item={item} />
                  ))}
              </div>
            ))}
          </>
        )}
      </nav>

      <div className="border-t border-gray-100 p-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div
            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center
                          text-xs font-semibold text-gray-600 shrink-0"
          >
            {member?.name?.charAt(0).toUpperCase() ?? "?"}
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
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-3 left-3 z-40 w-10 h-10 rounded-lg bg-white border border-gray-200
                   flex items-center justify-center shadow-sm"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>
      <aside className="hidden lg:flex w-60 h-screen bg-white border-r border-gray-200 flex-col fixed left-0 top-0 z-30">
        {SidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 w-72 h-screen bg-white z-50 flex flex-col shadow-xl">
            {SidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
