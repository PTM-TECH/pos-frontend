
export interface Role {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface Member {
  id: number
  store_id: number | null
  store: string | null
  role: string | null
  name: string
  email: string
  phone: string | null
  state: string
  last_seen: string | null
  created_at: string
}

export interface Store {
  id: number
  name: string
  location: string | null
  description: string | null
  created_at: string
}

export interface Category {
  id: number
  name: string
  type: string
  created_at: string
}

export interface Product {
  id: number
  store_id: number
  store: string | null
  category: string | null
  name: string
  description: string | null
  code: string | null
  unit_price: number
  unit: string | null
  quantity: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  image: string | null
  created_at: string
}

export interface Client {
  id: number
  name: string
  email: string | null
  phone: string | null
  gender: string | null
  created_at: string
}

export interface Vendor {
  id: number
  name: string
  contact: string | null
  phone: string | null
  location: string | null
  created_at: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  product_name: string | null
  product_code: string | null
  unit: string | null
  quantity: number
  unit_price: number
  subtotal: number
}

export interface Sale {
  id: number
  store: string | null
  member: string | null
  client: string | null
  total: number
  paid: number
  balance: number
  discount: number
  payment_method: 'cash' | 'mpesa' | 'credit'
  status: 'paid' | 'partially_paid' | 'pending'
  created_at: string
  items: SaleItem[]
}

export interface CartItem {
  product_id: number
  name: string
  code: string | null
  unit: string | null
  unit_price: number
  quantity: number
  available_stock: number
}

export interface PurchaseItem {
  id: number
  purchase_id: number
  product_id: number
  product_name: string | null
  product_code: string | null
  unit: string | null
  quantity: number
  cost_price: number
  subtotal: number
}

export interface Purchase {
  id: number
  store: string | null
  vendor: string | null
  title: string
  total: number
  paid: number
  balance: number
  status: 'pending' | 'received' | 'partially_received' | 'cancelled'
  date: string
  created_at: string
  items: PurchaseItem[]
}

export interface Subscription {
  id: number
  member_id: number
  member: string | null
  name: string
  type: 'daily' | 'weekly' | 'monthly'
  time: string
  created_at: string
}

export interface Notification {
  id: number
  product_id: number
  product_name: string | null
  product_code: string | null
  quantity: number | null
  message: string
  is_read: boolean
  created_at: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  message: string
  data: T
}

export interface DashboardStats {
  total_sales: number
  items_sold: number
  total_paid: number
  total_balance: number
  total_returned: number
}