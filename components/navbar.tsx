"use client"

import Link from "next/link"
import { useState } from "react"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700">
          <span className="text-2xl">📚</span>
          English Mod
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/learn" className="text-gray-700 hover:text-blue-600 font-semibold transition">
            📖 Học
          </Link>
          <Link href="/stats" className="text-gray-700 hover:text-blue-600 font-semibold transition">
            📊 Thống Kê
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 font-semibold transition">
            ℹ️ Về Tôi
          </Link>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            🔓 Đăng Nhập
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50 border-t border-gray-200 p-4 space-y-3">
          <Link href="/learn" className="block text-gray-700 hover:text-blue-600 font-semibold">
            📖 Học
          </Link>
          <Link href="/stats" className="block text-gray-700 hover:text-blue-600 font-semibold">
            📊 Thống Kê
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-blue-600 font-semibold">
            ℹ️ Về Tôi
          </Link>
          <button className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
            🔓 Đăng Nhập
          </button>
        </div>
      )}
    </nav>
  )
}
