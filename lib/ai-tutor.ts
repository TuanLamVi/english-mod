/**
 * AI Tutor - Hệ thống hỗ trợ học tập thông minh
 * Giải thích, sửa lỗi, gợi ý học
 */

export interface AITutorMessage {
  id: string
  type: "user" | "ai"
  content: string
  timestamp: Date
}

export interface AITutorContext {
  lessonId: number
  currentWord?: string
  userSentence?: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

/**
 * Giải thích ngữ pháp
 */
export async function explainGrammar(
  topic: string,
  difficulty: "beginner" | "intermediate" | "advanced"
): Promise<string> {
  // Mock AI Response - thay bằng API thật sau
  const explanations: Record<string, Record<string, string>> = {
    "present simple": {
      beginner:
        "🎯 **Present Simple (Thì Hiện Tại Đơn)**\n\n**Cách dùng:**\n- Nói về sự thật hiển nhiên\n- Thói quen hàng ngày\n- Lịch trình\n\n**Công thức:**\n- I/You/We/They + V\n- He/She/It + V+s\n\n**Ví dụ:**\n✅ I eat rice every day\n✅ She plays football\n\n**Câu hỏi:**\n❓ Do you like English?\n❓ Does he go to school?",
      intermediate:
        "**Present Simple Usage:**\n- Regular facts & habits\n- Timeless truths\n- Fixed schedules\n- General statements\n\n**Formation rules:**\n- Affirmative: S + V (+ o/es for 3rd person)\n- Negative: S + do/does + not + V\n- Question: Do/Does + S + V?\n\n**Advanced notes:**\n- Stative verbs (love, hate, know) stay V\n- Dynamic verbs can use progressive\n- Time markers: usually, always, sometimes",
      advanced:
        "**Pragmatic Usage of Simple Present:**\n- Gnomic statements vs iterative actions\n- Habitual aspect vs characterizing generics\n- Zero conditional contexts\n- Commentary & performative uses (sports commentary, instructions)\n- Stylistic variation in narrative contexts (historical present)\n- Interaction with aspectual particles and adverbials"
    },
    "past tense": {
      beginner:
        "🎯 **Thì Quá Khứ Đơn**\n\n**Khi dùng:**\n- Nói về chuyện đã xảy ra\n- Kể chuyện trong quá khứ\n\n**Cách viết:**\n- Regular: V + ed (walked, played)\n- Irregular: went, was, did\n\n**Ví dụ:**\n✅ I went to school yesterday\n✅ She was happy\n\n**Phủ định & hỏi:**\n❌ I didn't go\n❓ Did you go?",
      intermediate:
        "**Past Simple vs Present Perfect:**\n- Simple Past: completed action, finished time period\n- Present Perfect: recent action with present relevance\n\n**Time expressions:**\n- with Simple Past: yesterday, last week, in 2020\n- with Present Perfect: just, recently, for, since\n\n**Irregular verbs table:**\n- go → went, eat → ate, see → saw",
      advanced:
        "**Aspectual semantics of Simple Past:**\n- Narrative sequencing\n- Event topology (punctual vs durative)\n- Perfective vs imperfective reading\n- Interaction with Progressive aspect"
    }
  }

  const response = explanations[topic]?.[difficulty]
  if (!response) {
    return `📚 **${topic}**\n\nTôi đang học về chủ đề này. Hãy thử hỏi lại sau! 😊`
  }

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))
  return response
}

/**
 * Sửa câu sai
 */
export async function correctSentence(
  userSentence: string,
  difficulty: "beginner" | "intermediate" | "advanced"
): Promise<string> {
  // Mock corrections
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const corrections: Record<string, string> = {
    "i go to school": "I go to school. (remember: I always needs capital)",
    "she go to school": "She goes to school. (3rd person singular needs 's')",
    "i am go": "I am going. (use 'going' with 'am', not bare 'go')",
    "yesterday i go": "Yesterday I went. (use past tense with 'yesterday')",
    "do you likes": "Do you like? (don't add 's' after auxiliary 'do')"
  }

  const normalizedInput = userSentence.toLowerCase().trim()
  const correction = corrections[normalizedInput]

  if (correction) {
    return `✏️ **Sửa lỗi:**\n\n❌ **Bạn viết:** "${userSentence}"\n✅ **Đúng là:** "${correction}"\n\n💡 **Giải thích:**\n${getCorrectExplanation(correction)}`
  }

  return `✅ Câu của bạn tốt lắm! Không có lỗi gì.\n\n💪 **Gợi ý cách nói tự nhiên hơn:**\n- "${userSentence}" - Dùng khi muốn bình thường\n- "I study at school every day" - Cách nói tự nhiên hơn`
}

/**
 * Gợi ý cách nói
 */
export async function giveSpeakingTip(
  context: string,
  word: string
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const tips: Record<string, string> = {
    hello:
      '👋 **Cách nói "Hello":**\n\n**Formal:** "Hello, nice to meet you"\n**Casual:** "Hey! What\'s up?"\n**Friends:** "Yo! How\'s it?"\n\n**Khi nào dùng:**\n- Formal: Cuộc phỏng vấn, gặp lần đầu\n- Casual: Bạn bè, buổi gặp thường\n- Friends: Bạn thân, môi trường thoải mái',
    good:
      '👍 **Cách dùng "Good":**\n\n**Responses:**\n- "How are you?" → "I\'m good" ✅\n- "Do you want coffee?" → "Good idea!" ✅\n\n**Ý khác:**\n- "That\'s good" (tốt)\n- "Have a good day" (ngày tốt)\n- "Good job" (làm tốt)',
    friend:
      '👥 **"Friend" vs "Mate" vs "Buddy":**\n\n**Friend:** Phổ dụng, formal hơn\n**Mate:** Thân thiết hơn, informal (Anh, Úc)\n**Buddy:** Rất thân, American style\n\n**Ví dụ:**\n- "We\'re friends" (bạn bè)\n- "You\'re my best mate" (bạn thân nhất)',
    thank:
      '🙏 **Cách nói cảm ơn tự nhiên:**\n\n**Formal:** Thank you very much\n**Normal:** Thanks a lot / Thanks!\n**Casual:** Cheers / Thanks, mate!\n**Very casual:** Ta / Appreciate it\n\n**Cách trả lời:**\n- "You\'re welcome" (formal)\n- "No problem" (casual)\n- "Anytime!" (thân thiết)'
  }

  return (
    tips[word.toLowerCase()] ||
    `📖 Từ "${word}" là một từ thông dụng. Hãy xem thêm ví dụ trong bài học! 😊`
  )
}

/**
 * Tạo ví dụ
 */
export async function generateExample(
  topic: string
): Promise<string[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  const examples: Record<string, string[]> = {
    "present simple": [
      "I work as an engineer.",
      "She plays tennis every weekend.",
      "They live in London.",
      "He doesn't like spicy food.",
      "Do you speak English?"
    ],
    "past tense": [
      "I went to the beach yesterday.",
      "She was very happy.",
      "We visited Paris last summer.",
      "Did you see the movie?",
      "They didn't arrive on time."
    ],
    greetings: [
      "Hello! How are you doing?",
      "Hi, nice to meet you!",
      "Hey, what's up?",
      "Good morning! How's your day?",
      "Goodbye! See you tomorrow!"
    ]
  }

  return (
    examples[topic.toLowerCase()] || [
      "Example 1: Sample sentence",
      "Example 2: Another sample",
      "Example 3: More practice"
    ]
  )
}

/**
 * Lấy lời giải thích cho câu sửa
 */
function getCorrectExplanation(correction: string): string {
  if (correction.includes("capital")) {
    return "Trong tiếng Anh, đại từ 'I' luôn viết hoa, ngay cả ở giữa câu."
  }
  if (correction.includes("3rd person")) {
    return "Với he/she/it, động từ phải thêm 's' ở thì hiện tại đơn. Quy tắc: S + V+s"
  }
  if (correction.includes("going")) {
    return "Khi dùng 'am/is/are', động từ tiếp theo phải ở dạng -ing (Progressive)."
  }
  if (correction.includes("past tense")) {
    return "Với 'yesterday', phải dùng thì quá khứ. Hãy nhớ các động từ bất quy tắc (went, was, etc)."
  }
  return "Lỗi ngữ pháp. Hãy ôn lại quy tắc trong bài học!"
}

/**
 * Chat context - lưu lịch sử chat
 */
export function formatChatMessage(
  content: string,
  type: "user" | "ai"
): string {
  if (type === "user") {
    return `You: ${content}`
  }
  return `AI Tutor: ${content}`
}
