"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  FolderPlus,
  Package,
  SlidersHorizontal,
  PowerOff,
  Power,
} from "lucide-react";
import Topbar from "@/components/shared/Topbar";
import ProductCard from "@/components/dashboard/ProductCard";
import AddStockModal from "@/components/dashboard/AddStockModal";
import ProductFormModal from "@/components/dashboard/ProductFormModal";
import CategoryFormModal from "@/components/dashboard/CategoryFormModal";
import StockAdjustmentModal from "@/components/dashboard/StockAdjustmentModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  getProducts,
  deleteProduct,
  getCategories,
  setProductActiveStatus,
} from "@/lib/inventory";
import { Product, Category } from "@/types";
import { getErrorMessage } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useEffectiveStoreId } from "@/lib/useEffectiveStoreId";
import toast from "react-hot-toast";

export default function InventoryPage() {
  const storeId = useEffectiveStoreId();
  const member = useAuthStore((state) => state.member);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(
    null,
  );
  const [addingStockProduct, setAddingStockProduct] = useState<Product | null>(
    null,
  );
  const [showInactive, setShowInactive] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(storeId, showInactive),
        getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [storeId, showInactive]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget.id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      await setProductActiveStatus(product.id, !product.is_active);
      toast.success(
        product.is_active ? "Product deactivated" : "Product activated",
      );
      loadData();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <>
      <Topbar title="Inventory" />

      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border
                ${
                  showInactive
                    ? "bg-gray-100 text-gray-700 border-gray-300"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {showInactive ? "Hide inactive" : "Show inactive"}
            </button>
            <button
              onClick={() => setShowCategoryModal(true)}
              className="flex items-center gap-2 border border-gray-200 text-gray-700 px-4 py-2.5
                         rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
              Category
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setShowProductModal(true);
              }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                         rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={() => {
                  setEditingProduct(product);
                  setShowProductModal(true);
                }}
                onDelete={() => setDeleteTarget(product)}
                onAdjustStock={() => setAdjustingProduct(product)}
                onAddStock={() => setAddingStockProduct(product)}
                onToggleActive={() => handleToggleActive(product)}
              />
            ))}
          </div>
        )}
      </div>

      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setShowProductModal(false)}
          onSaved={() => {
            setShowProductModal(false);
            loadData();
          }}
        />
      )}

      {adjustingProduct && (
        <StockAdjustmentModal
          product={adjustingProduct}
          onClose={() => setAdjustingProduct(null)}
          onSaved={() => {
            setAdjustingProduct(null);
            loadData();
          }}
        />
      )}

      {addingStockProduct && (
        <AddStockModal
          product={addingStockProduct}
          onClose={() => setAddingStockProduct(null)}
          onSaved={() => {
            setAddingStockProduct(null);
            loadData();
          }}
        />
      )}

      {showCategoryModal && (
        <CategoryFormModal
          onClose={() => setShowCategoryModal(false)}
          onSaved={() => {
            setShowCategoryModal(false);
            loadData();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
