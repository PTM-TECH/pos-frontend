'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, FolderPlus, Wallet, Receipt as ReceiptIcon } from 'lucide-react'
import Topbar from '@/components/shared/Topbar'
import StatCard from '@/components/dashboard/StatCard'
import DataTable, { Column } from '@/components/ui/DataTable'
import ExpenseFormModal from '@/components/dashboard/ExpenseFormModal'
import ExpenseCategoryFormModal from '@/components/dashboard/ExpenseCategoryFormModal'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ExportButton from '@/components/shared/ExportButton'
import { exportExpenses } from '@/lib/reports'
import {
  getExpenses,
  getExpenseSummary,
  getExpenseCategories,
  deleteExpense,
  Expense,
  ExpenseCategory,
  ExpenseSummary,
} from '@/lib/expenses'
import { formatCurrency, formatDateShort, getErrorMessage } from '@/lib/utils'
import { useEffectiveStoreId } from '@/lib/useEffectiveStoreId'
import toast from 'react-hot-toast'

export default function ExpensesPage() {
  const storeId = useEffectiveStoreId()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<ExpenseCategory[]>([])
  const [summary, setSummary] = useState<ExpenseSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Expense | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null)
  const [deleting, setDeleting] = useState(false)

  async function loadData() {
    setLoading(true)
    try {
      const [expensesData, summaryData, categoriesData] = await Promise.all([
        getExpenses(storeId),
        getExpenseSummary(storeId),
        getExpenseCategories(),
      ])
      setExpenses(expensesData)
      setSummary(summaryData)
      setCategories(categoriesData)
    } catch {
      toast.error('Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [storeId])

  async function handleExport(format: 'xlsx' | 'pdf') {
    await exportExpenses({ format, store_id: storeId })
    toast.success('Export downloaded')
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteExpense(deleteTarget.id)
      toast.success('Expense deleted')
      setDeleteTarget(null)
      loadData()
    } catch (err: any) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  const topCategory = summary?.by_category?.slice().sort((a, b) => b.total - a.total)[0]

  const columns: Column<Expense>[] = [
    {
      header: 'Title',
      render: (e) => (
        <div>
          <p className="font-medium text-gray-900">{e.title}</p>
          {e.description && <p className="text-xs text-gray-500 truncate max-w-xs">{e.description}</p>}
        </div>
      ),
    },
    { header: 'Category', render: (e) => e.category ?? 'Uncategorized' },
    { header: 'Store', render: (e) => e.store ?? 'All stores' },
    { header: 'Recorded by', render: (e) => e.member ?? '—' },
    { header: 'Amount', render: (e) => formatCurrency(e.amount) },
    { header: 'Date', render: (e) => formatDateShort(e.date) },
    {
      header: 'Action',
      render: (e) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditing(e)
              setShowModal(true)
            }}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-gray-50"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeleteTarget(e)}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center
                       text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <Topbar title="Expenses" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Track and categorize your business expenses</p>
          <div className="flex gap-2">
            <ExportButton onExport={handleExport} />
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
                setEditing(null)
                setShowModal(true)
              }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5
                         rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record Expense
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total Expenses"
            value={summary ? formatCurrency(summary.total) : '—'}
            icon={Wallet}
            iconColor="#ef4444"
            iconBg="#fef2f2"
          />
          <StatCard
            label="Entries Recorded"
            value={summary?.count ?? '—'}
            icon={ReceiptIcon}
            iconColor="#3b82f6"
            iconBg="#eff6ff"
          />
          <StatCard
            label="Top Category"
            value={topCategory ? `${topCategory.category}` : '—'}
            icon={Wallet}
            iconColor="#f59e0b"
            iconBg="#fffbeb"
          />
        </div>

        <DataTable
          columns={columns}
          data={expenses}
          loading={loading}
          emptyMessage="No expenses recorded yet"
        />
      </div>

      {showModal && (
        <ExpenseFormModal
          expense={editing}
          categories={categories}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false)
            loadData()
          }}
        />
      )}

      {showCategoryModal && (
        <ExpenseCategoryFormModal
          onClose={() => setShowCategoryModal(false)}
          onSaved={() => {
            setShowCategoryModal(false)
            loadData()
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Expense"
          message={`Are you sure you want to delete "${deleteTarget.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  )
}