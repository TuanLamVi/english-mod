"use client"

import StatsDashboard from "@/components/stats-dashboard"
import AchievementsDisplay from "@/components/achievements-display"
import Leaderboard from "@/components/leaderboard"
import { useState } from "react"

export default function StatsPage() {
  const [activeTab, setActiveTab] = useState<"stats" | "achievements" | "leaderboard">("stats")

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">📈 Thống Kê & Thành Tích</h1>
          <p className="text-gray-600">Xem tiến độ học tập của bạn</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("stats")}
            className={`pb-3 font-semibold transition ${
              activeTab === "stats"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📊 Thống Kê
          </button>
          <button
            onClick={() => setActiveTab("achievements")}
            className={`pb-3 font-semibold transition ${
              activeTab === "achievements"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏅 Thành Tích
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`pb-3 font-semibold transition ${
              activeTab === "leaderboard"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            🏆 Bảng Xếp Hạng
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === "stats" && <StatsDashboard />}
          {activeTab === "achievements" && <AchievementsDisplay />}
          {activeTab === "leaderboard" && <Leaderboard />}
        </div>
      </div>
    </main>
  )
}
