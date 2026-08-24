'use client'

import Link from 'next/link'


export default function AuthSplitLayout({
  children,
  imageSrc = '/authimage.jpeg',
}: {
  children: React.ReactNode
  imageSrc?: string
}) {
  return (
    <div className="min-h-screen flex">
      
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-900">
        <img
          src={imageSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />
        <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 z-10">
          <img src="/logo.png" alt="PapoPOS" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-white text-sm">PapoPOS</span>
        </Link>
      </div>

      {/* Right: form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white overflow-y-auto">
        {children}
      </div>
    </div>
  )
}