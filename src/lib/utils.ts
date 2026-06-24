// src/lib/utils.ts

export function formatCurrency(amount: number): string {
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString('en-KE', {
    timeZone: 'Africa/Nairobi',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-KE', {
    timeZone: 'Africa/Nairobi',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'paid':
    case 'received':
    case 'in_stock':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'partially_paid':
    case 'partially_received':
    case 'low_stock':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'pending':
      return 'bg-gray-50 text-gray-700 border-gray-200'
    case 'out_of_stock':
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-200'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200'
  }
}

export function getStatusLabel(status: string): string {
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getErrorMessage(err: any): string {
  const message = err?.response?.data?.message

  if (typeof message === 'string') {
    return message
  }

  if (message && typeof message === 'object') {
    const firstKey = Object.keys(message)[0]
    const firstError = message[firstKey]
    if (Array.isArray(firstError)) {
      return `${firstKey}: ${firstError[0]}`
    }
    return JSON.stringify(message)
  }

  return 'Something went wrong. Please try again.'
}