
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'



const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POS System',
  description: 'Point of Sale and Inventory Management System',
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