import api from '@/lib/api'

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

interface ExportParams {
  format: 'xlsx' | 'pdf'
  store_id?: number
  date_from?: string
  date_to?: string
  payment_method?: string
}

interface PurchaseExportParams {
  format: 'xlsx' | 'pdf'
  store_id?: number
  vendor_id?: number
  date_from?: string
  date_to?: string
}

export async function exportSales(params: ExportParams) {
  const response = await api.get('/reports/sales', { params, responseType: 'blob' })
  downloadBlob(response.data, `sales-report.${params.format}`)
}

export async function exportExpenses(params: ExportParams) {
  const response = await api.get('/reports/expenses', { params, responseType: 'blob' })
  downloadBlob(response.data, `expenses-report.${params.format}`)
}

export async function exportPurchases(params: PurchaseExportParams) {
  const response = await api.get('/reports/purchases', { params, responseType: 'blob' })
  downloadBlob(response.data, `purchases-report.${params.format}`)
}