'use client'

import { useState, useEffect } from 'react'
import LevelSelector from '@/components/level-selector'
import AIChatTutor from '@/components/ai-tutor-chat'
import PiWalletDisplay from '@/components/pi-wallet'
import Quiz from '@/components/quiz'
import { getLessonsByLevel } from '@/lib/learning-levels'
import { calculatePiReward, MOCK_PI_LEADERBOARD } from '@/lib/pi-system'
import { calculateLevel, addXP, updateStreak } from '@/lib/gamification'
import type { Level } from '@/lib/learning-levels'
import type { PiWallet, PiEarningEvent } from '@/lib/pi-system'

export default function NewLearnPage() {
  const [currentLevel, setCurrentLevel] = useState<Level>('A1')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [showAITutor, setShowAITutor] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [xp, setXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [streak, setStreak] = useState(0)
  const [piWallet, setPiWallet] = useState<PiWallet>({
    totalEarned: 0,
    totalClaimed: 0,
    pending: 0,
    lastEarned: new Date().toISOString(),
    earningRate: 0.5,
    level: 1
  })
  const [piEvents, setPiEvents] = useState<PiEarningEvent[]>([])

  const lessons = getLessonsByLevel(currentLevel)
  const currentLesson = lessons[currentLessonIndex]

  const handleLessonComplete = (isCorrect: boolean) => {
    if (!isCorrect) return

    // Add XP
    const xpGain = 10
    const { newXP, levelUp } = addXP(xp, xpGain)
    setXP(newXP)
    setLevel(calculateLevel(newXP))

    // Update streak
    const streakChange = updateStreak(new Date().toISOString())
    if (streakChange >= 0) {
      setStreak(streak + streakChange)
    }

    // Calculate Pi reward
    const { pi, reason } = calculatePiReward(currentLevel, isCorrect, streak)
    setPiWallet((prev) => ({
      ...prev,
      totalEarned: prev.totalEarned + pi,
      pending: prev.pending + pi
    }))

    // Add event
    const event: PiEarningEvent = {
      id: `pi_${Date.now()}`,
      type: 'lesson',
      amount: pi,
      reason,
      timestamp: new Date(),
      multiplier: 1
    }
    setPiEvents((prev) => [event, ...prev.slice(0, 9)])

    // Move to next lesson or show completion
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      alert('🎉 Hoàn thành toàn bộ cấp độ!')
    }
  }

  if (!currentLesson) {
    return <div>Đang tải...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Top Bar */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <span className="text-2xl">📚</span>
            <div>
              <p className="font-bold text-lg">Level {level}</p>
              <p className="text-sm text-gray-600">{xp} XP</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold">🔥 {streak}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Pi</p>
              <p className="text-2xl font-bold">💰 {piWallet.totalEarned.toFixed(1)}</p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              📊
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Level Selector */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <LevelSelector currentLevel={currentLevel} onSelectLevel={(level) => {
              setCurrentLevel(level)
              setCurrentLessonIndex(0)
            }} />
          </div>

          {/* Current Lesson */}
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">
                  Bài {currentLessonIndex + 1}/{lessons.length}
                </p>
                <h2 className="text-2xl font-bold">{currentLesson.title}</h2>
                <p className="text-gray-600 mt-1">{currentLesson.description}</p>
              </div>
              <button
                onClick={() => setShowAITutor(!showAITutor)}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition text-sm"
              >
                🤖 AI Tutor
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded transition-all"
                style={{
                  width: `${((currentLessonIndex + 1) / lessons.length) * 100}%`
                }}
              />
            </div>

            {/* Lesson Content */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
              {currentLesson.type === 'vocabulary' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">📝 Vocabulary Words</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['hello', 'goodbye', 'thank you', 'sorry', 'please', 'yes'].map((word) => (
                      <div key={word} className="bg-white p-3 rounded-lg shadow hover:shadow-md transition">
                        <p className="font-semibold capitalize">{word}</p>
                        <p className="text-sm text-gray-600 mt-1">Xin chào</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentLesson.type === 'quiz' && (
                <Quiz lesson={{ ...currentLesson, xpReward: 10 }} onComplete={handleLessonComplete} />
              )}

              {currentLesson.type === 'listening' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">🎧 Listen and Choose</h3>
                  <div className="bg-white p-4 rounded-lg">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg w-full font-semibold">
                      ▶️ Play Audio
                    </button>
                    <div className="mt-4 space-y-2">
                      {['Option A', 'Option B', 'Option C'].map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleLessonComplete(Math.random() > 0.3)}
                          className="w-full p-3 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentLesson.type === 'grammar' && (
                <div className="space-y-3">
                  <h3 className="font-bold text-lg">📚 Grammar Lesson</h3>
                  <p className="text-gray-700">
                    Thì hiện tại đơn dùng để nói về sự thật hiển nhiên, thói quen hàng ngày...
                  </p>
                  <button
                    onClick={() => setShowAITutor(true)}
                    className="mt-3 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    🤖 Hỏi AI giải thích thêm
                  </button>
                  <button
                    onClick={() => handleLessonComplete(true)}
                    className="w-full mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold transition"
                  >
                    ✓ Hiểu rồi, tiếp tục
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Pi Wallet */}
          <PiWalletDisplay wallet={piWallet} recentEvents={piEvents} />

          {/* Leaderboard */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-bold text-lg mb-3">🏆 Leaderboard</h3>
            <div className="space-y-2">
              {MOCK_PI_LEADERBOARD.slice(0, 3).map((entry) => (
                <div key={entry.rank} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-semibold">
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'} {entry.username}
                  </span>
                  <span className="text-sm text-blue-600">💰 {entry.totalPi}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Chat */}
      {showAITutor && (
        <AIChatTutor
          difficulty="beginner"
          topic={currentLesson.title}
          onClose={() => setShowAITutor(false)}
        />
      )}
    </main>
  )
}
