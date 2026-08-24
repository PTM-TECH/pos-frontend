
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PapoPOS System',
  description: 'Point of Sale and Inventory Management System',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}
export const viewport: Viewport = {
  themeColor: '#059669',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '8px',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  )
}