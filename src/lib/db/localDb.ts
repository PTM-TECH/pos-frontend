import { openDB, DBSchema, IDBPDatabase } from 'idb'
import { Product } from '@/types'

export interface QueuedSale {
  localId: string          
  payload: any  
  status: 'pending' | 'syncing' | 'synced' | 'failed'
  createdAt: string
  syncedAt?: string
  errorMessage?: string
}

interface PapoPOSDB extends DBSchema {
  products: {
    key: number
    value: Product
    indexes: { 'by-code': string }
  }
  meta: {
    key: string
    value: { key: string; value: any }
  }
  salesQueue: {
    key: string
    value: QueuedSale
    indexes: { 'by-status': string }
  }
}

let dbInstance: IDBPDatabase<PapoPOSDB> | null = null

export async function getDb(): Promise<IDBPDatabase<PapoPOSDB>> {
  if (dbInstance) return dbInstance

  dbInstance = await openDB<PapoPOSDB>('papopos-offline', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const productStore = db.createObjectStore('products', { keyPath: 'id' })
        productStore.createIndex('by-code', 'code')
        db.createObjectStore('meta', { keyPath: 'key' })
      }
      if (oldVersion < 2) {
        const queueStore = db.createObjectStore('salesQueue', { keyPath: 'localId' })
        queueStore.createIndex('by-status', 'status')
      }
    },
  })

  return dbInstance
}