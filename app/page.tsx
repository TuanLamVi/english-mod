'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Star, Zap, BookOpen, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  level: number;
  phrases: Phrase[];
}

interface Phrase {
  english: string;
  vietnamese: string;
  example: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

interface WrongAnswer {
  lessonId: string;
  lessonTitle: string;
  question: QuizQuestion;
  userAnswer: number;
}

// Sound Manager Utility - Safe Web Audio API wrapper
const createSoundManager = () => {
  const playSound = (frequency: number, duration: number, type: 'sine' | 'square' = 'sine') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      // Silently fail if audio context not available
      console.log('[v0] Sound not available');
    }
  };

  const speakEnglish = (text: string) => {
    try {
      const synth = window.speechSynthesis;
      synth.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      synth.speak(utterance);
    } catch (e) {
      console.log('[v0] Speech synthesis not available');
    }
  };

  return {
    playCorrect: () => playSound(800, 0.3),
    playWrong: () => playSound(300, 0.2),
    playClick: () => playSound(600, 0.1),
    speakEnglish: speakEnglish
  };
};

const soundManager = createSoundManager();

const LESSONS: Lesson[] = [
  // Level 1 - Greetings
  {
    id: 'l1-1',
    title: 'Lời chào cơ bản',
    level: 1,
    phrases: [
      { english: 'Hello', vietnamese: 'Xin chào', example: 'Hello, how are you? - Xin chào, bạn khỏe không?' },
      { english: 'Hi', vietnamese: 'Chào', example: 'Hi! Nice to see you. - Chào! Vui được gặp bạn.' },
      { english: 'Good morning', vietnamese: 'Chào buổi sáng', example: 'Good morning, everyone! - Chào buổi sáng mọi người!' },
      { english: 'Good afternoon', vietnamese: 'Chào buổi chiều', example: 'Good afternoon, my friend. - Chào buổi chiều, bạn tôi.' },
      { english: 'Good evening', vietnamese: 'Chào buổi tối', example: 'Good evening, welcome! - Chào buổi tối, chào mừng!' },
      { english: 'Good night', vietnamese: 'Chúc ngủ ngon', example: 'Good night, sleep well. - Chúc ngủ ngon, ngủ ngon lành.' },
      { english: 'Goodbye', vietnamese: 'Tạm biệt', example: 'Goodbye, see you tomorrow! - Tạm biệt, gặp lại ngày mai!' },
      { english: 'Bye', vietnamese: 'Bye', example: 'Bye! Have a great day. - Bye! Có một ngày tuyệt vời.' }
    ]
  },
  // Level 1 - Numbers
  {
    id: 'l1-2',
    title: 'Số từ 1-10',
    level: 1,
    phrases: [
      { english: 'One', vietnamese: 'Một', example: 'I have one apple. - Tôi có một quả táo.' },
      { english: 'Two', vietnamese: 'Hai', example: 'There are two books. - Có hai cuốn sách.' },
      { english: 'Three', vietnamese: 'Ba', example: 'I like three colors. - Tôi thích ba màu.' },
      { english: 'Four', vietnamese: 'Bốn', example: 'There are four seasons. - Có bốn mùa.' },
      { english: 'Five', vietnamese: 'Năm', example: 'I have five fingers. - Tôi có năm ngón tay.' },
      { english: 'Six', vietnamese: 'Sáu', example: 'Six plus four is ten. - Sáu cộng bốn là mười.' },
      { english: 'Seven', vietnamese: 'Bảy', example: 'There are seven days. - Có bảy ngày.' },
      { english: 'Ten', vietnamese: 'Mười', example: 'Count to ten. - Đếm đến mười.' }
    ]
  },
  // Level 1 - Colors
  {
    id: 'l1-3',
    title: 'Màu sắc',
    level: 1,
    phrases: [
      { english: 'Red', vietnamese: 'Đỏ', example: 'The apple is red. - Quả táo là màu đỏ.' },
      { english: 'Blue', vietnamese: 'Xanh dương', example: 'The sky is blue. - Bầu trời là xanh dương.' },
      { english: 'Yellow', vietnamese: 'Vàng', example: 'The sun is yellow. - Mặt trời là vàng.' },
      { english: 'Green', vietnamese: 'Xanh lá', example: 'The grass is green. - Cỏ là xanh lá.' },
      { english: 'Black', vietnamese: 'Đen', example: 'This car is black. - Chiếc xe này màu đen.' },
      { english: 'White', vietnamese: 'Trắng', example: 'The snow is white. - Tuyết là trắng.' }
    ]
  },
  // Level 2 - Family
  {
    id: 'l2-1',
    title: 'Gia đình',
    level: 2,
    phrases: [
      { english: 'Mother', vietnamese: 'Mẹ', example: 'My mother is kind. - Mẹ tôi rất tốt bụng.' },
      { english: 'Father', vietnamese: 'Cha', example: 'My father works here. - Cha tôi làm việc ở đây.' },
      { english: 'Sister', vietnamese: 'Chị/Em gái', example: 'My sister is at school. - Chị/em gái của tôi ở trường.' },
      { english: 'Brother', vietnamese: 'Anh/Em trai', example: 'My brother plays football. - Anh/em trai của tôi chơi bóng.' },
      { english: 'Grandmother', vietnamese: 'Bà', example: 'My grandmother is very old. - Bà tôi rất già.' },
      { english: 'Grandfather', vietnamese: 'Ông', example: 'My grandfather tells stories. - Ông tôi kể chuyện.' }
    ]
  },
  // Level 2 - Food
  {
    id: 'l2-2',
    title: 'Thức ăn',
    level: 2,
    phrases: [
      { english: 'Apple', vietnamese: 'Táo', example: 'I like to eat apples. - Tôi thích ăn táo.' },
      { english: 'Bread', vietnamese: 'Bánh mì', example: 'I eat bread for breakfast. - Tôi ăn bánh mì lúc sáng.' },
      { english: 'Chicken', vietnamese: 'Gà', example: 'We cook chicken today. - Hôm nay chúng tôi nấu gà.' },
      { english: 'Rice', vietnamese: 'Cơm', example: 'Rice is very healthy. - Cơm rất tốt cho sức khỏe.' },
      { english: 'Water', vietnamese: 'Nước', example: 'Drink water every day. - Uống nước mỗi ngày.' },
      { english: 'Milk', vietnamese: 'Sữa', example: 'Children drink milk. - Trẻ em uống sữa.' }
    ]
  },
  // Level 2 - Daily Activities
  {
    id: 'l2-3',
    title: 'Hành động hàng ngày',
    level: 2,
    phrases: [
      { english: 'Sleep', vietnamese: 'Ngủ', example: 'I sleep eight hours. - Tôi ngủ tám tiếng.' },
      { english: 'Eat', vietnamese: 'Ăn', example: 'We eat lunch together. - Chúng ta ăn trưa cùng nhau.' },
      { english: 'Play', vietnamese: 'Chơi', example: 'Children play in the park. - Trẻ em chơi ở công viên.' },
      { english: 'Study', vietnamese: 'Học', example: 'I study English every day. - Tôi học tiếng Anh mỗi ngày.' },
      { english: 'Work', vietnamese: 'Làm việc', example: 'I work at the office. - Tôi làm việc tại văn phòng.' },
      { english: 'Read', vietnamese: 'Đọc', example: 'I read books before sleep. - Tôi đọc sách trước khi ngủ.' }
    ]
  }
];

const QUIZ_DATA: { [key: string]: QuizQuestion[] } = {
  'l1-1': [
    { question: 'Làm thế nào để nói "Xin chào" tiếng Anh?', options: ['Hello', 'Goodbye', 'Thank you', 'Good night'], correct: 0 },
    { question: '"Good morning" nghĩa là gì?', options: ['Tạm biệt', 'Chào buổi sáng', 'Đêm tốt', 'Cảm ơn'], correct: 1 },
    { question: '"Goodbye" dịch là?', options: ['Xin chào', 'Tạm biệt', 'Chào', 'Vui lòng'], correct: 1 },
    { question: '"Good evening" có nghĩa là gì?', options: ['Chào buổi sáng', 'Chào buổi chiều', 'Chào buổi tối', 'Chúc ngủ ngon'], correct: 2 },
    { question: 'Nếu bạn muốn nói "Tạm biệt", bạn nói gì?', options: ['Hi', 'Hello', 'Goodbye', 'Thanks'], correct: 2 },
    { question: '"Hi" có thể dùng thay thế cho?', options: ['Hello', 'Goodbye', 'Good night', 'Thank you'], correct: 0 },
    { question: 'Cách nào dùng để nói lúc trước khi đi ngủ?', options: ['Good morning', 'Good afternoon', 'Good evening', 'Good night'], correct: 3 },
    { question: '"Good afternoon" dùng khi nào?', options: ['Sáng', 'Trưa chiều', 'Tối', 'Đêm'], correct: 1 }
  ],
  'l1-2': [
    { question: '"Three" là số mấy?', options: ['2', '3', '4', '5'], correct: 1 },
    { question: 'Số 5 tiếng Anh là?', options: ['Four', 'Five', 'Six', 'Seven'], correct: 1 },
    { question: '"Ten" bằng bao nhiêu?', options: ['8', '9', '10', '11'], correct: 2 },
    { question: '"One" dịch là?', options: ['Hai', 'Ba', 'Một', 'Bốn'], correct: 2 },
    { question: 'Số 7 tiếng Anh là gì?', options: ['Five', 'Six', 'Seven', 'Eight'], correct: 2 },
    { question: '"Four" bằng bao nhiêu?', options: ['3', '4', '5', '6'], correct: 1 },
    { question: 'Số 6 tiếng Anh nói như thế nào?', options: ['Five', 'Six', 'Seven', 'Eight'], correct: 1 },
    { question: '"Two" là số mấy?', options: ['1', '2', '3', '4'], correct: 1 }
  ],
  'l1-3': [
    { question: '"Red" là màu gì?', options: ['Xanh', 'Vàng', 'Đỏ', 'Đen'], correct: 2 },
    { question: 'Màu xanh dương tiếng Anh là?', options: ['Black', 'Green', 'Blue', 'Yellow'], correct: 2 },
    { question: '"Yellow" dịch là?', options: ['Đỏ', 'Xanh', 'Vàng', 'Trắng'], correct: 2 },
    { question: '"Green" là màu nào?', options: ['Đỏ', 'Vàng', 'Xanh lá', 'Đen'], correct: 2 },
    { question: 'Tiếng Anh của "Trắng" là?', options: ['Black', 'White', 'Gray', 'Pink'], correct: 1 },
    { question: '"Black" dịch là?', options: ['Trắng', 'Xanh', 'Đen', 'Nâu'], correct: 2 },
    { question: 'Màu nào là "Red"?', options: ['Xanh dương', 'Đỏ', 'Vàng', 'Xanh lá'], correct: 1 },
    { question: '"Blue" có thể dùng để chỉ?', options: ['Mặt trời', 'Bầu trời', 'Cỏ', 'Máu'], correct: 1 }
  ],
  'l2-1': [
    { question: '"Mother" là ai?', options: ['Cha', 'Mẹ', 'Chị', 'Anh'], correct: 1 },
    { question: 'Tiếng Anh của "Cha" là?', options: ['Mother', 'Father', 'Brother', 'Sister'], correct: 1 },
    { question: '"Sister" dịch là?', options: ['Anh', 'Chị', 'Ông', 'Bà'], correct: 1 },
    { question: '"Brother" là ai trong gia đình?', options: ['Chị', 'Em gái', 'Anh/em trai', 'Bố'], correct: 2 },
    { question: 'Tiếng Anh của "Bà" là?', options: ['Grandfather', 'Grandmother', 'Aunt', 'Uncle'], correct: 1 },
    { question: '"Grandfather" dịch là?', options: ['Bà', 'Ông', 'Chú', 'Dì'], correct: 1 },
    { question: '"Father" là người nào?', options: ['Mẹ', 'Cha', 'Anh', 'Chị'], correct: 1 },
    { question: 'Tiếng Anh nói "Em gái" là?', options: ['Brother', 'Sister', 'Grandmother', 'Mother'], correct: 1 }
  ],
  'l2-2': [
    { question: '"Apple" là gì?', options: ['Bánh mì', 'Táo', 'Nước', 'Gà'], correct: 1 },
    { question: 'Tiếng Anh của "Gà" là?', options: ['Apple', 'Chicken', 'Rice', 'Bread'], correct: 1 },
    { question: '"Water" dịch là?', options: ['Cơm', 'Bánh', 'Nước', 'Gà'], correct: 2 },
    { question: '"Bread" là gì?', options: ['Cơm', 'Bánh mì', 'Nước', 'Sữa'], correct: 1 },
    { question: 'Tiếng Anh của "Cơm" là?', options: ['Bread', 'Rice', 'Milk', 'Chicken'], correct: 1 },
    { question: '"Milk" dịch là?', options: ['Nước', 'Sữa', 'Trà', 'Cà phê'], correct: 1 },
    { question: '"Rice" có thể là?', options: ['Trái cây', 'Đồ uống', 'Cơm', 'Bánh'], correct: 2 },
    { question: 'Nếu bạn muốn ăn gà, bạn nói?', options: ['Eat apple', 'Eat chicken', 'Eat rice', 'Eat bread'], correct: 1 }
  ],
  'l2-3': [
    { question: '"Sleep" nghĩa là?', options: ['Ăn', 'Chơi', 'Ngủ', 'Làm'], correct: 2 },
    { question: 'Tiếng Anh của "Học" là?', options: ['Eat', 'Study', 'Play', 'Work'], correct: 1 },
    { question: '"Play" dịch là?', options: ['Làm việc', 'Chơi', 'Học', 'Ăn'], correct: 1 },
    { question: '"Work" là gì?', options: ['Chơi', 'Học', 'Làm việc', 'Ăn'], correct: 2 },
    { question: 'Tiếng Anh của "Ăn" là?', options: ['Sleep', 'Play', 'Eat', 'Study'], correct: 2 },
    { question: '"Read" dịch là?', options: ['Viết', 'Đọc', 'Nói', 'Nghe'], correct: 1 },
    { question: 'Khi bạn đi ngủ, bạn...?', options: ['Play', 'Study', 'Work', 'Sleep'], correct: 3 },
    { question: '"Study" có thể là?', options: ['Chơi game', 'Học sách', 'Chạy', 'Bơi'], correct: 1 }
  ]
};

export default function App() {
  const [screen, setScreen] = useState<'home' | 'map' | 'lesson' | 'quiz' | 'quiz-result' | 'review'>('home');
  const [totalXP, setTotalXP] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [quizXP, setQuizXP] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewAnswered, setReviewAnswered] = useState(false);
  const [reviewSelectedAnswer, setReviewSelectedAnswer] = useState<number | null>(null);
  const [reviewCorrectCount, setReviewCorrectCount] = useState(0);

  // XP thresholds for unlocking levels - Updated
  const LEVEL_UNLOCK_XP = [0, 100, 301, 601, 1001, 1501, 2101, 2801, 3601, 4501];

  // Calculate current level based on XP ranges
  const getCurrentLevel = () => {
    if (totalXP >= 4501) return 10;
    if (totalXP >= 3601) return 9;
    if (totalXP >= 2801) return 8;
    if (totalXP >= 2101) return 7;
    if (totalXP >= 1501) return 6;
    if (totalXP >= 1001) return 5;
    if (totalXP >= 601) return 4;
    if (totalXP >= 301) return 3;
    if (totalXP >= 101) return 2;
    return 1;
  };

  const currentLevel = getCurrentLevel();

  // Check if a level is unlocked
  const isLevelUnlocked = (level: number) => {
    if (level < 1 || level > 10) return false;
    return totalXP >= LEVEL_UNLOCK_XP[level - 1];
  };

  // Shuffle array randomly
  const shuffleArray = (array: any[]) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  // Get lessons for a specific level
  const getLessonsForLevel = (level: number) => {
    return LESSONS.filter(lesson => lesson.level === level);
  };

  // Load XP and wrong answers from localStorage on mount
  useEffect(() => {
    const savedXP = localStorage.getItem('englishAdventureXP');
    if (savedXP) {
      setTotalXP(parseInt(savedXP, 10));
    }
    const savedWrong = localStorage.getItem('englishAdventureWrong');
    if (savedWrong) {
      setWrongAnswers(JSON.parse(savedWrong));
    }
    const savedSound = localStorage.getItem('englishAdventureSound');
    if (savedSound !== null) {
      setSoundEnabled(JSON.parse(savedSound));
    }
  }, []);

  // Save XP to localStorage
  useEffect(() => {
    localStorage.setItem('englishAdventureXP', totalXP.toString());
  }, [totalXP]);

  // Save wrong answers to localStorage
  useEffect(() => {
    localStorage.setItem('englishAdventureWrong', JSON.stringify(wrongAnswers));
  }, [wrongAnswers]);

  // Save sound preference to localStorage
  useEffect(() => {
    localStorage.setItem('englishAdventureSound', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  // HOME SCREEN
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Sound Toggle Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="bg-white rounded-full p-3 shadow-md hover:shadow-lg transition-all"
              title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-blue-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="text-6xl mb-3">🚀</div>
            <h1 className="text-5xl font-bold text-blue-900 mb-2">English Adventure</h1>
            <p className="text-lg text-blue-600">Học tiếng Anh qua trò chơi</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">Level Hiện Tại</span>
                <Star className="w-5 h-5" />
              </div>
              <p className="text-5xl font-bold">{currentLevel}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-3xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold opacity-90">Tổng XP</span>
                <Zap className="w-5 h-5" />
              </div>
              <p className="text-5xl font-bold">{totalXP}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-10 bg-white rounded-full p-4 shadow-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-blue-900">Tiến độ Level</span>
              <span className="text-sm text-blue-600">{totalXP % 100}/100</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(totalXP % 100)}%` }}
              />
            </div>
          </div>

          {/* Main Button */}
          <button
            onClick={() => setScreen('map')}
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-5 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center justify-center gap-3 mb-4"
          >
            <BookOpen className="w-6 h-6" />
            Bắt đầu học
          </button>

          {/* Review Button */}
          {wrongAnswers.length > 0 && (
            <button
              onClick={() => setScreen('review')}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-4 rounded-3xl shadow-lg hover:shadow-xl hover:scale-105 transition-all text-lg flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-5 h-5" />
              Ôn tập ({wrongAnswers.length} câu sai)
            </button>
          )}
        </div>
      </div>
    );
  }

  // MAP SCREEN - Level Selection with Progress Map
  if (screen === 'map') {
    const levelIcons = ['🌟', '⭐', '✨', '💫', '🎯', '🎪', '🎭', '🎨', '🎸', '🏆'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-700"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Trở về
          </button>

          {/* Header with XP and Level */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-md">
              <p className="text-xs font-semibold opacity-90">Level Hiện Tại</p>
              <p className="text-3xl font-bold">{currentLevel}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl p-4 text-white shadow-md">
              <p className="text-xs font-semibold opacity-90">Tổng XP</p>
              <p className="text-3xl font-bold">{totalXP}</p>
            </div>
          </div>

          {/* Progress Map Title */}
          <h2 className="text-3xl font-bold text-blue-900 mb-8">Bản Đồ Học Tập</h2>

          {/* Level Progress Map - Zigzag Layout */}
          <div className="space-y-6">
            {/* Row 1: Levels 1-3 */}
            <div className="flex justify-between items-center gap-2 px-2">
              {[1, 2, 3].map(level => {
                const unlocked = isLevelUnlocked(level);
                return (
                  <button
                    key={level}
                    onClick={() => {
                      if (unlocked) {
                        const lessonsInLevel = getLessonsForLevel(level);
                        if (lessonsInLevel.length > 0) {
                          setSelectedLevel(level);
                          setSelectedLesson(lessonsInLevel[0]);
                          setScreen('lesson');
                        }
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all transform ${
                      unlocked
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg hover:scale-110 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl">{levelIcons[level - 1]}</div>
                    <div className="text-xs font-bold">L{level}</div>
                  </button>
                );
              })}
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center mb-2">
              <div className="w-1 h-6 bg-blue-300" />
            </div>

            {/* Row 2: Levels 4-6 */}
            <div className="flex justify-between items-center gap-2 px-2">
              {[4, 5, 6].map(level => {
                const unlocked = isLevelUnlocked(level);
                return (
                  <button
                    key={level}
                    onClick={() => {
                      if (unlocked) {
                        const lessonsInLevel = getLessonsForLevel(level);
                        if (lessonsInLevel.length > 0) {
                          setSelectedLevel(level);
                          setSelectedLesson(lessonsInLevel[0]);
                          setScreen('lesson');
                        }
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all transform ${
                      unlocked
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg hover:scale-110 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl">{levelIcons[level - 1]}</div>
                    <div className="text-xs font-bold">L{level}</div>
                  </button>
                );
              })}
            </div>

            {/* Connecting Line */}
            <div className="flex justify-center mb-2">
              <div className="w-1 h-6 bg-blue-300" />
            </div>

            {/* Row 3: Levels 7-10 */}
            <div className="flex justify-between items-center gap-2 px-2">
              {[7, 8, 9, 10].map(level => {
                const unlocked = isLevelUnlocked(level);
                return (
                  <button
                    key={level}
                    onClick={() => {
                      if (unlocked) {
                        const lessonsInLevel = getLessonsForLevel(level);
                        if (lessonsInLevel.length > 0) {
                          setSelectedLevel(level);
                          setSelectedLesson(lessonsInLevel[0]);
                          setScreen('lesson');
                        }
                      }
                    }}
                    disabled={!unlocked}
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all transform ${
                      unlocked
                        ? 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-lg hover:scale-110 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-2xl">{levelIcons[level - 1]}</div>
                    <div className="text-xs font-bold">L{level}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unlock Info */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-4 border-2 border-blue-200">
            <p className="text-sm text-blue-900">
              <strong>Mẹo:</strong> Hoàn thành quiz để kiếm XP và mở khóa các level mới!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LESSON SCREEN - Step-by-step Phrase Learning
  if (screen === 'lesson' && selectedLesson) {
    const phrases = selectedLesson.phrases;
    const currentPhrase = phrases[phraseIndex];
    const progress = Math.round(((phraseIndex + 1) / phrases.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setScreen('map');
              setPhraseIndex(0);
              setSelectedLesson(null);
            }}
            className="flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Trở về
          </button>

          {/* Header with Lesson Title and Progress */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-900 mb-2">{selectedLesson.title}</h2>
            <p className="text-blue-600 mb-4">Từ vựng {phraseIndex + 1} / {phrases.length}</p>
            
            {/* Progress Bar */}
            <div className="bg-blue-100 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Main Lesson Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            {/* English Word - Large */}
            <div className="text-center mb-6">
              <div className="text-6xl font-bold text-blue-600 mb-3 break-words">
                {currentPhrase.english}
              </div>
              <div className="text-sm text-blue-400 font-semibold mb-4">English</div>
              
              {/* Listen Button */}
              <button
                onClick={() => {
                  soundEnabled && soundManager.playClick();
                  soundManager.speakEnglish(currentPhrase.english);
                }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all"
              >
                <span>🔊</span>
                <span>Nghe</span>
              </button>
            </div>

            {/* Vietnamese Translation */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6 text-center border-2 border-blue-200">
              <p className="text-2xl font-bold text-blue-900 mb-1">{currentPhrase.vietnamese}</p>
              <p className="text-sm text-blue-600">Tiếng Việt</p>
            </div>

            {/* Example */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border-l-4 border-blue-500">
              <p className="text-sm text-blue-600 font-semibold mb-2">Ví dụ:</p>
              <p className="text-blue-900 italic">{currentPhrase.example}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {phraseIndex > 0 && (
              <button
                onClick={() => {
                  soundEnabled && soundManager.playClick();
                  setPhraseIndex(phraseIndex - 1);
                }}
                className="flex-1 bg-white border-2 border-blue-400 text-blue-600 font-bold py-4 rounded-2xl hover:bg-blue-50 transition-all"
              >
                ← Trước
              </button>
            )}
            
            {phraseIndex < phrases.length - 1 ? (
              <button
                onClick={() => {
                  soundEnabled && soundManager.playClick();
                  setPhraseIndex(phraseIndex + 1);
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                onClick={() => {
                  soundEnabled && soundManager.playClick();
                  setScreen('quiz');
                  setPhraseIndex(0);
                  setQuizIndex(0);
                  setSelectedAnswer(null);
                  setAnswered(false);
                  setQuizXP(0);
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Bắt đầu Quiz! 🎯
              </button>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {phrases.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundEnabled && soundManager.playClick();
                  setPhraseIndex(idx);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === phraseIndex 
                    ? 'bg-blue-600 w-8' 
                    : 'bg-blue-300 hover:bg-blue-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SCREEN - Multiple Choice Questions
  if (screen === 'quiz' && selectedLesson) {
    const allQuestions = QUIZ_DATA[selectedLesson.id] || [];
    const questions = quizQuestions.length > 0 ? quizQuestions : shuffleArray(allQuestions);
    
    if (questions.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setScreen('lesson')}
              className="flex items-center gap-2 text-blue-600 font-semibold mb-8 hover:text-blue-700"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
              Trở về
            </button>
            <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
              <p className="text-blue-600">Chưa có câu hỏi cho bài học này</p>
            </div>
          </div>
        </div>
      );
    }

    if (quizQuestions.length === 0) {
      setQuizQuestions(questions);
    }

    const currentQuestion = questions[quizIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;
    const progress = Math.round(((quizIndex + 1) / questions.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setScreen('lesson');
              setQuizIndex(0);
              setSelectedAnswer(null);
              setAnswered(false);
              setQuizXP(0);
              setCorrectCount(0);
              setQuizQuestions([]);
            }}
            className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-700"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Trở về
          </button>

          {/* Quiz Header */}
          <div className="mb-6">
            <p className="text-sm text-blue-600 font-semibold mb-2">Câu hỏi {quizIndex + 1} / {questions.length}</p>
            <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center leading-relaxed">
              {currentQuestion.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!answered) {
                      soundEnabled && soundManager.playClick();
                      setSelectedAnswer(idx);
                      setAnswered(true);
                      if (idx === currentQuestion.correct) {
                        soundEnabled && soundManager.playCorrect();
                        setTotalXP(totalXP + 10);
                        setQuizXP(quizXP + 10);
                        setCorrectCount(correctCount + 1);
                      } else {
                        soundEnabled && soundManager.playWrong();
                        // Track wrong answer for review
                        setWrongAnswers([...wrongAnswers, {
                          lessonId: selectedLesson.id,
                          lessonTitle: selectedLesson.title,
                          question: currentQuestion,
                          userAnswer: idx
                        }]);
                      }
                    }
                  }}
                  disabled={answered}
                  className={`w-full p-4 rounded-2xl font-semibold transition-all transform text-left ${
                    answered
                      ? idx === currentQuestion.correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-700 scale-105'
                        : idx === selectedAnswer
                        ? 'bg-red-100 border-2 border-red-400 text-red-700'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                      : 'bg-white border-2 border-blue-300 text-blue-900 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {answered && (
            <div className={`rounded-2xl p-4 text-center font-bold text-lg mb-6 ${
              isCorrect
                ? 'bg-green-100 text-green-700 border-2 border-green-400'
                : 'bg-red-100 text-red-700 border-2 border-red-400'
            }`}>
              {isCorrect ? '✓ Đúng rồi! +10 XP' : '✗ Sai rồi'}
            </div>
          )}

          {/* Next Button */}
          {answered && (
            <button
              onClick={() => {
                soundEnabled && soundManager.playClick();
                if (quizIndex < questions.length - 1) {
                  setQuizIndex(quizIndex + 1);
                  setSelectedAnswer(null);
                  setAnswered(false);
                } else {
                  setScreen('quiz-result');
                }
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {quizIndex === questions.length - 1 ? 'Xem kết quả' : 'Câu tiếp theo'}
            </button>
          )}
        </div>
      </div>
    );
  }

  // QUIZ RESULT SCREEN
  if (screen === 'quiz-result') {
    const allQuestions = selectedLesson ? QUIZ_DATA[selectedLesson.id] || [] : [];
    const total = allQuestions.length;
    const score = Math.round((correctCount / total) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            {/* Celebration Icon */}
            <div className="text-6xl mb-4 animate-bounce">
              {score >= 75 ? '🎉' : score >= 50 ? '😊' : '💪'}
            </div>

            {/* Scores */}
            <h2 className="text-4xl font-bold text-blue-900 mb-2">Kết quả Quiz</h2>
            <p className="text-blue-600 mb-8">{selectedLesson?.title}</p>

            {/* Score Percentage */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 text-white shadow-lg">
                <p className="text-sm opacity-90 mb-2">Điểm số</p>
                <p className="text-6xl font-bold">{score}%</p>
                <p className="text-sm opacity-90 mt-2">{correctCount}/{total} câu đúng</p>
              </div>
            </div>

            {/* XP Earned */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-6 text-white shadow-lg mb-8">
              <p className="text-sm font-semibold opacity-90">XP nhận được</p>
              <p className="text-5xl font-bold">+{quizXP}</p>
            </div>

            {/* Feedback Message */}
            <p className="text-lg text-blue-900 font-semibold mb-8">
              {score >= 80 ? 'Tuyệt vời! Bạn làm rất tốt!' : 
               score >= 60 ? 'Tốt lắm! Hãy tiếp tục luyện tập!' : 
               'Cố gắng lên! Luyện tập thêm để làm tốt hơn.'}
            </p>

            {/* Home Button */}
            <button
              onClick={() => {
                setScreen('home');
                setSelectedLesson(null);
                setQuizIndex(0);
                setSelectedAnswer(null);
                setAnswered(false);
                setQuizXP(0);
                setCorrectCount(0);
                setQuizQuestions([]);
              }}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
            >
              Về Trang Chủ
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REVIEW SCREEN - Practice Wrong Answers
  if (screen === 'review') {
    if (wrongAnswers.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
              <div className="text-5xl mb-4">✨</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Không có câu sai!</h2>
              <p className="text-blue-600 mb-8">Bạn đã trả lời đúng tất cả các câu hỏi. Tiếp tục cố gắng!</p>
              <button
                onClick={() => setScreen('home')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl hover:shadow-lg transition-all"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentWrong = wrongAnswers[reviewIndex];
    const isReviewCorrect = reviewSelectedAnswer === currentWrong.question.correct;
    const progress = Math.round(((reviewIndex + 1) / wrongAnswers.length) * 100);

    if (reviewAnswered && reviewIndex === wrongAnswers.length - 1) {
      // Show review results after all questions
      const reviewScore = Math.round((reviewCorrectCount / wrongAnswers.length) * 100);
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="text-6xl mb-4">{reviewScore >= 70 ? '🌟' : '💪'}</div>
              <h2 className="text-3xl font-bold text-blue-900 mb-2">Kết quả Ôn Tập</h2>
              
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg mb-6">
                <p className="text-sm opacity-90 mb-2">Điểm số</p>
                <p className="text-5xl font-bold">{reviewScore}%</p>
                <p className="text-sm opacity-90 mt-2">{reviewCorrectCount}/{wrongAnswers.length} câu đúng</p>
              </div>

              {reviewScore >= 70 && (
                <p className="text-lg text-green-600 font-semibold mb-8">Tuyệt vời! Bạn đã cải thiện đáng kể!</p>
              )}

              <button
                onClick={() => {
                  setScreen('home');
                  if (reviewScore >= 70) {
                    // Clear wrong answers if user did well on review
                    setWrongAnswers([]);
                  }
                  setReviewIndex(0);
                  setReviewAnswered(false);
                  setReviewSelectedAnswer(null);
                  setReviewCorrectCount(0);
                }}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all text-lg"
              >
                Về Trang Chủ
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => {
              setScreen('home');
              setReviewIndex(0);
              setReviewAnswered(false);
              setReviewSelectedAnswer(null);
              setReviewCorrectCount(0);
            }}
            className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:text-blue-700"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Trở về
          </button>

          {/* Header */}
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Ôn Tập Câu Sai</h2>
          <p className="text-blue-600 mb-6">Làm lại để cải thiện kỹ năng</p>

          {/* Progress */}
          <div className="mb-6">
            <p className="text-sm text-blue-600 font-semibold mb-2">Câu {reviewIndex + 1} / {wrongAnswers.length}</p>
            <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-6">
            <div className="text-sm text-orange-600 font-semibold mb-3">Câu trước bạn trả lời sai</div>
            <h3 className="text-2xl font-bold text-blue-900 mb-8 text-center leading-relaxed">
              {currentWrong.question.question}
            </h3>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentWrong.question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (!reviewAnswered) {
                      soundEnabled && soundManager.playClick();
                      setReviewSelectedAnswer(idx);
                      setReviewAnswered(true);
                      if (idx === currentWrong.question.correct) {
                        soundEnabled && soundManager.playCorrect();
                        setReviewCorrectCount(reviewCorrectCount + 1);
                      } else {
                        soundEnabled && soundManager.playWrong();
                      }
                    }
                  }}
                  disabled={reviewAnswered}
                  className={`w-full p-4 rounded-2xl font-semibold transition-all transform text-left ${
                    reviewAnswered
                      ? idx === currentWrong.question.correct
                        ? 'bg-green-100 border-2 border-green-500 text-green-700 scale-105'
                        : idx === currentWrong.userAnswer
                        ? 'bg-red-100 border-2 border-red-400 text-red-700'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-600'
                      : 'bg-white border-2 border-orange-300 text-blue-900 hover:border-orange-500 hover:bg-orange-50 cursor-pointer'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback */}
          {reviewAnswered && (
            <div className={`rounded-2xl p-4 text-center font-bold text-lg mb-6 ${
              isReviewCorrect
                ? 'bg-green-100 text-green-700 border-2 border-green-400'
                : 'bg-orange-100 text-orange-700 border-2 border-orange-400'
            }`}>
              {isReviewCorrect ? '✓ Đúng rồi!' : '✗ Hãy thử lại'}
            </div>
          )}

          {/* Next Button */}
          {reviewAnswered && (
            <button
              onClick={() => {
                soundEnabled && soundManager.playClick();
                if (reviewIndex < wrongAnswers.length - 1) {
                  setReviewIndex(reviewIndex + 1);
                  setReviewSelectedAnswer(null);
                  setReviewAnswered(false);
                } else {
                  // Show results
                  setReviewAnswered(true);
                }
              }}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              {reviewIndex === wrongAnswers.length - 1 ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
