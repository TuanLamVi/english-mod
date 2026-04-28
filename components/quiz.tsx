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

  const q = lesson.questions[index]

  // 🔊 Text to speech
  const speak = (text: string) => {
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = "en-US"
    speechSynthesis.speak(utter)
  }

  // 🔊 Sound đúng/sai
  const playSound = (type: "correct" | "wrong") => {
    const audio = new Audio(
      type === "correct"
        ? "/sounds/correct.mp3"
        : "/sounds/wrong.mp3"
    )
    audio.play()
  }

  // Shuffle cho dạng arrange
  useEffect(() => {
    if (q.type === "arrange") {
      setShuffled([...q.words].sort(() => Math.random() - 0.5))
    }
  }, [index])

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
      }
    }, 800)
  }

  const check = () => {
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
      alert("💀 Hết mạng!")
      return
    }

    next()
  }

  return (
    <div className="p-4 border rounded-xl max-w-xl mx-auto">

      {/* ❤️ Life */}
      <p className="mb-2">❤️ {life}</p>

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
          className="ml-2 text-blue-500"
        >
          🔊
        </button>
      </h2>

      {/* 🎯 Choice */}
      {q.type === "choice" && (
        <div>
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => setSelected(o)}
              className={`block w-full mb-2 p-2 rounded ${
                selected === o ? "bg-blue-400 text-white" : "bg-gray-200"
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
          placeholder="Nhập câu trả lời..."
          className="border p-2 w-full mb-3"
        />
      )}

      {/* 🔀 Arrange */}
      {q.type === "arrange" && (
        <div>
          {shuffled.map((w, i) => (
            <button
              key={i}
              onClick={() => {
                const newArr = [...shuffled]
                newArr.splice(i, 1)
                setShuffled([...newArr, w])
              }}
              className="m-1 p-2 bg-gray-300 rounded"
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {/* ✅ Button */}
      <button
        onClick={check}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded w-full"
      >
        Kiểm tra
      </button>

      {/* 🎉 Result */}
      {result === "correct" && (
        <div className="bg-green-500 text-white p-3 mt-3 rounded">
          ✅ Chính xác!
        </div>
      )}

      {result === "wrong" && (
        <div className="bg-red-500 text-white p-3 mt-3 rounded">
          ❌ Sai! Đáp án: {q.answer}
        </div>
      )}

      {/* ⭐ XP */}
      <p className="mt-3 text-right">XP: {xp}</p>
    </div>
  )
}
