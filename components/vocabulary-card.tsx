'use client'

import { useState } from 'react'
import { Volume2, Bookmark, BookmarkCheck } from 'lucide-react'

interface VocabularyItem {
  id: string
  word: string
  phonetic: string
  vietnamese: string
  example?: string
  exampleVietnamese?: string
}

interface VocabularyCardProps {
  vocab: VocabularyItem
  isBookmarked?: boolean
  onBookmarkToggle?: (id: string) => void
}

export default function VocabularyCard({ 
  vocab, 
  isBookmarked = false, 
  onBookmarkToggle 
}: VocabularyCardProps) {
  
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert("Trình duyệt của bạn không hỗ trợ phát âm.")
      return
    }

    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.9
    utterance.pitch = 1.05

    utterance.onend = () => setIsSpeaking(false)
    
    window.speechSynthesis.speak(utterance)
  }

  const handleBookmark = () => {
    onBookmarkToggle?.(vocab.id)
  }

  return (
    <div className="group bg-white border border-gray-100 hover:border-blue-200 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      
      {/* Header: Word + Phonetic + Bookmark */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-3xl font-bold text-gray-900 tracking-tight capitalize">
            {vocab.word}
          </h3>
          <p className="text-gray-500 font-mono text-sm mt-1">
            {vocab.phonetic}
          </p>
        </div>

        <button
          onClick={handleBookmark}
          className={`p-2 rounded-xl transition-colors ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
          title={isBookmarked ? "Bỏ lưu" : "Lưu từ"}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-6 h-6" />
          ) : (
            <Bookmark className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Vietnamese Meaning */}
      <div className="mb-5">
        <p className="text-xl font-medium text-gray-700">
          {vocab.vietnamese}
        </p>
      </div>

      {/* Speak Button */}
      <button
        onClick={() => speak(vocab.word)}
        disabled={isSpeaking}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-2xl flex items-center justify-center gap-3 font-medium transition-all active:scale-95 mb-6"
      >
        <Volume2 className={`w-5 h-5 ${isSpeaking ? 'animate-pulse' : ''}`} />
        {isSpeaking ? 'Đang phát âm...' : 'Nghe phát âm'}
      </button>

      {/* Example Sentence */}
      {vocab.example && (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
          <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-medium">
            Ví dụ
          </p>
          <p className="text-gray-800 italic leading-relaxed">
            "{vocab.example}"
          </p>
          {vocab.exampleVietnamese && (
            <p className="text-sm text-gray-600 mt-3">
              {vocab.exampleVietnamese}
            </p>
          )}
        </div>
      )}

      {/* Footer subtle info */}
      <div className="mt-4 text-[10px] text-gray-400 text-right">
        Nhấp vào từ để nghe • Lưu từ để ôn sau
      </div>
    </div>
  )
}
