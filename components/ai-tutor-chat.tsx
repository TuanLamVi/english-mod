'use client'

import { useState, useRef, useEffect } from 'react'
import { explainGrammar, correctSentence, giveSpeakingTip, generateExample } from '@/lib/ai-tutor'
import type { AITutorMessage } from '@/lib/ai-tutor'

interface AIChatProps {
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  topic?: string
  onClose: () => void
}

export default function AIChatTutor({ difficulty, topic, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `👋 Xin chào! Tôi là AI Tutor của bạn. Tôi có thể giúp bạn:\n\n📚 **Explain** - Giải thích ngữ pháp\n✏️ **Correct** - Sửa câu sai của bạn\n💡 **Tip** - Gợi ý cách nói tự nhiên\n📖 **Example** - Cho ví dụ\n\nChọn nút bên dưới hoặc gõ câu hỏi của bạn!`,
      timestamp: new Date()
    }
  ])
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content: string, type: 'user' | 'ai') => {
    const message: AITutorMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, message])
  }

  const handleExplain = async () => {
    setLoading(true)
    addMessage(`📚 Giải thích về: ${topic || 'Present Simple'}`, 'user')
    const explanation = await explainGrammar(topic || 'present simple', difficulty)
    addMessage(explanation, 'ai')
    setLoading(false)
  }

  const handleCorrect = async () => {
    if (!userInput.trim()) {
      addMessage('❌ Vui lòng nhập một câu để tôi sửa', 'ai')
      return
    }
    setLoading(true)
    addMessage(`Sửa: "${userInput}"`, 'user')
    const correction = await correctSentence(userInput, difficulty)
    addMessage(correction, 'ai')
    setUserInput('')
    setLoading(false)
  }

  const handleTip = async () => {
    const word = userInput || 'hello'
    setLoading(true)
    addMessage(`💡 Gợi ý về: "${word}"`, 'user')
    const tip = await giveSpeakingTip('general', word)
    addMessage(tip, 'ai')
    setUserInput('')
    setLoading(false)
  }

  const handleExample = async () => {
    setLoading(true)
    addMessage(`📖 Cho ví dụ về: ${topic || 'greetings'}`, 'user')
    const examples = await generateExample(topic || 'greetings')
    const exampleText = `📖 **Ví dụ:**\n\n${examples.map((ex) => `✓ ${ex}`).join('\n')}`
    addMessage(exampleText, 'ai')
    setLoading(false)
  }

  const handleSendMessage = async () => {
    if (!userInput.trim()) return

    setLoading(true)
    addMessage(userInput, 'user')

    // Detect intent
    const input = userInput.toLowerCase()
    let response = ''

    if (input.includes('sửa') || input.includes('wrong') || input.includes('correct')) {
      response = await correctSentence(userInput, difficulty)
    } else if (input.includes('giải thích') || input.includes('explain')) {
      response = await explainGrammar(topic || 'present simple', difficulty)
    } else if (input.includes('ví dụ') || input.includes('example')) {
      const examples = await generateExample(topic || 'general')
      response = `📖 **Ví dụ:**\n\n${examples.map((ex) => `✓ ${ex}`).join('\n')}`
    } else {
      response = `Tôi hiểu rồi! 😊\n\n💭 "${userInput}"\n\nBạn có muốn tôi:\n✏️ Sửa câu này không?\n📚 Giải thích thêm?\n💡 Cho gợi ý?"`
    }

    addMessage(response, 'ai')
    setUserInput('')
    setLoading(false)
  }

  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 h-screen md:h-96 bg-white rounded-lg shadow-2xl flex flex-col z-50 md:rounded-t-lg md:rounded-b-none">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-bold">🤖 AI Tutor</h3>
          <p className="text-xs opacity-90">Sẵn sàng giúp bạn</p>
        </div>
        <button
          onClick={onClose}
          className="text-2xl hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.type === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-gray-300 text-gray-900 rounded-bl-none'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-300 text-gray-900 p-3 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-2 bg-white border-t grid grid-cols-4 gap-1">
        <button
          onClick={handleExplain}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded text-xs font-semibold transition disabled:opacity-50"
        >
          📚 Explain
        </button>
        <button
          onClick={handleCorrect}
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded text-xs font-semibold transition disabled:opacity-50"
        >
          ✏️ Correct
        </button>
        <button
          onClick={handleTip}
          disabled={loading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded text-xs font-semibold transition disabled:opacity-50"
        >
          💡 Tip
        </button>
        <button
          onClick={handleExample}
          disabled={loading}
          className="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded text-xs font-semibold transition disabled:opacity-50"
        >
          📖 Example
        </button>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Nhập câu hỏi..."
          className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !userInput.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold transition disabled:opacity-50"
        >
          📤
        </button>
      </div>
    </div>
  )
}
