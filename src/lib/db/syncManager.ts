import { syncQueuedSales } from './salesQueue'

type SyncListener = (result: { succeeded: number; failed: number }) => void

let listeners: SyncListener[] = []
let isSyncing = false

export function onSyncComplete(listener: SyncListener) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

async function runSync() {
  if (isSyncing) return 
  isSyncing = true
  try {
    const result = await syncQueuedSales()
    if (result.succeeded > 0 || result.failed > 0) {
      listeners.forEach((l) => l(result))
    }
  } finally {
    isSyncing = false
  }
}

export function initSyncManager() {
  if (typeof window === 'undefined') return


  window.addEventListener('online', runSync)

  if (navigator.onLine) {
    runSync()
  }
}

export { runSync as triggerSync }