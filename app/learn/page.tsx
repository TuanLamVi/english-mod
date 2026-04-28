"use client"

import { lessons } from "@/lib/lesson-data"
import Quiz from "@/components/quiz"
import { payWithPi, checkPremiumStatus, setPremiumStatus } from "@/lib/pi-payment-simplified"
import { useState, useEffect } from "react"

export default function LearnPage() {
  const [premium, setPremium] = useState(false)
  const [loading, setLoading] = useState(true)
  const [xp, setXP] = useState(0)
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    // Kiểm tra trạng thái Premium khi mount
    const isPremium = checkPremiumStatus()
    setPremium(isPremium)
    
    // Lấy XP từ localStorage
    const savedXP = Number(localStorage.getItem("xp") || 0)
    setXP(savedXP)
    
    setLoading(false)
  }, [])

  const handleUnlock = async (lessonId: number) => {
    setPaying(true)
    try {
      const success = await payWithPi(1)
      if (success) {
        setPremiumStatus(true)
        setPremium(true)
        alert("🎉 Đã mở khóa Premium!")
      } else {
        alert("❌ Thanh toán thất bại. Vui lòng thử lại.")
      }
    } catch (error) {
      console.error("Payment error:", error)
      alert("❌ Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setPaying(false)
    }
  }

  if (loading) {
    return (
      <main className="p-6 text-center">
        <p className="text-lg text-gray-600">⏳ Đang tải...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-4xl font-bold mb-2">📚 Học Tiếng Anh</h1>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Tổng XP</p>
            <p className="text-2xl font-bold text-yellow-500">⭐ {xp}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Trạng thái</p>
            <p className="text-lg font-bold">{premium ? "💎 Premium" : "🆓 Free"}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-gray-600 text-sm">Bài học</p>
            <p className="text-2xl font-bold text-blue-500">{lessons.length}</p>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="max-w-2xl mx-auto space-y-4">
        {lessons.map((lesson, index) => {
          const isLocked = !premium && index > 0
          
          return (
            <div
              key={lesson.id}
              className={`rounded-lg p-6 ${
                isLocked
                  ? "bg-gray-200 opacity-60"
                  : "bg-white shadow-lg hover:shadow-xl transition"
              }`}
            >
              {/* Lesson Header */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold">
                  {index === 0 ? "✅" : index < 3 ? "📖" : index < 6 ? "📝" : "🎯"} {lesson.title}
                </h2>
                <span className="text-sm font-semibold text-yellow-600">
                  +{lesson.xp} XP
                </span>
              </div>

              {/* Lesson Info */}
              <p className="text-gray-600 text-sm mb-4">
                {lesson.questions.length} câu hỏi • {Math.ceil(lesson.questions.length * 2)} phút
              </p>

              {/* Locked Badge */}
              {isLocked ? (
                <div className="space-y-3">
                  <p className="text-center text-gray-700 font-semibold">
                    🔒 Bài này cần Premium
                  </p>
                  <button
                    onClick={() => handleUnlock(lesson.id)}
                    disabled={paying}
                    className={`w-full py-3 rounded-lg font-semibold transition ${
                      paying
                        ? "bg-gray-400 cursor-not-allowed text-gray-600"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white"
                    }`}
                  >
                    {paying ? "⏳ Đang xử lý..." : "💎 Mở khóa (1 Pi)"}
                  </button>
                </div>
              ) : (
                <Quiz key={lesson.id} lesson={lesson} />
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-12 text-center text-gray-600 text-sm">
        <p>💡 Mỗi bài học hoàn thành = +XP • Tích lũy XP để mở khóa bài tiếp theo</p>
        <p className="mt-2">🚀 Tiếp tục học để trở thành nhà vô địch tiếng Anh!</p>
      </div>
    </main>
  )
}
