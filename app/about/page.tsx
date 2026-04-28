export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12 pt-12">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold mb-4">English Mod</h1>
          <p className="text-xl text-gray-600 mb-6">
            Nền tảng học tiếng Anh tương tác với gamification
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <span className="badge badge-success">✅ Miễn Phí</span>
            <span className="badge badge-warning">🎮 Gamification</span>
            <span className="badge badge-error">🏆 Achievement</span>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">✨ Tính Năng Chính</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold mb-2">Quiz Tương Tác</h3>
              <p className="text-gray-600">
                Học qua 3 dạng câu hỏi khác nhau: Chọn đáp án, nhập liệu, sắp xếp câu
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl font-bold mb-2">Hệ Thống XP</h3>
              <p className="text-gray-600">
                Kiếm XP cho mỗi câu trả lời đúng và mở khóa bài học mới
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">🏅</div>
              <h3 className="text-xl font-bold mb-2">Achievement</h3>
              <p className="text-gray-600">
                Mở khóa 8 thành tích khác nhau khi đạt các mục tiêu
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">🔥</div>
              <h3 className="text-xl font-bold mb-2">Streak System</h3>
              <p className="text-gray-600">
                Duy trì chuỗi học tập hàng ngày để tăng động lực
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-gray-600">
                So sánh điểm số với người dùng khác và leo bảng xếp hạng
              </p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-xl font-bold mb-2">Thống Kê Chi Tiết</h3>
              <p className="text-gray-600">
                Xem toàn bộ thống kê học tập, độ chính xác, và tiến độ
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">📈 Bởi Số</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-4xl font-bold text-blue-600">8</p>
              <p className="text-gray-600 mt-2">Bài Học</p>
            </div>
            <div className="card text-center">
              <p className="text-4xl font-bold text-green-600">24+</p>
              <p className="text-gray-600 mt-2">Câu Hỏi</p>
            </div>
            <div className="card text-center">
              <p className="text-4xl font-bold text-yellow-600">8</p>
              <p className="text-gray-600 mt-2">Achievements</p>
            </div>
            <div className="card text-center">
              <p className="text-4xl font-bold text-red-600">∞</p>
              <p className="text-gray-600 mt-2">Lần Luyện Tập</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-12 mb-12">
          <h2 className="text-3xl font-bold mb-4">Bắt Đầu Học Ngay! 🚀</h2>
          <p className="text-lg mb-6 opacity-90">
            Không cần đăng ký, học miễn phí ngay bây giờ
          </p>
          <a
            href="/learn"
            className="inline-block bg-white text-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Vào Học →
          </a>
        </section>

        {/* Footer Info */}
        <section className="text-center text-gray-600 py-12 border-t border-gray-300">
          <p className="mb-2">Made with ❤️ by TuanLamVi</p>
          <p className="text-sm">© 2026 English Mod. All rights reserved.</p>
        </section>
      </div>
    </main>
  )
}
