"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { X, Printer, RotateCcw } from "lucide-react";
import { Sale, SaleItem } from "@/types";
import ReturnItemModal from "./ReturnItemModal";
import { recordPayment } from "@/lib/sales";
import { formatCurrency, formatDate, getAssetUrl, getErrorMessage } from "@/lib/utils";

function ConfirmCreditPaymentForm({
  sale,
  onRecorded,
}: {
  sale: Sale;
  onRecorded: () => void;
}) {
  const [amount, setAmount] = useState(sale.balance);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await recordPayment(sale.id, amount);
      toast.success("Payment recorded");
      onRecorded();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 space-y-2">
      <p className="text-xs font-medium text-amber-800">
        Record a payment from this customer
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          max={sale.balance}
          min={1}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
        />
        <button
          onClick={handleConfirm}
          disabled={loading}
          className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Recording..." : "Record Payment"}
        </button>
      </div>
    </div>
  );
}

export default function ReceiptModal({
  sale,
  onClose,
}: {
  sale: Sale;
  onClose: () => void;
}) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [returningItem, setReturningItem] = useState<SaleItem | null>(null);

  
  function handlePrint() {
    const printContent = receiptRef.current?.innerHTML;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Please allow pop-ups to print the receipt");
      return;
    }

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
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            {sale.payment_method === 'credit' ? 'Invoice' : 'Receipt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          ref={receiptRef}
          className="p-6 font-mono text-[13px] text-gray-800"
        >
          <div className="center">
            {sale.business_logo && (
              <img
                src={getAssetUrl(sale.business_logo) ?? ""}
                alt={sale.business_name ?? "Logo"}
                style={{
                  maxHeight: 48,
                  margin: "0 auto 8px",
                  display: "block",
                }}
              />
            )}
            <p className="bold text-base">
              {sale.business_name ?? (sale.payment_method === 'credit' ? 'INVOICE' : 'SALES RECEIPT')}
            </p>
            {sale.payment_method === 'credit' && (
              <p className="bold" style={{ fontSize: 11, marginTop: 2 }}>
                CREDIT INVOICE | PAYMENT DUE
              </p>
            )}
            <p>{sale.store}</p>
            {sale.business_phone && <p>{sale.business_phone}</p>}
            <p>{formatDate(sale.created_at)}</p>
          </div>
          <hr />
          <div className="row">
            <span>Receipt #</span>
            <span>{sale.id}</span>
          </div>
          <div className="row">
            <span>Served by: </span>
            <span>{sale.member}</span>
          </div>
          <div className="row">
            <span>Client: </span>
            <span>{sale.client ?? "Walk-In"}</span>
          </div>
          <div className="row">
            <span>Payment: </span>
            <span className="capitalize">{sale.payment_method === 'mpesa' ? 'M-Pesa' : sale.payment_method}</span>
          </div>
          <hr />
          {sale.items.map((item) => (
            <div key={item.id} className="mb-1">
              <div>{item.product_name}</div>
              <div className="row">
                <span>
                  {item.quantity} x {formatCurrency(item.unit_price)}
                </span>
                <span> : {formatCurrency(item.subtotal)}</span>
              </div>
              {item.returned_quantity > 0 && (
                <div className="row" style={{ color: "#b91c1c" }}>
                  <span>Returned</span>
                  <span>{item.returned_quantity}</span>
                </div>
              )}
            </div>
          ))}
          <hr />
          <div className="row">
            <span>Discount: </span>
            <span>{formatCurrency(sale.discount)}</span>
          </div>
          <div className="row bold total">
            <span>Total: </span>
            <span>{formatCurrency(sale.total)}</span>
          </div>
          <div className="row">
            <span>Paid: </span>
            <span>{formatCurrency(sale.paid)}</span>
          </div>
          <div className="row">
            <span>Balance: </span>
            <span>{formatCurrency(sale.balance)}</span>
          </div>
          <hr />
          {sale.payment_method === 'credit' ? (
            <p className="center bold">
              Amount Due: {formatCurrency(sale.balance)}
            </p>
          ) : (
            <p className="center">Thank you for shopping with us!</p>
          )}
          <div className="center" style={{ marginTop: 12, fontSize: 10, color: '#888' }}>
            <p>Software Developed by: Pawatech Systems</p>
            <p>Call/Whatsapp: +254795310021</p>
          </div>
        </div>
        
        {sale.payment_method === "credit" && sale.balance > 0 && (
          <div className="px-6 pb-4">
            <ConfirmCreditPaymentForm
              sale={sale}
              onRecorded={() => window.location.reload()}
            />
          </div>
        )}

        {/* Return actions — not part of the printable receipt above */}
        <div className="px-6 pb-4 space-y-1.5">
          {sale.items.map((item) => {
            const remaining = item.quantity - (item.returned_quantity ?? 0);
            if (remaining <= 0) return null;
            return (
              <button
                key={item.id}
                onClick={() => setReturningItem(item)}
                className="w-full flex items-center justify-between text-xs px-3 py-2 rounded-lg
                           border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              >
                <span>Return &quot;{item.product_name}&quot;</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Printer className="w-4 h-4" />
            {sale.payment_method === 'credit' ? 'Print Invoice' : 'Print Receipt'}
          </button>
        </div>
      </div>

      {returningItem && (
        <ReturnItemModal
          item={returningItem}
          onClose={() => setReturningItem(null)}
          onSaved={() => setReturningItem(null)}
        />
      )}
    </div>
  );
}
