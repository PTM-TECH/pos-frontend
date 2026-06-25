"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Store as StoreIcon } from "lucide-react";
import Topbar from "@/components/shared/Topbar";
import PageHeader from "@/components/ui/PageHeader";
import StoreFormModal from "@/components/dashboard/StoreFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getStores, deleteStore } from "@/lib/stores";
import { getErrorMessage } from "@/lib/utils";
import { Store } from "@/types";
import toast from "react-hot-toast";

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Store | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadData() {
    setLoading(true);
    try {
      setStores(await getStores());
    } catch {
      toast.error("Failed to load stores");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = stores.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()),
  );

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteStore(deleteTarget.id);
      toast.success("Store deleted");
      setDeleteTarget(null);
      loadData();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Topbar title="Stores" />
      <div className="p-6 space-y-5">
        <PageHeader
          query={query}
          onQueryChange={setQuery}
          placeholder="Search stores..."
          buttonLabel="Add Store"
          onButtonClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
        />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-sm text-gray-400">No stores found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <StoreIcon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {store.name}
                  </h3>
                  {store.location && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {store.location}
                    </p>
                  )}
                  {store.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {store.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditing(store);
                      setShowModal(true);
                    }}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                               text-gray-500 hover:bg-gray-50"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(store)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                               text-gray-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <StoreFormModal
          store={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Store"
          message={`Are you sure you want to delete "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
