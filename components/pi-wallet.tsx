'use client'

import { useState, useEffect } from 'react'
import type { PiWallet, PiEarningEvent } from '@/lib/pi-system'
import { getEarningLevel } from '@/lib/pi-system'

interface PiWalletProps {
  wallet: PiWallet
  recentEvents: PiEarningEvent[]
}

export default function PiWalletDisplay({ wallet, recentEvents }: PiWalletProps) {
  const [animateValue, setAnimateValue] = useState(0)
  const level = getEarningLevel(wallet.totalEarned)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateValue((prev) => {
        if (prev >= wallet.totalEarned) return prev
        return Math.min(prev + 5, wallet.totalEarned)
      })
    }, 50)
    return () => clearInterval(interval)
  }, [wallet.totalEarned])

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 text-white space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm opacity-90">Tổng Pi Kiếm Được</p>
          <p className="text-4xl font-bold">🥧 {animateValue.toFixed(2)}</p>
        </div>
        <div className="text-5xl">💰</div>
      </div>

      {/* Level */}
      <div className="bg-white/20 rounded p-3">
        <p className="text-sm mb-2">Earning Level: {level}/5</p>
        <div className="w-full bg-white/30 rounded h-2">
          <div
            className="bg-white h-2 rounded transition-all"
            style={{ width: `${(level / 5) * 100}%` }}
          />
        </div>
        <p className="text-xs mt-2">Multiplier: {(1 + (level - 1) * 0.2).toFixed(1)}x</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/20 rounded p-3 text-center">
          <p className="text-xs opacity-90">Claimed</p>
          <p className="text-xl font-bold">💵 {wallet.totalClaimed.toFixed(2)}</p>
        </div>
        <div className="bg-white/20 rounded p-3 text-center">
          <p className="text-xs opacity-90">Pending</p>
          <p className="text-xl font-bold">⏳ {wallet.pending.toFixed(2)}</p>
        </div>
      </div>

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="bg-white/20 rounded p-3 space-y-2">
          <p className="text-sm font-semibold">📊 Gần Đây</p>
          <div className="space-y-1 max-h-24 overflow-y-auto text-xs">
            {recentEvents.slice(0, 5).map((event) => (
              <div key={event.id} className="flex justify-between">
                <span>{event.reason}</span>
                <span className="font-bold">+{event.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Claim Button */}
      <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition">
        💸 Claim Pi ({wallet.pending.toFixed(2)})
      </button>
    </div>
  )
}
