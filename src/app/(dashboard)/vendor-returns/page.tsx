"use client";

import { useEffect, useState } from "react";
import { RotateCcw, Package, Wallet, AlertCircle } from "lucide-react";
import Topbar from "@/components/shared/Topbar";
import StatCard from "@/components/dashboard/StatCard";
import DataTable, { Column } from "@/components/ui/DataTable";
import {
  getPurchaseReturns,
  getPurchaseReturnsSummary,
  PurchaseReturn,
  PurchaseReturnsSummary,
} from "@/lib/purchaseReturns";
import { formatCurrency, formatDate, getErrorMessage } from "@/lib/utils";
import { recordVendorRefund } from "@/lib/purchaseReturns";
import { useEffectiveStoreId } from "@/lib/useEffectiveStoreId";
import toast from "react-hot-toast";

const REASON_LABELS: Record<string, string> = {
  defective: "Defective",
  damaged_in_transit: "Damaged in Transit",
  wrong_item: "Wrong Item",
  other: "Other",
};

function RecordRefundCell({
  purchaseReturn,
  onRecorded,
}: {
  purchaseReturn: PurchaseReturn;
  onRecorded: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [amount, setAmount] = useState(purchaseReturn.refund_balance);
  const [loading, setLoading] = useState(false);

  if (purchaseReturn.refund_balance <= 0) {
    return (
      <span className="text-xs text-emerald-600 font-medium">
        Fully refunded
      </span>
    );
  }

  if (!editing) {
    return (
      <button
        onClick={() => setEditing(true)}
        className="text-xs font-medium text-blue-600 hover:underline"
      >
        Record refund
      </button>
    );
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      await recordVendorRefund(purchaseReturn.id, amount);
      toast.success("Refund recorded");
      onRecorded();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        max={purchaseReturn.refund_balance}
        min={1}
        className="w-20 px-2 py-1 border border-gray-200 rounded text-xs"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="text-xs bg-blue-600 text-white px-2 py-1 rounded disabled:opacity-60"
      >
        {loading ? "..." : "Save"}
      </button>
    </div>
  );
}

export default function VendorReturnsPage() {
  const storeId = useEffectiveStoreId();
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [summary, setSummary] = useState<PurchaseReturnsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  function loadData() {
    setLoading(true);
    Promise.all([
      getPurchaseReturns(storeId),
      getPurchaseReturnsSummary(storeId),
    ])
      .then(([returnsData, summaryData]) => {
        setReturns(returnsData);
        setSummary(summaryData);
      })
      .catch(() => toast.error("Failed to load vendor returns"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadData();
  }, [storeId]);

  const totalOutstandingRefunds = returns.reduce(
    (sum, r) => sum + r.refund_balance,
    0,
  );

  const columns: Column<PurchaseReturn>[] = [
    { header: "Purchase", render: (r) => r.purchase_title ?? "—" },
    { header: "Vendor", render: (r) => r.vendor ?? "—" },
    { header: "Product", render: (r) => r.product_name ?? "—" },
    { header: "Quantity", render: (r) => r.quantity },
    { header: "Refund Due", render: (r) => formatCurrency(r.refund_amount) },
    { header: "Refunded", render: (r) => formatCurrency(r.refunded_amount) },
    { header: "Outstanding", render: (r) => formatCurrency(r.refund_balance) },
    {
      header: "Action",
      render: (r) => (
        <RecordRefundCell purchaseReturn={r} onRecorded={loadData} />
      ),
    },
    { header: "Reason", render: (r) => REASON_LABELS[r.reason] ?? r.reason },
    { header: "Processed By", render: (r) => r.processed_by ?? "—" },
    { header: "Date", render: (r) => formatDate(r.created_at) },
  ];

  return (
    <>
      <Topbar title="Vendor Returns" />
      <div className="p-6 space-y-6">
        <p className="text-sm text-gray-500">
          Products returned to suppliers due to defects, damage, or delivery
          errors
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Returns"
            value={summary?.total_returns ?? "—"}
            icon={RotateCcw}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Units Returned"
            value={summary?.total_units_returned ?? "—"}
            icon={Package}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
          <StatCard
            label="Total Refunded"
            value={summary ? formatCurrency(summary.total_refund_amount) : "—"}
            isCurrency
            icon={Wallet}
            iconColor="#10b981"
            iconBg="#ecfdf5"
          />
          <StatCard
            label="Outstanding Refunds"
            value={formatCurrency(totalOutstandingRefunds)}
            isCurrency
            icon={AlertCircle}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
        </div>

        <DataTable
          columns={columns}
          data={returns}
          loading={loading}
          emptyMessage="No vendor returns recorded yet"
        />
      </div>
    </>
  );
}
