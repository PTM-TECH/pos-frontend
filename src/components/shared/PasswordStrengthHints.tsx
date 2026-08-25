'use client'

import { Check, X } from 'lucide-react'
import { checkPasswordStrength } from '@/lib/passwordValidator'

export default function PasswordStrengthHints({ password }: { password: string }) {
  if (!password) return null

  const checks = checkPasswordStrength(password)

  return (
    <div className="mt-1.5 space-y-1">
      {checks.map((check) => (
        <div key={check.label} className="flex items-center gap-1.5 text-xs">
          {check.valid ? (
            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
          ) : (
            <X className="w-3 h-3 text-gray-300 shrink-0" />
          )}
          <span className={check.valid ? 'text-emerald-600' : 'text-gray-400'}>
            {check.label}
          </span>
        </div>
      ))}
    </div>
  )
}