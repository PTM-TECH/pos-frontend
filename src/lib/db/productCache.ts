import { getDb } from './localDb'
import { getProducts } from '@/lib/inventory'
import { Product } from '@/types'

export async function refreshProductCache(storeId?: number): Promise<Product[]> {
  const products = await getProducts(storeId)
  const db = await getDb()

  const tx = db.transaction(['products', 'meta'], 'readwrite')
  await tx.objectStore('products').clear()
  for (const product of products) {
    await tx.objectStore('products').put(product)
  }
  await tx.objectStore('meta').put({ key: 'products_synced_at', value: new Date().toISOString() })
  await tx.done

  return products
}

export async function getCachedProducts(): Promise<Product[]> {
  const db = await getDb()
  return db.getAll('products')
}

export async function getCachedProductByCode(code: string): Promise<Product | undefined> {
  const db = await getDb()
  return db.getFromIndex('products', 'by-code', code)
}

export async function getProductCacheSyncTime(): Promise<string | null> {
  const db = await getDb()
  const entry = await db.get('meta', 'products_synced_at')
  return entry?.value ?? null
}