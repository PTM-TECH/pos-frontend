import { getDb, QueuedSale } from './localDb'
import { createSale, CreateSalePayload } from '@/lib/sales'

function generateLocalId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function queueSaleOffline(payload: CreateSalePayload): Promise<QueuedSale> {
  const db = await getDb()
  const entry: QueuedSale = {
    localId: generateLocalId(),
    payload,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
  await db.put('salesQueue', entry)
  return entry
}

export async function getQueuedSales(): Promise<QueuedSale[]> {
  const db = await getDb()
  return db.getAll('salesQueue')
}

export async function getPendingSaleCount(): Promise<number> {
  const db = await getDb()
  const pending = await db.getAllFromIndex('salesQueue', 'by-status', 'pending')
  const failed = await db.getAllFromIndex('salesQueue', 'by-status', 'failed')
  return pending.length + failed.length
}

export async function updateQueuedSale(localId: string, updates: Partial<QueuedSale>): Promise<void> {
  const db = await getDb()
  const existing = await db.get('salesQueue', localId)
  if (!existing) return
  await db.put('salesQueue', { ...existing, ...updates })
}

export async function removeQueuedSale(localId: string): Promise<void> {
  const db = await getDb()
  await db.delete('salesQueue', localId)
}
export async function syncQueuedSales(): Promise<{ succeeded: number; failed: number }> {
  const db = await getDb()
  const toSync = [
    ...(await db.getAllFromIndex('salesQueue', 'by-status', 'pending')),
    ...(await db.getAllFromIndex('salesQueue', 'by-status', 'failed')),
  ]

  let succeeded = 0
  let failed = 0

  for (const item of toSync) {
    await updateQueuedSale(item.localId, { status: 'syncing' })
    try {
      await createSale(item.payload)
      await updateQueuedSale(item.localId, { status: 'synced', syncedAt: new Date().toISOString() })
      await removeQueuedSale(item.localId)
      succeeded++
    } catch (err: any) {
      
      const message = err?.response?.data?.message || 'Sync failed'
      await updateQueuedSale(item.localId, { status: 'failed', errorMessage: message })
      failed++
    }
  }

  return { succeeded, failed }
}