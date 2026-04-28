/**
 * Learning Levels - CEFR Framework (A1 → C2)
 */

export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export interface LevelInfo {
  code: Level
  name: string
  description: string
  icon: string
  estimatedHours: number
  lessonsCount: number
  wordsToLearn: number
  color: string
}

export interface LessonContent {
  id: number
  level: Level
  title: string
  description: string
  type: "vocabulary" | "grammar" | "listening" | "quiz"
  duration: number // minutes
  wordCount: number
  difficulty: "easy" | "medium" | "hard"
}

export const LEVEL_INFO: Record<Level, LevelInfo> = {
  A1: {
    code: "A1",
    name: "Beginner",
    description: "🐣 Bước đầu - Nói được những câu cơ bản",
    icon: "🐣",
    estimatedHours: 40,
    lessonsCount: 20,
    wordsToLearn: 500,
    color: "from-pink-400 to-red-400"
  },
  A2: {
    code: "A2",
    name: "Elementary",
    description: "🔶 Tiểu học - Giao tiếp cơ bản hàng ngày",
    icon: "🔶",
    estimatedHours: 80,
    lessonsCount: 30,
    wordsToLearn: 1000,
    color: "from-orange-400 to-yellow-400"
  },
  B1: {
    code: "B1",
    name: "Intermediate",
    description: "🟢 Trung cấp - Nói chuyện lưu loát",
    icon: "🟢",
    estimatedHours: 200,
    lessonsCount: 40,
    wordsToLearn: 1500,
    color: "from-green-400 to-emerald-400"
  },
  B2: {
    code: "B2",
    name: "Upper Intermediate",
    description: "🔵 Trung cao - Tự tin trong hầu hết tình huống",
    icon: "🔵",
    estimatedHours: 300,
    lessonsCount: 50,
    wordsToLearn: 2000,
    color: "from-blue-400 to-sky-400"
  },
  C1: {
    code: "C1",
    name: "Advanced",
    description: "💜 Cao cấp - Nắm chắc nuance và idioms",
    icon: "💜",
    estimatedHours: 400,
    lessonsCount: 60,
    wordsToLearn: 2500,
    color: "from-purple-400 to-pink-400"
  },
  C2: {
    code: "C2",
    name: "Mastery",
    description: "🏆 Thạo - Cấp độ người bản xứ",
    icon: "🏆",
    estimatedHours: 500,
    lessonsCount: 80,
    wordsToLearn: 3000,
    color: "from-yellow-400 to-amber-400"
  }
}

/**
 * Sample lessons
 */
export const SAMPLE_LESSONS: LessonContent[] = [
  // A1 Level
  { id: 1, level: "A1", title: "Chào hỏi", description: "Nói hello, goodbye, thank you", type: "vocabulary", duration: 5, wordCount: 10, difficulty: "easy" },
  { id: 2, level: "A1", title: "Con số", description: "Học số 1-20", type: "vocabulary", duration: 8, wordCount: 20, difficulty: "easy" },
  { id: 3, level: "A1", title: "Gia đình", description: "Từ về gia đình (family, mother, brother...)", type: "vocabulary", duration: 10, wordCount: 15, difficulty: "easy" },
  { id: 4, level: "A1", title: "Thì hiện tại đơn", description: "I am, You are, He is...", type: "grammar", duration: 12, wordCount: 0, difficulty: "medium" },
  { id: 5, level: "A1", title: "Nghe cơ bản", description: "Nghe câu chào, giới thiệu", type: "listening", duration: 8, wordCount: 0, difficulty: "easy" },

  // A2 Level
  { id: 10, level: "A2", title: "Món ăn", description: "Học tên các món ăn", type: "vocabulary", duration: 10, wordCount: 20, difficulty: "easy" },
  { id: 11, level: "A2", title: "Thì quá khứ", description: "I went, She was, Did you...?", type: "grammar", duration: 15, wordCount: 0, difficulty: "medium" },
  { id: 12, level: "A2", title: "Mua sắm", description: "Tạo cuộc hội thoại mua hàng", type: "listening", duration: 10, wordCount: 0, difficulty: "medium" },

  // B1 Level
  { id: 20, level: "B1", title: "Idioms phổ biến", description: "Learn common idioms", type: "vocabulary", duration: 15, wordCount: 30, difficulty: "medium" },
  { id: 21, level: "B1", title: "Thì hoàn thành", description: "Present Perfect vs Simple Past", type: "grammar", duration: 20, wordCount: 0, difficulty: "hard" },
  { id: 22, level: "B1", title: "Phỏng vấn", description: "Kỹ năng phỏng vấn xin việc", type: "listening", duration: 15, wordCount: 0, difficulty: "hard" },

  // B2, C1, C2 levels
  { id: 30, level: "B2", title: "Phrasal verbs", description: "Advanced phrasal verbs", type: "vocabulary", duration: 20, wordCount: 40, difficulty: "hard" },
  { id: 40, level: "C1", title: "Academic English", description: "English for academics", type: "grammar", duration: 25, wordCount: 0, difficulty: "hard" },
  { id: 50, level: "C2", title: "Native speaker nuances", description: "Subtle meanings and usage", type: "vocabulary", duration: 30, wordCount: 50, difficulty: "hard" }
]

/**
 * Lấy lessons theo level
 */
export function getLessonsByLevel(level: Level): LessonContent[] {
  return SAMPLE_LESSONS.filter((lesson) => lesson.level === level)
}

/**
 * Lấy tất cả levels
 */
export function getAllLevels(): Level[] {
  return ["A1", "A2", "B1", "B2", "C1", "C2"]
}

/**
 * Tính progress
 */
export function calculateLevelProgress(completedLessons: number, totalLessons: number): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}
