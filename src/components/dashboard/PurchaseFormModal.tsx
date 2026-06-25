"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { Vendor, Product } from "@/types";
import { createPurchase } from "@/lib/purchases";
import { getVendors } from "@/lib/vendors";
import { getProducts } from "@/lib/inventory";
import { getErrorMessage, formatCurrency } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

interface ItemRow {
  product_id: number | "";
  quantity: number;
  cost_price: number;
}

export default function PurchaseFormModal({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved: () => void;
}) {
  const member = useAuthStore((state) => state.member);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState("");
  const [vendorId, setVendorId] = useState<number | "">("");
  const [paid, setPaid] = useState(0);
  const [items, setItems] = useState<ItemRow[]>([
    { product_id: "", quantity: 1, cost_price: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getVendors()
      .then(setVendors)
      .catch(() => {});
    getProducts(member?.store_id ?? undefined)
      .then(setProducts)
      .catch(() => {});
  }, [member]);

  function addRow() {
    setItems([...items, { product_id: "", quantity: 1, cost_price: 0 }]);
  }

  function removeRow(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: keyof ItemRow, value: any) {
    setItems(
      items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.cost_price,
    0,
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Purchase title is required");
      return;
    }
    const validItems = items.filter(
      (i) => i.product_id !== "" && i.quantity > 0,
    );
    if (validItems.length === 0) {
      toast.error("Add at least one valid item");
      return;
    }

    setLoading(true);
    try {
      await createPurchase({
        store_id: member?.store_id ?? 1,
        vendor_id: vendorId === "" ? null : vendorId,
        title,
        paid,
        items: validItems.map((i) => ({
          product_id: i.product_id as number,
          quantity: i.quantity,
          cost_price: i.cost_price,
        })),
      });
      toast.success("Purchase order created successfully");
      onSaved();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="New Purchase Order" onClose={onClose} maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Purchase Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. March Restock"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Vendor
            </label>
            <select
              value={vendorId}
              onChange={(e) =>
                setVendorId(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">None</option>
              {vendors.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount Paid Now
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
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Items
            </label>
            <button
              type="button"
              onClick={addRow}
              className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              <Plus className="w-3.5 h-3.5" />
              Add item
            </button>
          </div>

          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <select
                  value={item.product_id}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "product_id",
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="flex-1 px-2.5 py-2 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    updateRow(index, "quantity", Number(e.target.value) || 1)
                  }
                  placeholder="Qty"
                  className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <input
                  type="number"
                  min={0}
                  value={item.cost_price}
                  onChange={(e) =>
                    updateRow(index, "cost_price", Number(e.target.value) || 0)
                  }
                  placeholder="Cost"
                  className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-gray-300 hover:text-red-500 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-base font-bold text-gray-900">
            {formatCurrency(total)}
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Purchase Order"}
        </button>
      </form>
    </Modal>
  );
}
