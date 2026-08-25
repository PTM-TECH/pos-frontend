'use client'

import { useEffect } from 'react'
import toast from 'react-hot-toast'

export default function UpdatePrompt() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    navigator.serviceWorker.getRegistration().then((registration) => {
      if (!registration) return

      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (!newWorker) return

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            toast(
              (t) => (
                <div className="flex items-center gap-3">
                  <span className="text-sm">A new version is available</span>
                  <button
                    onClick={() => {
                      newWorker.postMessage({ type: 'SKIP_WAITING' })
                      window.location.reload()
                      toast.dismiss(t.id)
                    }}
                    className="text-xs font-semibold text-emerald-600 underline"
                  >
                    Refresh
                  </button>
                </div>
              ),
              { duration: Infinity }
            )
          }
        })
      })
    })
  }, [])

  return null
}