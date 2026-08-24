'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ScanLine, CameraOff } from 'lucide-react'

export default function QRScannerModal({
  onScan,
  onClose,
}: {
  onScan: (code: string) => void
  onClose: () => void
}) {
  const scannerRef = useRef<any>(null)
  const [error, setError] = useState('')
  const [ready, setReady] = useState(false)
  const [cameras, setCameras] = useState<{ id: string; label: string }[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>('')

  // Step 1: enumerate available cameras once, on mount
  useEffect(() => {
    let isMounted = true

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!isMounted) return

      Html5Qrcode.getCameras()
        .then((devices) => {
          if (!isMounted) return
          if (devices.length === 0) {
            setError('No camera found. Connect a camera and try again.')
            return
          }
          setCameras(devices)
          // Prefer a camera not labeled "front"/"user" (i.e. prefer an external/rear one)
          const preferred = devices.find((d) => !/front|user/i.test(d.label)) ?? devices[0]
          setSelectedCamera(preferred.id)
        })
        .catch(() => {
          if (isMounted) setError('Could not list cameras. Check browser permissions.')
        })
    })

    return () => {
      isMounted = false
    }
  }, [])

  // Step 2: start/restart scanning whenever the selected camera changes
  useEffect(() => {
    if (!selectedCamera) return
    let isMounted = true

    import('html5-qrcode').then(({ Html5Qrcode }) => {
      if (!isMounted) return

      scannerRef.current?.stop().catch(() => {})

      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      scanner
        .start(
          selectedCamera,
          { fps: 10, qrbox: { width: 300, height: 300 } },
          (decodedText: string) => {
            scanner.stop().catch(() => {})
            onScan(decodedText)
          },
          () => {} // per-frame no-match — ignore
        )
        .then(() => {
          if (isMounted) setReady(true)
        })
        .catch(() => {
          if (isMounted) setError('Could not start the selected camera.')
        })
    })

    return () => {
      isMounted = false
      scannerRef.current?.stop().catch(() => {})
    }
  }, [selectedCamera, onScan])

  function handleClose() {
    scannerRef.current?.stop().catch(() => {})
    onClose()
  }

  function handleCameraChange(id: string) {
    setReady(false)
    setSelectedCamera(id)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ScanLine className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-gray-900">Scan product code</h2>
          </div>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {cameras.length > 1 && (
            <select
              value={selectedCamera}
              onChange={(e) => handleCameraChange(e.target.value)}
              className="w-full mb-3 px-3 py-2 border border-gray-200 rounded-lg text-sm
                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {cameras.map((cam) => (
                <option key={cam.id} value={cam.id}>
                  {cam.label || `Camera ${cam.id}`}
                </option>
              ))}
            </select>
          )}

          {error ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CameraOff className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : (
            <>
              <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
              {!ready && (
                <p className="text-xs text-gray-400 text-center mt-3">Starting camera...</p>
              )}
            </>
          )}
          <p className="text-xs text-gray-400 text-center mt-3">
            Point the camera at a product&apos;s QR code or barcode
          </p>
        </div>
      </div>
    </div>
  )
}