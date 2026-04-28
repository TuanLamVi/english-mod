"use client"

import { useState } from "react"

export default function Quiz({ lesson }) {
  const [index, setIndex] = useState(0)
  const [xp, setXP] = useState(0)

  const q = lesson.questions[index]

  const choose = (opt: string) => {
    if (opt === q.answer) {
      setXP(xp + lesson.xp)
    }

    if (index < lesson.questions.length - 1) {
      setIndex(index + 1)
    } else {
      const oldXP = Number(localStorage.getItem("xp") || 0)
      localStorage.setItem("xp", (oldXP + xp).toString())

      alert("🎉 Hoàn thành! +" + xp + " XP")
    }
  }

  return (
    <div className="p-4 border rounded-xl mb-4">
      <h2 className="mb-3">{q.question}</h2>

      {q.options.map((o) => (
        <button
          key={o}
          onClick={() => choose(o)}
          className="block w-full mb-2 p-2 bg-gray-200 rounded"
        >
          {o}
        </button>
      ))}
    </div>
  )
}
