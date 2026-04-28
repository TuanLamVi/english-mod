/**
 * Pi Network Earning System
 */

export interface PiWallet {
  totalEarned: number
  totalClaimed: number
  pending: number
  lastEarned: string
  earningRate: number // Pi per hour
  level: number // 1-5 earning level
}

export interface PiEarningEvent {
  id: string
  type: "lesson" | "challenge" | "streak" | "badge" | "achievement"
  amount: number
  reason: string
  timestamp: Date
  multiplier: number
}

export interface PiLeaderboard {
  rank: number
  username: string
  totalPi: number
  level: number
  streak: number
}

const PI_RATES = {
  lesson_complete: 0.5, // Pi per lesson
  daily_challenge: 1.0, // Pi per daily challenge
  streak_bonus_3: 0.5,
  streak_bonus_7: 1.0,
  streak_bonus_14: 1.5,
  streak_bonus_30: 2.0,
  badge_unlock: 2.0,
  level_up: 1.0
}

/**
 * Tính Pi từ hoàn thành bài
 */
export function calculatePiReward(
  lessonDifficulty: "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  isCorrect: boolean,
  streak: number
): { pi: number; reason: string } {
  if (!isCorrect) {
    return { pi: 0, reason: "Trả lời sai - không nhận Pi" }
  }

  // Base Pi
  const difficultyMultiplier: Record<string, number> = {
    A1: 0.5,
    A2: 0.6,
    B1: 0.8,
    B2: 1.0,
    C1: 1.2,
    C2: 1.5
  }

  let pi = PI_RATES.lesson_complete * (difficultyMultiplier[lessonDifficulty] || 0.5)

  // Streak bonus
  if (streak >= 30) pi *= 1.5
  else if (streak >= 14) pi *= 1.3
  else if (streak >= 7) pi *= 1.2
  else if (streak >= 3) pi *= 1.1

  return {
    pi: Math.round(pi * 100) / 100,
    reason: `Hoàn thành bài ${lessonDifficulty} (${streak} ngày streak)`
  }
}

/**
 * Tính Pi từ daily challenge
 */
export function calculateChallengeReward(
  challengeType: string,
  completionTime: number, // milliseconds
  streak: number
): number {
  let basePi = PI_RATES.daily_challenge

  // Bonus cho speed
  if (completionTime < 5 * 60 * 1000) basePi *= 1.2 // 5 minutes
  if (completionTime < 2 * 60 * 1000) basePi *= 1.5 // 2 minutes

  // Streak bonus
  if (streak >= 30) basePi *= 1.5
  else if (streak >= 14) basePi *= 1.3
  else if (streak >= 7) basePi *= 1.2
  else if (streak >= 3) basePi *= 1.1

  return Math.round(basePi * 100) / 100
}

/**
 * Tính Pi từ badge
 */
export function calculateBadgeReward(badgeTier: number): number {
  return Math.min(PI_RATES.badge_unlock * badgeTier, 5.0)
}

/**
 * Cập nhật earning level
 */
export function getEarningLevel(totalPiEarned: number): number {
  if (totalPiEarned < 10) return 1
  if (totalPiEarned < 50) return 2
  if (totalPiEarned < 100) return 3
  if (totalPiEarned < 200) return 4
  return 5
}

/**
 * Lấy earning rate multiplier
 */
export function getEarningMultiplier(level: number, streak: number): number {
  const levelMultiplier = 1 + (level - 1) * 0.2 // Level 1: 1x, Level 5: 1.8x
  const streakMultiplier = getStreakMultiplier(streak)
  return levelMultiplier * streakMultiplier
}

/**
 * Lấy streak multiplier
 */
function getStreakMultiplier(streak: number): number {
  if (streak < 3) return 1.0
  if (streak < 7) return 1.1
  if (streak < 14) return 1.2
  if (streak < 30) return 1.3
  return 1.5
}

/**
 * Tạo Pi earning event
 */
export function createPiEvent(
  type: PiEarningEvent["type"],
  amount: number,
  reason: string,
  multiplier: number = 1
): PiEarningEvent {
  return {
    id: `pi_${Date.now()}`,
    type,
    amount: Math.round(amount * multiplier * 100) / 100,
    reason,
    timestamp: new Date(),
    multiplier
  }
}

/**
 * Mock Leaderboard
 */
export const MOCK_PI_LEADERBOARD: PiLeaderboard[] = [
  { rank: 1, username: "Nguyễn A", totalPi: 250, level: 15, streak: 30 },
  { rank: 2, username: "Trần B", totalPi: 200, level: 12, streak: 20 },
  { rank: 3, username: "Lê C", totalPi: 150, level: 10, streak: 15 },
  { rank: 4, username: "Phạm D", totalPi: 100, level: 8, streak: 10 },
  { rank: 5, username: "Bạn", totalPi: 50, level: 5, streak: 5 }
]
