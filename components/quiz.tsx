"use client"

import { useState, useEffect } from "react"

export default function Quiz({ lesson }) {
  const [index, setIndex] = useState(0)
  const [xp, setXP] = useState(0)
  const [input, setInput] = useState("")
  const [selected, setSelected] = useState("")
  const [result, setResult] = useState("")
  const [life, setLife] = useState(3)
  const [shuffled, setShuffled] = useState<string[]>([])

  const q = lesson?.questions?.[index]

  // ✅ Kiểm tra câu hỏi tồn tại
  if (!q) {
    return (
      <div className="p-4 border rounded-xl max-w-xl mx-auto">
        <p className="text-red-500 font-bold">❌ Lỗi: Không có câu hỏi nào</p>
      </div>
    )
  }

  // 🔊 Text to speech
  const speak = (text: string) => {
    try {
      const utter = new SpeechSynthesisUtterance(text)
      utter.lang = "en-US"
      speechSynthesis.speak(utter)
    } catch (error) {
      console.error("Speech synthesis error:", error)
    }
  }

  // 🔊 Sound đúng/sai - Cải tiến với Web Audio API
  const playSound = (type: "correct" | "wrong") => {
    try {
      // Thử dùng Web Audio API trước
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      if (type === "correct") {
        oscillator.frequency.value = 800
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        oscillator.frequency.value = 300
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.2)
      }
    } catch (error) {
      // Fallback: Thử dùng file MP3
      console.warn("Web Audio API not available, trying MP3 files", error)
      try {
        const audio = new Audio(
          type === "correct"
            ? "/sounds/correct.mp3"
            : "/sounds/wrong.mp3"
        )
        audio.volume = type === "correct" ? 0.3 : 0.2
        audio.play().catch(() => console.warn("Could not play sound file"))
      } catch (audioError) {
        console.warn("Sound playback failed:", audioError)
      }
    }
  }

  // Shuffle cho dạng arrange
  useEffect(() => {
    if (q?.type === "arrange" && q?.words) {
      setShuffled([...q.words].sort(() => Math.random() - 0.5))
    }
  }, [index, q])

  const next = () => {
    setTimeout(() => {
      if (index < lesson.questions.length - 1) {
        setIndex(index + 1)
        setInput("")
        setSelected("")
        setResult("")
      } else {
        const oldXP = Number(localStorage.getItem("xp") || 0)
        localStorage.setItem("xp", (oldXP + xp).toString())

        alert("🎉 Hoàn thành bài! +" + xp + " XP")
        // Reset cho bài tiếp theo
        setIndex(0)
        setXP(0)
      }
    }, 800)
  }

  const check = () => {
    // ✅ Kiểm tra người dùng đã chọn/nhập đáp án chưa
    if (q.type === "choice" && !selected) {
      alert("⚠️ Vui lòng chọn một đáp án")
      return
    }

    if (q.type === "input" && !input.trim()) {
      alert("⚠️ Vui lòng nhập câu trả lời")
      return
    }

    if (q.type === "arrange" && shuffled.length === 0) {
      alert("⚠️ Vui lòng sắp xếp các từ")
      return
    }

    let correct = false

    if (q.type === "choice") {
      correct = selected === q.answer
    }

    if (q.type === "input") {
      correct = input.trim().toLowerCase() === q.answer.toLowerCase()
    }

    if (q.type === "arrange") {
      correct = shuffled.join(" ") === q.answer
    }

    if (correct) {
      setXP(xp + lesson.xp)
      setResult("correct")
      playSound("correct")
    } else {
      setResult("wrong")
      setLife(life - 1)
      playSound("wrong")
    }

    if (life <= 1 && !correct) {
      alert("💀 Hết mạng! Bài học kết thúc.")
      // Reset
      setIndex(0)
      setXP(0)
      setLife(3)
      setInput("")
      setSelected("")
      setResult("")
      return
    }

    next()
  }

  return (
    <div className="p-4 border rounded-xl max-w-xl mx-auto">

      {/* ❤️ Life */}
      <p className="mb-2 text-lg font-semibold">❤️ {life}</p>

      {/* 📊 Progress */}
      <div className="w-full bg-gray-200 h-3 rounded mb-4">
        <div
          className="bg-green-500 h-3 rounded transition-all"
          style={{
            width: `${((index + 1) / lesson.questions.length) * 100}%`
          }}
        />
      </div>

      {/* ❓ Question */}
      <h2 className="mb-4 text-lg font-bold">
        {q.question}
        <button
          onClick={() => speak(q.question)}
          className="ml-2 text-blue-500 hover:text-blue-700 transition"
          title="Phát âm câu hỏi"
        >
          🔊
        </button>
      </h2>

      {/* 🎯 Choice */}
      {q.type === "choice" && (
        <div>
          {q.options?.map((o) => (
            <button
              key={o}
              onClick={() => setSelected(o)}
              className={`block w-full mb-2 p-2 rounded transition ${
                selected === o ? "bg-blue-400 text-white font-semibold" : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {/* ✍️ Input */}
      {q.type === "input" && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && check()}
          placeholder="Nhập câu trả lời... (Enter để gửi)"
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      )}

      {/* 🔀 Arrange */}
      {q.type === "arrange" && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Nhấp vào từ để di chuyển:</p>
          <div className="flex flex-wrap gap-2">
            {shuffled.map((w, i) => (
              <button
                key={i}
                onClick={() => {
                  const newArr = [...shuffled]
                  newArr.splice(i, 1)
                  setShuffled([...newArr, w])
                }}
                className="p-2 bg-gray-300 hover:bg-gray-400 rounded transition cursor-move"
                title="Kéo từ này về cuối"
              >
                {w}
              </button>
            ))}
          </div>
          {shuffled.length > 0 && (
            <p className="text-sm mt-2 text-gray-700">
              Kết quả: <strong>{shuffled.join(" ")}</strong>
            </p>
          )}
        </div>
      )}

      {/* ✅ Button */}
      <button
        onClick={check}
        className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full font-semibold transition"
      >
        Kiểm tra
      </button>

      {/* 🎉 Result */}
      {result === "correct" && (
        <div className="bg-green-500 text-white p-3 mt-3 rounded animate-bounce">
          ✅ Chính xác! +{lesson.xp} XP
        </div>
      )}

      {result === "wrong" && (
        <div className="bg-red-500 text-white p-3 mt-3 rounded">
          ❌ Sai! Đáp án: <strong>{q.answer}</strong>
        </div>
      )}

      {/* ⭐ XP */}
      <p className="mt-3 text-right text-sm text-gray-600">
        ⭐ XP trong bài: <strong className="text-lg text-yellow-600">{xp}</strong>
      </p>
    </div>
  )
}
