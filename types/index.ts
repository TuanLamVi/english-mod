/**
 * Global Type Definitions
 */

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
export type Difficulty = "easy" | "medium" | "hard"
export type QuestionType = "choice" | "input" | "arrange"

export interface User {
  id: string
  username: string
  level: number
  totalXP: number
  currentStreak: number
  badges: string[]
  totalPiEarned: number
  createdAt: Date
}

export interface Lesson {
  id: number
  level: Level
  title: string
  description: string
  type: "vocabulary" | "grammar" | "listening" | "quiz"
  duration: number
  questions: Question[]
  completed: boolean
  xpReward: number
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  options?: string[]
  answer: string
  explanation?: string
  difficulty: Difficulty
}

export interface SessionResult {
  lessonId: number
  correctAnswers: number
  totalQuestions: number
  xpEarned: number
  piEarned: number
  timeSpent: number
  accuracy: number
}

export interface AITutorChat {
  id: string
  messages: ChatMessage[]
  context: {
    lessonId: number
    topic: string
    difficulty: "beginner" | "intermediate" | "advanced"
  }
  createdAt: Date
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}
