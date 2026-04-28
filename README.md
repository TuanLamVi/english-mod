# 📚 English Mod - Ứng Dụng Học Tiếng Anh Online

![English Mod](https://img.shields.io/badge/English-Mod-blue?style=flat-square&logo=react)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)

## 🎯 Về Ứng Dụng

**English Mod** là một nền tảng học tiếng Anh tương tác với hệ thống gamification, giúp người học tăng động lực và hiệu quả học tập thông qua:

- ⭐ Hệ thống XP và điểm số
- 🏅 8 thành tích (Achievements) để mở khóa
- 🔥 Streak system - Duy trì chuỗi học hàng ngày
- 📊 Dashboard thống kê chi tiết
- 🏆 Leaderboard - So sánh với người dùng khác
- 💎 Premium system - Mở khóa bài học với Pi Network

## ✨ Tính Năng

### 📖 Bài Học Tương Tác
- **8 bài học** về tiếng Anh cơ bản
- **24+ câu hỏi** với 3 loại:
  - ✅ Chọn đáp án (Multiple choice)
  - ✍️ Nhập liệu (Input)
  - 🔀 Sắp xếp (Arrange)
- 🔊 Text-to-speech cho phát âm
- ❤️ 3 mạng sống (Lives system)

### 🎮 Gamification
- ⭐ Kiếm XP cho mỗi câu trả lời đúng
- 🏅 Mở khóa Achievement khi đạt milestone
- 🔥 Streak system - Học liên tục để tăng streak
- 📊 Dashboard cập nhật realtime
- 🏆 Bảng xếp hạng toàn cầu

### 💎 Premium Features
- 🔓 Mở khóa bài học với 1 Pi Network
- 💾 Lưu trữ dữ liệu trên cloud
- 📱 Hỗ trợ tất cả thiết bị

## 🚀 Công Nghệ Sử Dụng

- **Frontend**: Next.js 15+ (React 19)
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Storage**: localStorage + Pi Network
- **Sound**: Web Audio API + MP3 fallback
- **Animation**: Tailwind Animate + CSS Custom

## 📦 Cài Đặt

### Yêu cầu
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone Repository
```bash
git clone https://github.com/TuanLamVi/english-mod.git
cd english-mod
```

### Bước 2: Cài Đặt Dependencies
```bash
npm install
```

### Bước 3: Chạy Development Server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) trong trình duyệt của bạn.

### Bước 4: Build & Deploy
```bash
npm run build
npm start
```

## 📁 Cấu Trúc Project

```
english-mod/
├── app/
│   ├── page.tsx                 # Redirect to /learn
│   ├── learn/
│   │   └── page.tsx             # Main learning page
│   ├── stats/
│   │   └── page.tsx             # Statistics & achievements
│   ├── about/
│   │   └── page.tsx             # About page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── quiz.tsx                 # Quiz component
│   ├── navbar.tsx               # Navigation bar
│   ├── stats-dashboard.tsx      # Stats display
│   ├── achievements-display.tsx # Achievements display
│   └── leaderboard.tsx          # Leaderboard
├── lib/
│   ├── lesson-data.js           # Dữ liệu bài học
│   ├── analytics.ts             # Analytics & stats
│   ├── achievements.ts          # Achievements system
│   └── pi-payment-simplified.ts # Payment handling
└── public/
    └── sounds/                  # Sound files
        ├── correct.mp3
        └── wrong.mp3
```

## 🎯 Cách Sử Dụng

### Học Bài
1. Truy cập trang chủ → Bấm "📖 Học"
2. Chọn bài học (bài 1 miễn phí, bài khác cần Premium)
3. Trả lời câu hỏi và kiếm XP
4. Hoàn thành bài → Nhận thêm XP

### Mở Khóa Premium
1. Bấm nút "💎 Mở khóa (1 Pi)"
2. Hoàn thành thanh toán Pi Network
3. Truy cập tất cả bài học

### Xem Thống Kê
1. Vào "📊 Thống Kê"
2. Xem tab "Thống Kê" → Toàn bộ tiến độ
3. Xem tab "Thành Tích" → Mở khóa achievements
4. Xem tab "Bảng Xếp Hạng" → So sánh với người dùng

## 📊 Achievement Hệ Thống

| ID | Tên | Mô Tả | Target | Reward |
|----|----|-------|--------|--------|
| first_step | Bước Đầu Tiên | Hoàn thành bài đầu | 1 bài | +10 XP |
| hundred_xp | Trăm XP | Đạt 100 XP | 100 XP | +25 XP |
| five_hundred_xp | Năm Trăm XP | Đạt 500 XP | 500 XP | +50 XP |
| thousand_xp | Nghìn XP | Đạt 1000 XP | 1000 XP | +100 XP |
| perfect_accuracy | Hoàn Hảo | Đạt 95% accuracy | 95% | +75 XP |
| seven_day_streak | Một Tuần Liên Tục | 7 ngày liên tiếp | 7 ngày | +100 XP |
| all_lessons | Toàn Bộ Khóa Học | Hoàn thành 8 bài | 8 bài | +200 XP |
| speed_learner | Học Nhanh | 3 bài trong 1 ngày | 3 bài | +50 XP |

## 🔧 API Reference

### Analytics
```typescript
// Lấy thống kê người dùng
const stats = getUserStats(): UserStats

// Cập nhật thống kê
updateUserStats(updates: Partial<UserStats>): void

// Update streak
updateStreak(): void

// Lấy accuracy
calculateAccuracy(correct: number, total: number): number
```

### Achievements
```typescript
// Lấy danh sách achievements
const achievements = getAchievements(): Achievement[]

// Mở khóa achievement
unlockAchievement(achievementId: string): void

// Kiểm tra achievements cần mở
const newAchievements = checkAchievements(
  totalXP, accuracy, streak, lessonsCompleted
): string[]
```

### Payment
```typescript
// Thanh toán Pi
const success = await payWithPi(amount: number): Promise<boolean>

// Kiểm tra Premium status
const isPremium = checkPremiumStatus(): boolean

// Đặt Premium status
setPremiumStatus(isPremium: boolean): void
```

## 🌐 Deployment

### Deploy lên Vercel
```bash
npm install -g vercel
vercel
```

### Deploy lên Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.next
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
PI_API_KEY=your_pi_api_key
```

## 🐛 Known Issues

- Sound files cần được thêm vào `public/sounds/`
- Leaderboard hiện chỉ là mock data
- Pi Network integration cần API key thực

## 🚀 Upcoming Features

- [ ] Authentication system (Google, GitHub)
- [ ] Real leaderboard + database
- [ ] Multiplayer quiz battles
- [ ] Custom quiz creation
- [ ] Mobile app (React Native)
- [ ] AI-powered personalized learning
- [ ] Video tutorials

## 📄 License

MIT License - Xem file [LICENSE](LICENSE) để biết chi tiết.

## 👨‍💻 Tác Giả

**TuanLamVi**
- GitHub: [@TuanLamVi](https://github.com/TuanLamVi)
- Email: quychau9x@gmail.com

## 🙏 Cảm Ơn

Cảm ơn bạn đã sử dụng English Mod! Hãy để lại star ⭐ nếu bạn thích dự án này.

---

**Happy Learning! 🚀📚**
