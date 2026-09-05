"use client";

import { useState, useEffect, useMemo } from "react";
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'
import { ScanLine } from 'lucide-react'
import toast from 'react-hot-toast'
import Topbar from "@/components/shared/Topbar";
import ProductSearch from "@/components/pos/ProductSearch";
import POSProductGrid from "@/components/pos/POSProductGrid";
import CartPanel from "@/components/pos/CartPanel";
import CheckoutModal from "@/components/pos/CheckoutModal";
import ReceiptModal from "@/components/pos/ReceiptModal";
import QRScannerModal from "@/components/pos/QRScannerModal";
import OfflineSaleConfirmation from '@/components/pos/OfflineSaleConfirmation'
import { getProductByCode } from "@/lib/inventory";
import { refreshProductCache, getCachedProducts, getProductCacheSyncTime, getCachedProductByCode } from '@/lib/db/productCache'
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { Sale, Product } from "@/types";

export default function POSPage() {
  const storeId = useEffectiveStoreId()
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const member = useAuthStore((state) => state.member);
  const [showCheckout, setShowCheckout] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isOffline, setIsOffline] = useState(false)
  const [cacheSyncTime, setCacheSyncTime] = useState<string | null>(null)
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [offlineSaleInfo, setOfflineSaleInfo] = useState<{ itemCount: number; total: number } | null>(null)

  async function loadProducts() {
    setLoadingProducts(true);
    try {
      const data = await refreshProductCache(storeId);
      setProducts(data);
      setIsOffline(false);
    } catch {
      try {
        const cached = await getCachedProducts();
        const syncTime = await getProductCacheSyncTime();
        console.log('OFFLINE FALLBACK HIT', { cachedCount: cached.length, syncTime });
        setProducts(cached);
        setCacheSyncTime(syncTime);
        setIsOffline(true);
        if (cached.length === 0) {
          toast.error('No offline product data available yet. Connect to the internet at least once first.');
        }
      } catch {
        toast.error('Failed to load products');
      }
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, [storeId]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.code ?? '').toLowerCase().includes(q)
    )
  }, [products, searchQuery])

  function handleAddToCart(product: Product) {
    if (product.quantity <= 0) {
      toast.error(`${product.name} is out of stock`)
      return
    }
    addItem({
      product_id: product.id,
      name: product.name,
      code: product.code,
      unit: product.unit,
      unit_price: product.unit_price,
      selling_price: product.unit_price,
      quantity: 1,
      available_stock: product.quantity,
    })
    toast.success(`${product.name} added to cart`)
  }

  async function handleCodeScanned(code: string) {
    setShowScanner(false)
    try {
      const product = await getProductByCode(code, storeId)
      handleAddToCart(product)
    } catch {
      try {
        const cached = await getCachedProductByCode(code)
        if (cached) {
          handleAddToCart(cached)
        } else {
          toast.error(`No product found for code "${code}"`)
        }
      } catch {
        toast.error(`No product found for code "${code}"`)
      }
    }
  }

  return (
    <>
      <Topbar title="New Sale" />

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-4rem)]">
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <ProductSearch storeId={storeId} onQueryChange={setSearchQuery} />
            </div>
            <button
              onClick={() => setShowScanner(true)}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-3.5
                         rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors shrink-0"
            >
              <ScanLine className="w-4 h-4" />
              Scan
            </button>
          </div>
          {isOffline && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              You're offline, showing cached products
              {cacheSyncTime && (
                <span className="text-amber-600">
                  (last updated {new Date(cacheSyncTime).toLocaleString()})
                </span>
              )}
            </div>
          )}

          <POSProductGrid
            products={filteredProducts}
            loading={loadingProducts}
            onAddToCart={handleAddToCart}
          />
        </div>

        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 min-h-0">
            <CartPanel />
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            disabled={items.length === 0}
            className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showScanner && (
        <QRScannerModal
          onScan={handleCodeScanned}
          onClose={() => setShowScanner(false)}
        />
      )}

      {showCheckout && (
        <CheckoutModal
          onClose={() => setShowCheckout(false)}
          onSuccess={(sale) => {
            setShowCheckout(false);
            setCompletedSale(sale);
            loadProducts();
          }}
          onOfflineSuccess={(info) =>{
            setShowCheckout(false);
            setOfflineSaleInfo(info);
          }}
        />
      )}
      {offlineSaleInfo && (
        <OfflineSaleConfirmation
          itemCount={offlineSaleInfo.itemCount}
          total={offlineSaleInfo.total}
          onClose={() => setOfflineSaleInfo(null)}
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