'use client'

import { useState } from 'react'
import { LEVEL_INFO, getAllLevels, getLessonsByLevel } from '@/lib/learning-levels'
import type { Level } from '@/lib/learning-levels'

interface LevelSelectorProps {
  currentLevel?: Level
  onSelectLevel: (level: Level) => void
}

export default function LevelSelector({ currentLevel = 'A1', onSelectLevel }: LevelSelectorProps) {
  const levels = getAllLevels()
  const [expanded, setExpanded] = useState<Level | null>(null)

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold mb-4">📚 Chọn Cấp Độ</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {levels.map((level) => {
          const info = LEVEL_INFO[level]
          const lessons = getLessonsByLevel(level)
          const isSelected = currentLevel === level
          const isExpanded = expanded === level

          return (
            <div key={level}>
              <button
                onClick={() => {
                  onSelectLevel(level)
                  setExpanded(isExpanded ? null : level)
                }}
                className={`w-full p-4 rounded-lg transition transform ${
                  isSelected
                    ? `bg-gradient-to-br ${info.color} text-white shadow-lg scale-105`
                    : 'bg-white border-2 border-gray-300 hover:border-blue-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-2xl">{info.icon}</p>
                    <p className="font-bold text-sm mt-1">{info.name}</p>
                    <p className="text-xs opacity-75 mt-1">{info.code}</p>
                  </div>
                  <div className="text-right text-xs">
                    <p>📖 {lessons.length} bài</p>
                    <p>⏱️ {info.estimatedHours}h</p>
                  </div>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div className="bg-gray-50 p-4 rounded-lg mt-2 space-y-2 text-sm">
                  <p className="font-semibold">{info.description}</p>
                  <p>📝 {info.wordsToLearn} từ mới</p>
                  <button
                    onClick={() => onSelectLevel(level)}
                    className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded transition"
                  >
                    Bắt đầu học Level {info.code}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
