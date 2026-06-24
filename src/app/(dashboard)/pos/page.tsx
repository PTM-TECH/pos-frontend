"use client";

import { useState } from "react";
import Topbar from "@/components/shared/Topbar";
import ProductSearch from "@/components/pos/ProductSearch";
import CartPanel from "@/components/pos/CartPanel";
import CheckoutModal from "@/components/pos/CheckoutModal";
import ReceiptModal from "@/components/pos/ReceiptModal";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Sale } from "@/types";

export default function POSPage() {
  const items = useCartStore((state) => state.items);
  const member = useAuthStore((state) => state.member);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  return (
    <>
      <Topbar title="New Sale" />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
        <div className="lg:col-span-2 space-y-4">
          <ProductSearch storeId={member?.store_id ?? undefined} />

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm text-gray-500">
              Search for a product above to add it to the cart. You can adjust
              quantities and apply a discount before checking out.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 min-h-0">
            <CartPanel />
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={items.length === 0}
            className="not-even:w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={(sale) => {
            setShowCheckout(false);
            setCompletedSale(sale);
          }}
        />
      )}

      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}
    </>
  );
}
