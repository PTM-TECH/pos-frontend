"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  CheckCircle2,
  XCircle,
  Package,
  Clock,
  AlertCircle,
  Wallet,
  Eye,
} from "lucide-react";
import Topbar from "@/components/shared/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import PurchaseFormModal from "@/components/dashboard/PurchaseFormModal";
import ExportButton from "@/components/shared/ExportButton";
import PurchaseDetailModal from "@/components/dashboard/PurchaseDetailModal";
import RecordPurchasePaymentForm from "@/components/dashboard/RecordPurchasePaymentForm";
import {
  getPurchases,
  getPurchaseSummary,
  receivePurchase,
  cancelPurchase,
  PurchaseSummary,
} from "@/lib/purchases";
import { getVendors } from "@/lib/vendors";
import { exportPurchases } from "@/lib/reports";
import {
  formatCurrency,
  formatDateShort,
  getErrorMessage,
  getStatusColor,
  getStatusLabel,
} from "@/lib/utils";
import { Purchase, Vendor } from "@/types";
import { useAuthStore } from "@/store/authStore";
import { useEffectiveStoreId } from "@/lib/useEffectiveStoreId";
import toast from "react-hot-toast";

const DATE_PRESETS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "Custom range", value: "custom" },
];

export default function PurchasesPage() {
  const storeId = useEffectiveStoreId();
  const member = useAuthStore((state) => state.member);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [viewingPurchase, setViewingPurchase] = useState<Purchase | null>(null);
  const [summary, setSummary] = useState<PurchaseSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [vendorFilter, setVendorFilter] = useState<string>("all");
  const [datePreset, setDatePreset] = useState("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [purchasesData, summaryData, vendorsData] = await Promise.all([
        getPurchases(storeId),
        getPurchaseSummary(storeId),
        getVendors(),
      ]);
      setPurchases(purchasesData);
      setSummary(summaryData);
      setVendors(vendorsData);
    } catch {
      toast.error("Failed to load purchases");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [storeId]);

  async function handleReceive(id: number) {
    setActionLoading(id);
    try {
      await receivePurchase(id);
      toast.success("Purchase marked as received, stock updated");
      loadData();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCancel(id: number) {
    setActionLoading(id);
    try {
      await cancelPurchase(id);
      toast.success("Purchase cancelled");
      loadData();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  }

  function isWithinDateRange(dateString: string): boolean {
    if (datePreset === "all") return true;
    const purchaseDate = new Date(dateString);
    const now = new Date();

    if (datePreset === "today") {
      return purchaseDate.toDateString() === now.toDateString();
    }
    if (datePreset === "7d") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      return purchaseDate >= cutoff;
    }
    if (datePreset === "30d") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 30);
      return purchaseDate >= cutoff;
    }
    if (datePreset === "custom") {
      if (!customFrom && !customTo) return true;
      const from = customFrom ? new Date(customFrom) : null;
      const to = customTo ? new Date(customTo) : null;
      if (to) to.setHours(23, 59, 59, 999);
      if (from && purchaseDate < from) return false;
      if (to && purchaseDate > to) return false;
      return true;
    }
    return true;
  }

  const filtered = purchases
    .filter((p) => vendorFilter === "all" || p.vendor === vendorFilter)
    .filter((p) => isWithinDateRange(p.date))
    .sort((a, b) => (a.vendor ?? "").localeCompare(b.vendor ?? ""));

  const totalPaidToVendors = filtered.reduce((sum, p) => sum + p.paid, 0);
  const totalOutstanding = filtered.reduce((sum, p) => sum + p.balance, 0);

  function getExportDateRange(): { date_from?: string; date_to?: string } {
    const now = new Date();
    if (datePreset === "today") {
      const today = now.toISOString().slice(0, 10);
      return { date_from: today, date_to: today };
    }
    if (datePreset === "7d") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 7);
      return { date_from: cutoff.toISOString().slice(0, 10) };
    }
    if (datePreset === "30d") {
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 30);
      return { date_from: cutoff.toISOString().slice(0, 10) };
    }
    if (datePreset === "custom") {
      return {
        date_from: customFrom || undefined,
        date_to: customTo || undefined,
      };
    }
    return {};
  }

  async function handleExport(format: "xlsx" | "pdf") {
    const selectedVendor = vendors.find((v) => v.name === vendorFilter);
    await exportPurchases({
      format,
      store_id: storeId,
      vendor_id: selectedVendor?.id,
      ...getExportDateRange(),
    });
    toast.success("Export downloaded");
  }

  return (
    <>
      <Topbar title="Purchases" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Manage stock purchase orders</p>
          <div className="flex gap-2">
            <ExportButton onExport={handleExport} />
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                         rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Purchase
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            label="Total"
            value={summary?.total ?? "—"}
            icon={Package}
            iconColor="#6366f1"
            iconBg="#eef2ff"
          />
          <StatCard
            label="Pending"
            value={summary?.pending ?? "—"}
            icon={Clock}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
          <StatCard
            label="Received"
            value={summary?.received ?? "—"}
            icon={CheckCircle2}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Cancelled"
            value={summary?.cancelled ?? "—"}
            icon={XCircle}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Paid to Vendors"
            value={formatCurrency(totalPaidToVendors)}
            icon={Wallet}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Outstanding to Vendors"
            value={formatCurrency(totalOutstanding)}
            icon={AlertCircle}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {DATE_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setDatePreset(preset.value)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors
                ${
                  datePreset === preset.value
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
            >
              {preset.label}
            </button>
          ))}

          {datePreset === "custom" && (
            <div className="flex items-center gap-2 ml-1">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs text-gray-400">to</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5
                           focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="text-xs font-medium border border-gray-200 rounded-lg px-2.5 py-1.5
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Vendors</option>
            {vendors.map((v) => (
              <option key={v.id} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-xl border border-gray-200">
            <AlertCircle className="w-10 h-10 text-gray-200 mb-3" />
            <p className="text-sm text-gray-400">No purchase orders found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-xl border border-gray-200 p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {p.title}
                  </h3>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(p.status)}`}
                  >
                    {getStatusLabel(p.status)}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${getStatusColor(p.payment_status)}`}
                  >
                    {getStatusLabel(p.payment_status)}
                  </span>
                  <button
                    onClick={() => setViewingPurchase(p)}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                    title="View items"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-500 mb-3">
                  <div>
                    <p className="text-gray-400">Vendor</p>
                    <p className="text-gray-700 font-medium">
                      {p.vendor ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Total</p>
                    <p className="text-gray-700 font-medium">
                      {formatCurrency(p.total)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Paid</p>
                    <p className="text-gray-700 font-medium">
                      {formatCurrency(p.paid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Date</p>
                    <p className="text-gray-700 font-medium">
                      {formatDateShort(p.date)}
                    </p>
                  </div>
                </div>

                {p.status === "pending" && (
                  <div className="flex gap-2 pt-3 border-t border-gray-50">
                    <button
                      onClick={() => handleReceive(p.id)}
                      disabled={actionLoading === p.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark as Received
                    </button>
                    <button
                      onClick={() => handleCancel(p.id)}
                      disabled={actionLoading === p.id}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                                 bg-red-50 text-red-700 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  </div>
                )}
                {p.balance > 0 && (
                  <div className="pt-3 border-t border-gray-50">
                    <RecordPurchasePaymentForm
                      purchase={p}
                      onRecorded={loadData}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PurchaseFormModal
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            loadData();
          }}
        />
      )}
      {viewingPurchase && (
        <PurchaseDetailModal
          purchase={viewingPurchase}
          onClose={() => setViewingPurchase(null)}
        />
      )}
    </>
  );
}
