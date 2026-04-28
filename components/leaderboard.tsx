"use client"

import { useState, useEffect } from "react"

interface LeaderboardEntry {
  rank: number
  name: string
  xp: number
  lessons: number
  streak: number
  avatar: string
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Nguyễn Văn A", xp: 2500, lessons: 8, streak: 15, avatar: "👨" },
  { rank: 2, name: "Trần Thị B", xp: 2200, lessons: 7, streak: 12, avatar: "👩" },
  { rank: 3, name: "Lê Văn C", xp: 1800, lessons: 6, streak: 10, avatar: "👨" },
  { rank: 4, name: "Phạm Thị D", xp: 1500, lessons: 5, streak: 8, avatar: "👩" },
  { rank: 5, name: "Bạn", xp: 1000, lessons: 4, streak: 5, avatar: "🧑" }
]

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLeaderboard(MOCK_LEADERBOARD)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">⏳ Đang tải bảng xếp hạng...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">🏆 Bảng Xếp Hạng</h2>
      
      <div className="space-y-2">
        {leaderboard.map((entry) => (
          <div
            key={entry.rank}
            className={`flex items-center justify-between p-4 rounded-lg ${
              entry.rank === 1
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white"
                : entry.rank === 2
                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-white"
                : entry.rank === 3
                ? "bg-gradient-to-r from-orange-300 to-orange-400 text-white"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold w-8 text-center">
                {entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : `#${entry.rank}`}
              </span>
              <span className="text-2xl">{entry.avatar}</span>
              <div>
                <p className="font-semibold">{entry.name}</p>
                <p className="text-sm opacity-75">⭐ {entry.xp} XP • 📚 {entry.lessons} bài • 🔥 {entry.streak} ngày</p>
              </div>
            </div>
            <span className="text-lg font-bold">{entry.xp}</span>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <p className="text-sm text-blue-900">
          💡 <strong>Mẹo:</strong> Hoàn thành bài học, đạt streak cao và cải thiện độ chính xác để leo lên bảng xếp hạng!
        </p>
      </div>
    </div>
  )
}
