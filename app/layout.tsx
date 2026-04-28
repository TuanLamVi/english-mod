import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"

const inter = Inter({ subsets: ["latin", "vietnamese"] })

export const metadata: Metadata = {
  title: "English Mod - Học Tiếng Anh Online",
  description: "Ứng dụng học tiếng Anh tương tác với hệ thống gamification, achievement, và leaderboard",
  keywords: ["English", "Learning", "Education", "Game", "Quiz"],
  authors: [{ name: "TuanLamVi" }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://english-mod.vercel.app",
    title: "English Mod - Học Tiếng Anh Online",
    description: "Ứng dụng học tiếng Anh tương tác",
    images: [
      {
        url: "https://via.placeholder.com/1200x630?text=English+Mod",
        width: 1200,
        height: 630,
        alt: "English Mod"
      }
    ]
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
