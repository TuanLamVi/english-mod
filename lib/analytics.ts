/**
 * Analytics - Theo dõi hoạt động người dùng
 */

export interface UserStats {
  totalXP: number
  lessonsCompleted: number
  questionsAnswered: number
  correctAnswers: number
  accuracy: number
  lastPlayed: string
  joinDate: string
  longestStreak: number
  currentStreak: number
}

export interface LessonStats {
  lessonId: number
  attempts: number
  bestScore: number
  lastAttempt: string
  completed: boolean
}

/**
 * Lấy thống kê người dùng
 */
export function getUserStats(): UserStats {
  if (typeof window === "undefined") {
    return getDefaultStats()
  }

  try {
    const stats = localStorage.getItem("userStats")
    return stats ? JSON.parse(stats) : getDefaultStats()
  } catch (error) {
    console.error("Error loading user stats:", error)
    return getDefaultStats()
  }
}

/**
 * Cập nhật thống kê người dùng
 */
export function updateUserStats(updates: Partial<UserStats>): void {
  if (typeof window === "undefined") return

  try {
    const current = getUserStats()
    const updated = { ...current, ...updates }
    localStorage.setItem("userStats", JSON.stringify(updated))
  } catch (error) {
    console.error("Error updating user stats:", error)
  }
}

/**
 * Cập nhật streak
 */
export function updateStreak(): void {
  if (typeof window === "undefined") return

  try {
    const stats = getUserStats()
    const today = new Date().toDateString()
    const lastPlayed = stats.lastPlayed

    let newStreak = stats.currentStreak
    if (lastPlayed !== today) {
      const lastDate = new Date(lastPlayed)
      const todayDate = new Date(today)
      const dayDiff = Math.floor(
        (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      )

      if (dayDiff === 1) {
        newStreak = stats.currentStreak + 1
      } else if (dayDiff > 1) {
        newStreak = 1
      }
    }

    updateUserStats({
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastPlayed: today
    })
  } catch (error) {
    console.error("Error updating streak:", error)
  }
}

/**
 * Lấy thống kê bài học
 */
export function getLessonStats(lessonId: number): LessonStats {
  if (typeof window === "undefined") return getDefaultLessonStats(lessonId)

  try {
    const stats = localStorage.getItem(`lessonStats_${lessonId}`)
    return stats ? JSON.parse(stats) : getDefaultLessonStats(lessonId)
  } catch (error) {
    console.error("Error loading lesson stats:", error)
    return getDefaultLessonStats(lessonId)
  }
}

/**
 * Cập nhật thống kê bài học
 */
export function updateLessonStats(
  lessonId: number,
  score: number
): void {
  if (typeof window === "undefined") return

  try {
    const current = getLessonStats(lessonId)
    const updated: LessonStats = {
      lessonId,
      attempts: current.attempts + 1,
      bestScore: Math.max(current.bestScore, score),
      lastAttempt: new Date().toISOString(),
      completed: score === 100
    }
    localStorage.setItem(`lessonStats_${lessonId}`, JSON.stringify(updated))
  } catch (error) {
    console.error("Error updating lesson stats:", error)
  }
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(
  correct: number,
  total: number
): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

function getDefaultStats(): UserStats {
  return {
    totalXP: 0,
    lessonsCompleted: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    accuracy: 0,
    lastPlayed: new Date().toDateString(),
    joinDate: new Date().toISOString(),
    longestStreak: 0,
    currentStreak: 0
  }
}

function getDefaultLessonStats(lessonId: number): LessonStats {
  return {
    lessonId,
    attempts: 0,
    bestScore: 0,
    lastAttempt: "",
    completed: false
  }
}
