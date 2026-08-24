'use client'

import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { getChallenge } from '@/lib/auth'

export default function SecurityChallenge({
  onChange,
}: {
  onChange: (token: string, answer: string) => void
}) {
  const [code, setCode] = useState('')
  const [token, setToken] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)

  async function fetchChallenge() {
    setLoading(true)
    try {
      const data = await getChallenge()
      setCode(data.code)
      setToken(data.token)
      setAnswer('')
    } catch {
        
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchChallenge()
  }, [])

  useEffect(() => {
    onChange(token, answer)
  }, [token, answer]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Security Challenge
      </label>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg py-2.5 text-center
                        font-mono font-bold tracking-[0.3em] text-gray-800 select-none">
          {loading ? '......' : code}
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg
                     text-gray-500 hover:bg-gray-50 shrink-0"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <input
        type="text"
        required
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type challenge exactly as shown"
        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm
                   focus:outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  )
}