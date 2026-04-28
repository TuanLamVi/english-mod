/**
 * Achievements System - Hệ thống thành tích
 */

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: "xp" | "streak" | "accuracy" | "lessons" | "special"
  target: number
  reward: number
  unlocked: boolean
  unlockedDate?: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    title: "Bước Đầu Tiên",
    description: "Hoàn thành bài học đầu tiên",
    icon: "👣",
    condition: "lessons",
    target: 1,
    reward: 10,
    unlocked: false
  },
  {
    id: "hundred_xp",
    title: "Trăm XP",
    description: "Đạt 100 XP",
    icon: "⭐",
    condition: "xp",
    target: 100,
    reward: 25,
    unlocked: false
  },
  {
    id: "five_hundred_xp",
    title: "Năm Trăm XP",
    description: "Đạt 500 XP",
    icon: "🌟",
    condition: "xp",
    target: 500,
    reward: 50,
    unlocked: false
  },
  {
    id: "thousand_xp",
    title: "Nghìn XP",
    description: "Đạt 1000 XP",
    icon: "✨",
    condition: "xp",
    target: 1000,
    reward: 100,
    unlocked: false
  },
  {
    id: "perfect_accuracy",
    title: "Hoàn Hảo",
    description: "Đạt 95% độ chính xác",
    icon: "🎯",
    condition: "accuracy",
    target: 95,
    reward: 75,
    unlocked: false
  },
  {
    id: "seven_day_streak",
    title: "Một Tuần Liên Tục",
    description: "7 ngày học liên tục",
    icon: "🔥",
    condition: "streak",
    target: 7,
    reward: 100,
    unlocked: false
  },
  {
    id: "all_lessons",
    title: "Toàn Bộ Khóa Học",
    description: "Hoàn thành tất cả bài học",
    icon: "🏆",
    condition: "lessons",
    target: 8,
    reward: 200,
    unlocked: false
  },
  {
    id: "speed_learner",
    title: "Học Nhanh",
    description: "Hoàn thành 3 bài trong 1 ngày",
    icon: "⚡",
    condition: "special",
    target: 3,
    reward: 50,
    unlocked: false
  }
]

/**
 * Lấy achievements
 */
export function getAchievements(): Achievement[] {
  if (typeof window === "undefined") return ACHIEVEMENTS

  try {
    const saved = localStorage.getItem("achievements")
    return saved ? JSON.parse(saved) : ACHIEVEMENTS
  } catch (error) {
    console.error("Error loading achievements:", error)
    return ACHIEVEMENTS
  }
}

/**
 * Cập nhật achievement
 */
export function unlockAchievement(achievementId: string): void {
  if (typeof window === "undefined") return

  try {
    const achievements = getAchievements()
    const achievement = achievements.find((a) => a.id === achievementId)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedDate = new Date().toISOString()
      localStorage.setItem("achievements", JSON.stringify(achievements))
    }
  } catch (error) {
    console.error("Error unlocking achievement:", error)
  }
}

/**
 * Check achievements
 */
export function checkAchievements(
  totalXP: number,
  accuracy: number,
  streak: number,
  lessonsCompleted: number
): string[] {
  const achievements = getAchievements()
  const newAchievements: string[] = []

  achievements.forEach((achievement) => {
    if (achievement.unlocked) return

    let shouldUnlock = false
    switch (achievement.condition) {
      case "xp":
        shouldUnlock = totalXP >= achievement.target
        break
      case "accuracy":
        shouldUnlock = accuracy >= achievement.target
        break
      case "streak":
        shouldUnlock = streak >= achievement.target
        break
      case "lessons":
        shouldUnlock = lessonsCompleted >= achievement.target
        break
    }

    if (shouldUnlock) {
      unlockAchievement(achievement.id)
      newAchievements.push(achievement.id)
    }
  })

  return newAchievements
}
