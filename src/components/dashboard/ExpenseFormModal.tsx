"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  Expense,
  ExpenseCategory,
  createExpense,
  updateExpense,
} from "@/lib/expenses";
import { getErrorMessage } from "@/lib/utils";
import { useEffectiveStoreId } from "@/lib/useEffectiveStoreId";
import toast from "react-hot-toast";
import { selectOnFocus } from "@/lib/formHelpers";

export default function ExpenseFormModal({
  expense,
  categories,
  onClose,
  onSaved,
}: {
  expense?: Expense | null;
  categories: ExpenseCategory[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const storeId = useEffectiveStoreId();
  const isEdit = !!expense;

  const [title, setTitle] = useState(expense?.title ?? "");
  const [description, setDescription] = useState(expense?.description ?? "");
  const [amount, setAmount] = useState(expense?.amount ?? 0);
  const [categoryId, setCategoryId] = useState<number | "">(
    expense?.category_id ?? "",
  );
  const [date, setDate] = useState(
    expense?.date
      ? expense.date.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      toast.error("Please fill in a title and a valid amount");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title,
        description: description || undefined,
        amount,
        category_id: categoryId === "" ? null : categoryId,
        date: new Date(date).toISOString(),
      };
      if (isEdit && expense) {
        await updateExpense(expense.id, payload);
        toast.success("Expense updated successfully");
      } else {
        await createExpense({ ...payload, store_id: storeId ?? undefined });
        toast.success("Expense recorded successfully");
      }
      onSaved();
    } catch (err: any) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={isEdit ? "Edit Expense" : "Record Expense"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Shop rent — August"
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description <span className="text-gray-400">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Amount (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min={0}
              value={amount}
              onFocus={selectOnFocus}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                       focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-medium
                     hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Saving..." : isEdit ? "Update Expense" : "Record Expense"}
        </button>
      </form>
    </Modal>
  );
}
