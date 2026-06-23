
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Receipt,
  Users,
  Truck,
  UserCog,
  Store,
  Bell,
  LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  roles?: string[] // if omitted, visible to all roles
}

export const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['owner', 'admin'],
  },
  {
    label: 'New Sale',
    href: '/pos',
    icon: ShoppingCart,
  },
  {
    label: 'Sales History',
    href: '/sales',
    icon: Receipt,
  },
  {
    label: 'Inventory',
    href: '/inventory',
    icon: Package,
    roles: ['owner', 'admin', 'stockist'],
  },
  {
    label: 'Purchases',
    href: '/purchases',
    icon: Truck,
    roles: ['owner', 'admin', 'stockist'],
  },
  {
    label: 'Clients',
    href: '/clients',
    icon: Users,
  },
  {
    label: 'Vendors',
    href: '/vendors',
    icon: Truck,
    roles: ['owner', 'admin'],
  },
  {
    label: 'Members',
    href: '/members',
    icon: UserCog,
    roles: ['owner', 'admin'],
  },
  {
    label: 'Stores',
    href: '/stores',
    icon: Store,
    roles: ['owner'],
  },
  {
    label: 'Subscriptions',
    href: '/subscriptions',
    icon: Bell,
    roles: ['owner', 'admin'],
  },
]

export function getVisibleNavItems(role: string | null): NavItem[] {
  return navItems.filter((item) => !item.roles || item.roles.includes(role || ''))
}