"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, X } from "lucide-react";
import { getMySubscription } from "@/lib/tenants";
import { useAuthStore } from "@/store/authStore";

const WARNING_THRESHOLD_DAYS = 3;

export default function TrialBanner() {
  const member = useAuthStore((state) => state.member);
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only owners/admins need to see billing nudges — cashiers/stockists don't manage subscriptions
    if (!member || !["owner", "admin"].includes(member.role ?? "")) return;

    getMySubscription()
      .then((tenant) => {
        const sub = tenant?.subscription;
        if (!sub?.end_date || !["trial", "active"].includes(sub.status)) return;

        const end = new Date(sub.end_date).getTime();
        const now = Date.now();
        const remaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));

        setDaysLeft(remaining);
        setStatus(sub.status);
      })
      .catch(() => {});
  }, [member]);

  if (dismissed) return null;
  if (daysLeft === null || daysLeft > WARNING_THRESHOLD_DAYS || daysLeft < 0)
    return null;

  const label =
    status === "trial"
      ? daysLeft === 0
        ? "Your free trial ends today"
        : `Your free trial ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`
      : daysLeft === 0
        ? "Your subscription renews today"
        : `Your subscription renews in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between gap-3 lg:pl-64">
      <div className="flex items-center gap-2 text-sm text-amber-800">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>{label}. Renew now to avoid interruption.</span>
        <Link
          href="/billing"
          className="font-semibold underline hover:no-underline shrink-0"
        >
          Manage billing
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-600 hover:text-amber-800 shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
