"use client"

import { lessons } from "@/lib/lesson-data"
import Quiz from "@/components/Quiz"
import { payWithPi } from "@/lib/pi-payment"

export default function LearnPage() {
  const premium = localStorage.getItem("premium") === "true"

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">📚 Học tiếng Anh</h1>

      {lessons.map((lesson, index) => {
        if (!premium && index > 0) {
          return (
            <div key={lesson.id} className="p-4 border rounded mb-4">
              🔒 Bài này cần Premium

              <button
                onClick={async () => {
                  await payWithPi(1)
                  localStorage.setItem("premium", "true")
                  location.reload()
                }}
                className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                💎 Mở khóa (1 Pi)
              </button>
            </div>
          )
        }

        return <Quiz key={lesson.id} lesson={lesson} />
      })}
    </main>
  )
}
