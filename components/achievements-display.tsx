"use client"

import { useState, useEffect } from "react"
import { getAchievements } from "@/lib/achievements"
import type { Achievement } from "@/lib/achievements"

export default function AchievementsDisplay() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getAchievements()
    setAchievements(data)
    setLoading(false)
  }, [])

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length

  if (loading) {
    return <p className="text-gray-600">⏳ Đang tải thành tích...</p>
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">🏅 Thành Tích</h2>
        <p className="text-gray-600 mb-4">
          Đã mở khóa {unlockedCount}/{totalCount} thành tích
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition ${
              achievement.unlocked
                ? "border-yellow-400 bg-yellow-50"
                : "border-gray-300 bg-gray-50 opacity-50"
            }`}
          >
            <p className="text-3xl mb-2">{achievement.icon}</p>
            <p className="font-bold text-sm">{achievement.title}</p>
            <p className="text-xs text-gray-600 mb-2">{achievement.description}</p>
            <p className="text-xs font-semibold">
              {achievement.unlocked ? "✅ Mở khóa" : "🔒 Khóa"} • +{achievement.reward} XP
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
