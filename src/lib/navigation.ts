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
  Building2,
  CreditCard,
  Crown,
  Settings,
  Wallet,
  History,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles?: string[];
  section?: "main" | "super-admin";
  group?: string;
}

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["owner", "admin"],
    section: "main",
  },
  // OPERATIONS
  {
    label: "New Sale",
    href: "/new-sale",
    icon: ShoppingCart,
    section: "main",
    group: "Operations",
  },
  {
    label: "Sales History",
    href: "/sales",
    icon: Receipt,
    section: "main",
    group: "Operations",
  },
  {
    label: "Returns",
    href: "/returns",
    icon: RotateCcw,
    roles: ["owner", "admin"],
    section: "main",
    group: "Operations",
  },
  {
    label: "Purchases",
    href: "/purchases",
    icon: Truck,
    roles: ["owner", "admin", "stockist"],
    section: "main",
    group: "Operations",
  },
  // PRODUCT MANAGEMENT
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    roles: ["owner", "admin", "stockist"],
    section: "main",
    group: "Product Management",
  },
  {
    label: "Stock Adjustments",
    href: "/stock-adjustments",
    icon: SlidersHorizontal,
    roles: ["owner", "admin", "stockist"],
    section: "main",
    group: "Product Management",
  },
  //FINANCE
  {
    label: "Expenses",
    href: "/expenses",
    icon: Wallet,
    roles: ["owner", "admin"],
    section: "main",
    group: "Finance",
  },
  {
    label: "Scheduled Reports",
    href: "/subscriptions",
    icon: Bell,
    roles: ["owner", "admin"],
    section: "main",
    group: "Finance",
  },
  {
    label: "Billing",
    href: "/billing",
    icon: CreditCard,
    roles: ["owner", "admin"],
    section: "main",
    group: "Finance",
  },
  // PEOPLE
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
    section: "main",
    group: "People",
  },
  {
    label: "Vendors",
    href: "/vendors",
    icon: Truck,
    roles: ["owner", "admin"],
    section: "main",
    group: "People",
  },
  {
    label: "Members",
    href: "/members",
    icon: UserCog,
    roles: ["owner", "admin"],
    section: "main",
    group: "People",
  },
  // BUSINESS
  {
    label: "Stores",
    href: "/stores",
    icon: Store,
    roles: ["owner"],
    section: "main",
    group: "Business",
  },
  {
    label: "Activity Log",
    href: "/audit-log",
    icon: History,
    roles: ["owner", "admin"],
    section: "main",
    group: "Business",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    section: "main",
    group: "Business",
  },
  // SUPER ADMIN
  {
    label: "Tenants",
    href: "/super-admin/tenants",
    icon: Building2,
    roles: ["super_admin"],
    section: "super-admin",
  },
  {
    label: "Plans",
    href: "/super-admin/plans",
    icon: Crown,
    roles: ["super_admin"],
    section: "super-admin",
  },
  {
    label: "Subscriptions",
    href: "/super-admin/subscriptions",
    icon: Bell,
    roles: ["super_admin"],
    section: "super-admin",
  },
  {
    label: "Payments",
    href: "/super-admin/payments",
    icon: CreditCard,
    roles: ["super_admin"],
    section: "super-admin",
  },
];

export function getVisibleNavItems(role: string | null): NavItem[] {
  return navItems.filter(
    (item) => !item.roles || item.roles.includes(role ?? ""),
  );
}

export function getMainNavItems(role: string | null): NavItem[] {
  return navItems.filter(
    (item) =>
      item.section === "main" &&
      (!item.roles || item.roles.includes(role ?? "")),
  );
}

export function getSuperAdminNavItems(): NavItem[] {
  return navItems.filter((item) => item.section === "super-admin");
}
