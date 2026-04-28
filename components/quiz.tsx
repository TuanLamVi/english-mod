"use client"

import { useState } from "react"

export default function Quiz({ lesson }) {
  const [index, setIndex] = useState(0)
  const [xp, setXP] = useState(0)
  const [input, setInput] = useState("")
  const [selected, setSelected] = useState("")
  const [shuffled, setShuffled] = useState([])

  const q = lesson.questions[index]

  // random cho arrange
  useState(() => {
    if (q.type === "arrange") {
      setShuffled([...q.words].sort(() => Math.random() - 0.5))
    }
  }, [index])

  const next = () => {
    if (index < lesson.questions.length - 1) {
      setIndex(index + 1)
      setInput("")
      setSelected("")
    } else {
      alert("🎉 Hoàn thành!")
    }
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
      alert("✅ Đúng!")
    } else {
      alert("❌ Sai! Đáp án: " + q.answer)
    }

    next()
  }

  return (
    <div className="p-4 border rounded-xl">
      <h2 className="mb-4">{q.question}</h2>

      {/* CHOICE */}
      {q.type === "choice" && (
        <div>
          {q.options.map((o) => (
            <button
              key={o}
              onClick={() => setSelected(o)}
              className={`block w-full mb-2 p-2 rounded ${
                selected === o ? "bg-blue-400" : "bg-gray-200"
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}

      {/* INPUT */}
      {q.type === "input" && (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Nhập câu trả lời..."
          className="border p-2 w-full mb-3"
        />
      )}

      {/* ARRANGE */}
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

      <button
        onClick={check}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
      >
        Kiểm tra
      </button>

      <p className="mt-2">XP: {xp}</p>
    </div>
  )
}
