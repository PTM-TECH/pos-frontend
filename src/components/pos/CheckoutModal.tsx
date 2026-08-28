"use client";

import { useState, useEffect } from "react";
import { useEffectiveStoreId } from "@/lib/useEffectiveStoreId";
import { X, Banknote, Smartphone, FileText, Search, UserX } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency, getErrorMessage } from "@/lib/utils";
import { createSale } from "@/lib/sales";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Sale, Client } from "@/types";
import { getClients } from "@/lib/clients";
import { queueSaleOffline } from '@/lib/db/salesQueue'

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash", icon: Banknote },
  { value: "mpesa", label: "M-Pesa", icon: Smartphone },
  { value: "credit", label: "Credit", icon: FileText },
] as const;

export default function CheckoutModal({
  onClose,
  onSuccess,
  onOfflineSuccess,
}: {
  onClose: () => void;
  onSuccess: (sale: Sale) => void;
  onOfflineSuccess: (info: { itemCount: number; total: number }) => void
}) {
  const storeId = useEffectiveStoreId();
  const items = useCartStore((state) => state.items);
  const discount = useCartStore((state) => state.discount);
  const clientId = useCartStore((state) => state.clientId);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const member = useAuthStore((state) => state.member);
  const setClientId = useCartStore((state) => state.setClientId);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientQuery, setClientQuery] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);

  useEffect(() => {
    getClients()
      .then(setClients)
      .catch(() => {});
  }, []);

  const selectedClient = clients.find((c) => c.id === clientId);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(clientQuery.toLowerCase()),
  );

  const total = getTotal();

  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["value"]>("cash");
  const [paid, setPaid] = useState(total);
  const [loading, setLoading] = useState(false);

  const balance = Math.max(total - paid, 0);
  const change = Math.max(paid - total, 0);

  function handlePaymentMethodChange(method: typeof PAYMENT_METHODS[number]['value']){
    setPaymentMethod(method)
    setPaid(method=== 'credit' ? 0 : total)
  }

  async function handleConfirm() {
    if (!storeId) {
      toast.error('Please select a specific store before completing a sale')
      return
    }

    setLoading(true)
    const salePayload = {
      store_id: storeId,
      client_id: clientId,
      paid,
      discount,
      payment_method: paymentMethod,
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        unit_price: i.unit_price,
      })),
    }

    try {
      const sale = await createSale(salePayload)
      toast.success('Sale completed successfully')
      clearCart()
      onSuccess(sale)
    } catch (err: any) {
      const isNetworkFailure = !err.response
      if (isNetworkFailure) {
        await queueSaleOffline(salePayload)
        clearCart()
        onOfflineSuccess({ itemCount: items.length, total })
      } else {
        toast.error(getErrorMessage(err))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">
            Complete Sale
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(total)}
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer
            </label>
            {selectedClient ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 border border-gray-200 rounded-lg bg-gray-50">
                <span className="text-sm text-gray-900">
                  {selectedClient.name}
                </span>
                <button
                  type="button"
                  onClick={() => setClientId(null)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={clientQuery}
                  onChange={(e) => {
                    setClientQuery(e.target.value);
                    setShowClientDropdown(true);
                  }}
                  onFocus={() => setShowClientDropdown(true)}
                  placeholder="Search customer, or leave blank for Walk-In"
                  className="w-full pl-10 pr-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                {showClientDropdown && clientQuery && (
                  <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
                    {filteredClients.length === 0 ? (
                      <div className="p-3 text-center text-xs text-gray-400">
                        No matching customers
                      </div>
                    ) : (
                      filteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setClientId(c.id);
                            setClientQuery("");
                            setShowClientDropdown(false);
                          }}
                          className="w-full text-left px-3.5 py-2.5 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0"
                        >
                          {c.name}
                          {c.phone && (
                            <span className="text-xs text-gray-400 ml-2">
                              {c.phone}
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((m) => {
                const Icon = m.icon;
                const active = paymentMethod === m.value;
                return (
                  <button
                    key={m.value}
                    onClick={() => handlePaymentMethodChange(m.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-colors
                      ${
                        active
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium">{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount Paid (KES)
            </label>
            <input
              type="number"
              min={0}
              value={paid}
              onChange={(e) => setPaid(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="space-y-1.5 text-sm">
            {change > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Change</span>
                <span>{formatCurrency(change)}</span>
              </div>
            )}
            {balance > 0 && (
              <div className="flex justify-between text-amber-600 font-medium">
                <span>Balance Remaining</span>
                <span>{formatCurrency(balance)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-xl text-sm font-medium
                       hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Processing..." : "Confirm Sale"}
          </button>
        </div>
      </div>
    </div>
  );
}
