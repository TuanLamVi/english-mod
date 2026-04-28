'use client'

import { useState } from 'react'
import { LEVEL_INFO, getAllLevels, getLessonsByLevel } from '@/lib/learning-levels'
import type { Level } from '@/lib/learning-levels'

interface LevelSelectorProps {
  currentLevel: Level
  onSelectLevel: (level: Level) => void
}

export default function LevelSelector({ currentLevel, onSelectLevel }: LevelSelectorProps) {
  const levels = getAllLevels()
  const [hoveredLevel, setHoveredLevel] = useState<Level | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Chọn cấp độ</h2>
          <p className="text-gray-600 mt-1">Học theo trình độ CEFR chuẩn quốc tế</p>
        </div>
        <div className="text-sm text-gray-500">
          {levels.length} cấp độ • Tiến độ của bạn
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {levels.map((level) => {
          const info = LEVEL_INFO[level]
          const lessons = getLessonsByLevel(level)
          const isSelected = currentLevel === level
          const completedLessons = Math.floor(Math.random() * (lessons.length + 1)) // Tạm mock, sau sẽ lấy từ state thật
          const progress = Math.round((completedLessons / lessons.length) * 100)

          return (
            <button
              key={level}
              onClick={() => onSelectLevel(level)}
              onMouseEnter={() => setHoveredLevel(level)}
              onMouseLeave={() => setHoveredLevel(null)}
              className={`
                group relative overflow-hidden rounded-3xl border-2 transition-all duration-300
                ${isSelected 
                  ? 'border-blue-600 shadow-xl scale-[1.02]' 
                  : 'border-transparent hover:border-gray-200 hover:shadow-lg'
                }
                bg-white p-8 text-left
              `}
            >
              {/* Gradient Background Icon */}
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-5xl mb-6 transition-transform group-hover:scale-110
                ${info.color || 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                {info.icon}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{info.name}</h3>
                  <span className="text-lg font-mono font-semibold text-gray-400">{info.code}</span>
                </div>

                <p className="text-gray-600 line-clamp-2 min-h-[48px]">
                  {info.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">Tiến độ</span>
                    <span className="text-gray-500">{completedLessons}/{lessons.length} bài</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="pt-4 border-t flex items-center justify-between text-sm">
                  <div>
                    <span className="font-semibold">{lessons.length}</span>
                    <span className="text-gray-500"> bài học</span>
                  </div>
                  <div className="text-emerald-600 font-medium">
                    ~{info.estimatedHours}h
                  </div>
                </div>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-6 right-6 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow">
                  ĐANG HỌC
                </div>
              )}

              {/* Hover effect overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none`} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
