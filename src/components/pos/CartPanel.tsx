"use client";

import { useState, useRef } from "react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { selectOnFocus } from "@/lib/formHelpers";
import NumericKeypad from "./NumericKeypad";

export default function CartPanel() {
  const items = useCartStore((state) => state.items);
  const getTotalDiscount = useCartStore((state) => state.getTotalDiscount);
  const getTotal = useCartStore((state) => state.getTotal);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const incrementItem = useCartStore((state) => state.incrementItem);
  const decrementItem = useCartStore((state) => state.decrementItem);
  const setItemQuantity = useCartStore((state) => state.setItemQuantity);
  const setItemSellingPrice = useCartStore(
    (state) => state.setItemSellingPrice,
  );
  const removeItem = useCartStore((state) => state.removeItem);

  const subtotal = getSubtotal();
  const total = getTotal();
  const totalDiscount = getTotalDiscount();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showKeypadFor, setShowKeypadFor] = useState<number | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [editPriceValue, setEditPriceValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function commitEdit(productId: number) {
    const parsed = parseInt(editValue, 10);
    if (!isNaN(parsed)) {
      setItemQuantity(productId, parsed);
    }
    setEditingId(null);
  }

  function commitPriceEdit(productId: number) {
    const parsed = parseFloat(editPriceValue);
    if (!isNaN(parsed) && parsed >= 0) {
      setItemSellingPrice(productId, parsed);
    }
    setEditingPriceId(null);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-full">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
        <ShoppingCart className="w-4.5 h-4.5 text-gray-700" />
        <h3 className="text-sm font-semibold text-gray-900">
          Cart ({items.length})
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingCart className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">Cart is empty</p>
            <p className="text-xs text-gray-400 mt-1">
              Search and add products to begin
            </p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatCurrency(item.unit_price)} / {item.unit ?? "unit"}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 relative">
                <button
                  onClick={() => decrementItem(item.product_id)}
                  className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center
                             hover:bg-gray-50 text-gray-600"
                >
                  <Minus className="w-3 h-3" />
                </button>

                {editingId === item.product_id ? (
                  <input
                    ref={inputRef}
                    type="number"
                    min={0}
                    max={item.available_stock}
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => commitEdit(item.product_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitEdit(item.product_id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="w-12 text-sm font-medium text-center border border-emerald-400 rounded-md
                               focus:outline-none focus:ring-1 focus:ring-emerald-500 py-0.5"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(item.product_id);
                      setEditValue(String(item.quantity));
                    }}
                    onDoubleClick={() => {
                      setEditValue(String(item.quantity));
                      setShowKeypadFor(item.product_id);
                    }}
                    className="text-sm font-medium w-8 text-center hover:bg-gray-50 rounded-md py-0.5"
                    title="Click to type quantity, double-click for keypad"
                  >
                    {item.quantity}
                  </button>
                )}

                <button
                  onClick={() => incrementItem(item.product_id)}
                  disabled={item.quantity >= item.available_stock}
                  className="w-6 h-6 rounded-md border border-gray-200 flex items-center justify-center
                             hover:bg-gray-50 text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3 h-3" />
                </button>

                {showKeypadFor === item.product_id && (
                  <div className="absolute top-full right-0 mt-2 z-30">
                    <NumericKeypad
                      onDigit={(digit) => {
                        const current = editValue === "0" ? "" : editValue;
                        setEditValue(current + digit);
                      }}
                      onBackspace={() => setEditValue((v) => v.slice(0, -1))}
                      onClear={() => setEditValue("")}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => setShowKeypadFor(null)}
                        className="flex-1 text-xs py-2 rounded-lg border border-gray-200 text-gray-600 bg-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          commitEdit(item.product_id);
                          setShowKeypadFor(null);
                        }}
                        className="flex-1 text-xs py-2 rounded-lg bg-emerald-600 text-white"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-20 text-right shrink-0">
                {item.selling_price < item.unit_price && (
                  <p className="text-[10px] text-gray-400 line-through">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </p>
                )}
                {editingPriceId === item.product_id ? (
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={editPriceValue}
                    autoFocus
                    onFocus={selectOnFocus}
                    onChange={(e) => setEditPriceValue(e.target.value)}
                    onBlur={() => commitPriceEdit(item.product_id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commitPriceEdit(item.product_id);
                      if (e.key === "Escape") setEditingPriceId(null);
                    }}
                    className="w-full text-sm font-semibold text-right border border-emerald-400 rounded-md
                              focus:outline-none focus:ring-1 focus:ring-emerald-500 py-0.5 px-1"
                  />
                ) : (
                  <button
                    onClick={() => {
                      setEditingPriceId(item.product_id);
                      setEditPriceValue(String(item.selling_price));
                    }}
                    className={`text-sm font-semibold w-full text-right hover:bg-gray-50 rounded-md py-0.5 px-1
                      ${item.selling_price < item.unit_price ? "text-emerald-600" : "text-gray-900"}`}
                    title="Click to offer a discount"
                  >
                    {formatCurrency(item.quantity * item.selling_price)}
                  </button>
                )}
              </div>

              <button
                onClick={() => removeItem(item.product_id)}
                className="text-gray-300 hover:text-red-500 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-100 px-5 py-4 space-y-3">
          
          {totalDiscount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-emerald-600">Discount applied</span>
              <span className="text-emerald-600 font-medium">
                -{formatCurrency(totalDiscount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-emerald-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
