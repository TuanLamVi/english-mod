// app/learn-new/page.tsx
'use client'

import { useState } from 'react'
import LevelSelector from '@/components/level-selector'
import AIChatTutor from '@/components/ai-tutor-chat'
import PiWalletDisplay from '@/components/pi-wallet'
import Quiz from '@/components/quiz'
import { getLessonsByLevel } from '@/lib/learning-levels'
import { calculatePiReward, MOCK_PI_LEADERBOARD } from '@/lib/pi-system'
import { calculateLevel, addXP, updateStreak } from '@/lib/gamification'
import type { Level } from '@/lib/learning-levels'

export default function NewLearnPage() {
  const [currentLevel, setCurrentLevel] = useState<Level>('A1')
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [showAITutor, setShowAITutor] = useState(false)
  const [xp, setXP] = useState(245)
  const [streak, setStreak] = useState(7)
  const [piWallet] = useState({ totalEarned: 12.5, totalClaimed: 8.0, pending: 4.5 })

  const lessons = getLessonsByLevel(currentLevel)
  const currentLesson = lessons[currentLessonIndex]

  const handleLessonComplete = (isCorrect: boolean) => {
    if (!isCorrect) return
    // Logic XP, streak, Pi... (giữ nguyên hoặc cải tiến sau)
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1)
    } else {
      alert('🎉 Hoàn thành cấp độ này!')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pb-12">
      {/* Top Navigation Bar - Đẹp hơn */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📘</div>
            <div>
              <h1 className="font-bold text-2xl tracking-tight">English Mod</h1>
              <p className="text-xs text-gray-500 -mt-1">Học tiếng Anh thông minh</p>
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm font-medium">
            <a href="/learn" className="hover:text-blue-600 transition">Học</a>
            <a href="/stats" className="hover:text-blue-600 transition">Thống kê</a>
            <a href="/about" className="hover:text-blue-600 transition">Về chúng tôi</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <span className="text-xl">🔥</span>
              <span className="font-semibold">{streak} ngày</span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">XP</p>
              <p className="font-bold text-lg">{xp}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Main Learning Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Level Selector */}
          <div className="bg-white rounded-3xl shadow-sm p-8">
            <LevelSelector 
              currentLevel={currentLevel} 
              onSelectLevel={(level) => {
                setCurrentLevel(level)
                setCurrentLessonIndex(0)
              }} 
            />
          </div>

          {/* Current Lesson Card */}
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
            <div className="px-8 pt-8 pb-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-sm font-medium px-4 py-1.5 rounded-full">
                    Bài {currentLessonIndex + 1} / {lessons.length}
                  </div>
                  <h2 className="text-3xl font-bold mt-4">{currentLesson?.title}</h2>
                  <p className="text-gray-600 mt-2 text-lg">{currentLesson?.description}</p>
                </div>

                <button
                  onClick={() => setShowAITutor(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-2xl hover:scale-105 transition font-medium"
                >
                  🤖 AI Tutor
                </button>
              </div>
            </div>

            {/* Lesson Content Area */}
            <div className="p-8">
              {currentLesson?.type === 'vocabulary' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold flex items-center gap-3">
                    📝 Từ vựng
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sẽ cải tiến component VocabularyCard sau */}
                    {['hello', 'goodbye', 'thank you', 'sorry', 'please'].map((word) => (
                      <div key={word} className="bg-gray-50 hover:bg-white border border-gray-100 p-6 rounded-2xl transition-all hover:shadow">
                        <p className="text-2xl font-semibold capitalize">{word}</p>
                        <p className="text-gray-500 mt-1">Xin chào</p>
                        <button className="mt-4 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2">
                          🔊 Nghe phát âm
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentLesson?.type === 'quiz' && (
                <Quiz lesson={currentLesson} onComplete={handleLessonComplete} />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <PiWalletDisplay wallet={piWallet} recentEvents={[]} />

          {/* Leaderboard */}
          <div className="bg-white rounded-3xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              🏆 Bảng xếp hạng Pi
            </h3>
            <div className="space-y-3">
              {MOCK_PI_LEADERBOARD.slice(0, 5).map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}</span>
                    <div>
                      <p className="font-medium">{entry.username}</p>
                    </div>
                  </div>
                  <div className="font-semibold text-emerald-600">💰 {entry.totalPi}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Tutor Modal */}
      {showAITutor && (
        <AIChatTutor
          difficulty="beginner"
          topic={currentLesson?.title || ''}
          onClose={() => setShowAITutor(false)}
        />
      )}
    </main>
  )
}
