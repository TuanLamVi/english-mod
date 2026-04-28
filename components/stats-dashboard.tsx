"use client"

import { useState, useEffect } from "react"
import { getUserStats } from "@/lib/analytics"
import type { UserStats } from "@/lib/analytics"

export default function StatsDashboard() {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = getUserStats()
    setStats(data)
    setLoading(false)
  }, [])

  if (loading || !stats) {
    return <p className="text-gray-600">⏳ Đang tải thống kê...</p>
  }

  const daysSinceJoin = Math.floor(
    (new Date().getTime() - new Date(stats.joinDate).getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📊 Thống Kê Của Bạn</h2>

      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Tổng XP</p>
          <p className="text-3xl font-bold">⭐ {stats.totalXP}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Bài Hoàn Thành</p>
          <p className="text-3xl font-bold">📚 {stats.lessonsCompleted}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Độ Chính Xác</p>
          <p className="text-3xl font-bold">{stats.accuracy}%</p>
        </div>
        <div className="bg-gradient-to-br from-red-400 to-red-500 rounded-lg p-4 text-white">
          <p className="text-sm opacity-90">Streak Hiện Tại</p>
          <p className="text-3xl font-bold">🔥 {stats.currentStreak}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Câu Hỏi Trả Lời</p>
          <p className="text-2xl font-bold">{stats.questionsAnswered}</p>
          <p className="text-xs text-gray-500 mt-2">
            ✅ Đúng: {stats.correctAnswers}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Longest Streak</p>
          <p className="text-2xl font-bold">🏆 {stats.longestStreak}</p>
          <p className="text-xs text-gray-500 mt-2">
            Từng đạt được
          </p>
        </div>
      </div>

      {/* Join Date */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Ngày Tham Gia</p>
        <p className="font-semibold mt-1">{new Date(stats.joinDate).toLocaleDateString('vi-VN')}</p>
        <p className="text-xs text-gray-500 mt-2">Bạn đã học {daysSinceJoin} ngày trên platform này 🎓</p>
      </div>
    </div>
  )
}
