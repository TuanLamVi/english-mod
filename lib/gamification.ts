/**
 * Gamification System - XP, Level, Streak, Achievements
 */

export interface UserProfile {
  id: string
  username: string
  level: number
  totalXP: number
  currentStreak: number
  longestStreak: number
  lastPlayedDate: string
  totalPlayDays: number
  badges: string[]
  totalPiEarned: number
}

export interface GamificationState {
  xp: number
  level: number
  nextLevelXP: number
  streak: number
  dailyChallenge: DailyChallenge
  recentRewards: Reward[]
}

export interface DailyChallenge {
  id: string
  title: string
  description: string
  target: number
  progress: number
  reward: number
  completed: boolean
  expiresAt: string
}

export interface Reward {
  type: "xp" | "pi" | "badge"
  amount: number
  reason: string
  timestamp: Date
}

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
  unlockedAt?: Date
}

// Level progression: 0 XP → Level 1, 100 XP → Level 2, etc.
const XP_PER_LEVEL = 100
const MAX_LEVEL = 50

/**
 * Tính toán level từ XP
 */
export function calculateLevel(totalXP: number): number {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1
  return Math.min(level, MAX_LEVEL)
}

/**
 * Tính XP cần để đạt level tiếp theo
 */
export function xpToNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP)
  const xpForNextLevel = currentLevel * XP_PER_LEVEL
  return Math.max(0, xpForNextLevel - totalXP)
}

/**
 * Thêm XP cho người chơi
 */
export function addXP(
  currentXP: number,
  xpGain: number,
  reason: string = "Hoàn thành bài học"
): { newXP: number; levelUp: boolean; reward: Reward } {
  const oldLevel = calculateLevel(currentXP)
  const newXP = currentXP + xpGain
  const newLevel = calculateLevel(newXP)

  return {
    newXP,
    levelUp: newLevel > oldLevel,
    reward: {
      type: "xp",
      amount: xpGain,
      reason,
      timestamp: new Date()
    }
  }
}

/**
 * Cập nhật streak (học liên tục)
 */
export function updateStreak(lastPlayedDate: string): number {
  const today = new Date().toDateString()
  const lastDate = new Date(lastPlayedDate).toDateString()

  if (today === lastDate) {
    // Cùng ngày - streak không thay đổi
    return 0
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  if (lastDate === yesterdayStr) {
    // Tiếp tục streak
    return 1
  }

  // Streak bị cắt
  return -1 // Reset
}

/**
 * Kiểm tra badge mới
 */
export const ALL_BADGES: Badge[] = [
  {
    id: "first_step",
    name: "🐣 Bước Đầu Tiên",
    icon: "🐣",
    description: "Hoàn thành bài học đầu tiên"
  },
  {
    id: "level_5",
    name: "⭐ Sao Năm",
    icon: "⭐",
    description: "Đạt Level 5"
  },
  {
    id: "level_10",
    name: "🌟 Sao Mười",
    icon: "🌟",
    description: "Đạt Level 10"
  },
  {
    id: "week_streak",
    name: "🔥 Một Tuần",
    icon: "🔥",
    description: "Học liên tục 7 ngày"
  },
  {
    id: "hundred_correct",
    name: "💯 Trăm Phần Trăm",
    icon: "💯",
    description: "Trả lời đúng 100 câu liên tiếp"
  },
  {
    id: "speedrun",
    name: "⚡ Tốc Độ Sét",
    icon: "⚡",
    description: "Hoàn thành 5 bài trong 1 giờ"
  },
  {
    id: "all_levels",
    name: "🏆 Chinh Phục",
    icon: "🏆",
    description: "Hoàn thành tất cả level"
  },
  {
    id: "ai_master",
    name: "🤖 Thạo AI",
    icon: "🤖",
    description: "Sử dụng AI Tutor 50 lần"
  }
]

/**
 * Lấy badge mới
 */
export function checkNewBadges(
  profile: UserProfile
): { newBadges: Badge[]; rewards: Reward[] } {
  const newBadges: Badge[] = []
  const rewards: Reward[] = []

  if (profile.level >= 5 && !profile.badges.includes("level_5")) {
    newBadges.push(ALL_BADGES[1])
    rewards.push({
      type: "badge",
      amount: 50,
      reason: "Mở khóa badge Level 5",
      timestamp: new Date()
    })
  }

  if (profile.currentStreak >= 7 && !profile.badges.includes("week_streak")) {
    newBadges.push(ALL_BADGES[3])
    rewards.push({
      type: "badge",
      amount: 100,
      reason: "Mở khóa badge Một Tuần Streak",
      timestamp: new Date()
    })
  }

  return { newBadges, rewards }
}

/**
 * Tạo daily challenge
 */
export function generateDailyChallenge(): DailyChallenge {
  const challenges = [
    { title: "5 bài học", description: "Hoàn thành 5 bài học", target: 5, reward: 50 },
    { title: "100% Chính xác", description: "Trả lời đúng 10 câu liên tiếp", target: 10, reward: 75 },
    { title: "Luyện từ vựng", description: "Học 20 từ mới", target: 20, reward: 60 },
    { title: "Thi đấu AI", description: "Tương tác với AI Tutor 5 lần", target: 5, reward: 40 }
  ]

  const challenge = challenges[Math.floor(Math.random() * challenges.length)]
  const expiresAt = new Date()
  expiresAt.setHours(23, 59, 59)

  return {
    id: `challenge_${Date.now()}`,
    ...challenge,
    progress: 0,
    completed: false,
    expiresAt: expiresAt.toISOString()
  }
}

/**
 * Lấy XP bonus từ streak
 */
export function getStreakBonus(streak: number): number {
  if (streak < 3) return 0
  if (streak < 7) return 1.1 // 10% bonus
  if (streak < 14) return 1.2 // 20% bonus
  if (streak < 30) return 1.3 // 30% bonus
  return 1.5 // 50% bonus cho 30+ days
}
