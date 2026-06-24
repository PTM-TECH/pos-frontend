
'use client'

import { useRef } from 'react'
import { X, Printer } from 'lucide-react'
import { Sale } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function ReceiptModal({
  sale,
  onClose,
}: {
  sale: Sale
  onClose: () => void
}) {
  const receiptRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const printContent = receiptRef.current?.innerHTML
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt #${sale.id}</title>
          <style>
            body { font-family: 'Courier New', monospace; padding: 20px; font-size: 13px; color: #111; }
            .center { text-align: center; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; }
            hr { border: none; border-top: 1px dashed #999; margin: 10px 0; }
            .bold { font-weight: bold; }
            .total { font-size: 16px; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
    printWindow.close()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Receipt</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={receiptRef} className="p-6 font-mono text-[13px] text-gray-800">
          <div className="center">
            <p className="bold text-base">POS SYSTEM</p>
            <p>{sale.store}</p>
            <p>{formatDate(sale.created_at)}</p>
          </div>
          <hr />
          <div className="row">
            <span>Receipt #</span>
            <span>{sale.id}</span>
          </div>
          <div className="row">
            <span>Served by</span>
            <span>{sale.member}</span>
          </div>
          <div className="row">
            <span>Client</span>
            <span>{sale.client ?? 'Walk-In'}</span>
          </div>
          <hr />
          {sale.items.map((item) => (
            <div key={item.id} className="mb-1">
              <div>{item.product_name}</div>
              <div className="row">
                <span>
                  {item.quantity} x {formatCurrency(item.unit_price)}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            </div>
          ))}
          <hr />
          <div className="row">
            <span>Discount</span>
            <span>{formatCurrency(sale.discount)}</span>
          </div>
          <div className="row bold total">
            <span>Total</span>
            <span>{formatCurrency(sale.total)}</span>
          </div>
          <div className="row">
            <span>Paid</span>
            <span>{formatCurrency(sale.paid)}</span>
          </div>
          <div className="row">
            <span>Balance</span>
            <span>{formatCurrency(sale.balance)}</span>
          </div>
          <hr />
          <p className="center">Thank you for shopping with us!</p>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3
                       rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}