"use client";

import { WifiOff } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-sm">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <WifiOff className="w-6 h-6 text-amber-600" />
        </div>
        <h1 className="text-lg font-semibold text-gray-900 mb-2">
          You&apos;re offline
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This page hasn&apos;t been loaded before, so it can&apos;t be shown
          offline. Reconnect to the internet and try again — pages you&apos;ve
          already visited will keep working offline once loaded.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-700"
        >
          Try Dashboard
        </Link>
      </div>
    </div>
  );
}
