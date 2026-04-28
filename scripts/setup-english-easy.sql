-- Create tables for English Easy app

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_key TEXT UNIQUE NOT NULL,
  total_points INT DEFAULT 0,
  current_level INT DEFAULT 1,
  streak INT DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Levels table
CREATE TABLE IF NOT EXISTS levels (
  id INT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id INT NOT NULL REFERENCES levels(id),
  english TEXT NOT NULL,
  vietnamese TEXT NOT NULL,
  pronunciation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Phrases table
CREATE TABLE IF NOT EXISTS phrases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id INT NOT NULL REFERENCES levels(id),
  english TEXT NOT NULL,
  vietnamese TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id INT NOT NULL REFERENCES levels(id),
  question_text TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  level_id INT NOT NULL REFERENCES levels(id),
  completed BOOLEAN DEFAULT FALSE,
  vocabulary_completed BOOLEAN DEFAULT FALSE,
  phrases_completed BOOLEAN DEFAULT FALSE,
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_score INT DEFAULT 0,
  quiz_total INT DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed data
INSERT INTO levels (id, name, description) VALUES
  (1, 'Level 1', 'Bắt đầu'),
  (2, 'Level 2', 'Trung cấp'),
  (3, 'Level 3', 'Nâng cao')
ON CONFLICT (id) DO NOTHING;

-- Level 1 Vocabulary
INSERT INTO vocabulary (level_id, english, vietnamese, pronunciation) VALUES
  (1, 'Hello', 'Xin chào', 'hə-ˈlō'),
  (1, 'Goodbye', 'Tạm biệt', 'ˈgüd-ˌbī'),
  (1, 'Thank you', 'Cảm ơn', 'ˈθaŋk ˌyü'),
  (1, 'Yes', 'Vâng/Có', 'ˈyes'),
  (1, 'No', 'Không', 'ˈnō')
ON CONFLICT DO NOTHING;

-- Level 1 Phrases
INSERT INTO phrases (level_id, english, vietnamese) VALUES
  (1, 'Good morning', 'Chào buổi sáng'),
  (1, 'How are you?', 'Bạn khỏe không?'),
  (1, 'Nice to meet you', 'Rất vui được gặp bạn'),
  (1, 'What is your name?', 'Tên bạn là gì?'),
  (1, 'My name is...', 'Tên tôi là...')
ON CONFLICT DO NOTHING;

-- Level 1 Quiz
INSERT INTO quiz_questions (level_id, question_text, correct_answer, option_b, option_c, option_d) VALUES
  (1, 'How do you say "Xin chào" in English?', 'Hello', 'Goodbye', 'Thank you', 'Yes'),
  (1, '_____ are you? I am fine.', 'How', 'Who', 'What', 'Where'),
  (1, 'What does "Goodbye" mean?', 'Tạm biệt', 'Xin chào', 'Cảm ơn', 'Vâng'),
  (1, 'Select the correct sentence:', 'Nice to meet you', 'Nice meet to you', 'Meet nice you', 'To meet nice you'),
  (1, '"Thank you" in Vietnamese is:', 'Cảm ơn', 'Vâng', 'Tạm biệt', 'Xin chào')
ON CONFLICT DO NOTHING;

-- Level 2 Vocabulary
INSERT INTO vocabulary (level_id, english, vietnamese, pronunciation) VALUES
  (2, 'Water', 'Nước', 'ˈwȯ-tər'),
  (2, 'Food', 'Đồ ăn', 'ˈfüd'),
  (2, 'Drink', 'Uống', 'ˈdriŋk'),
  (2, 'Family', 'Gia đình', 'ˈfam-ə-lē'),
  (2, 'Friend', 'Bạn', 'ˈfrend')
ON CONFLICT DO NOTHING;

-- Level 2 Phrases
INSERT INTO phrases (level_id, english, vietnamese) VALUES
  (2, 'I like it', 'Tôi thích nó'),
  (2, 'Can I have water?', 'Tôi có thể có nước không?'),
  (2, 'This is my family', 'Đây là gia đình tôi'),
  (2, 'Where is the bathroom?', 'Nhà vệ sinh ở đâu?'),
  (2, 'How much does it cost?', 'Nó giá bao nhiêu?')
ON CONFLICT DO NOTHING;

-- Level 2 Quiz
INSERT INTO quiz_questions (level_id, question_text, correct_answer, option_b, option_c, option_d) VALUES
  (2, 'What does "Family" mean?', 'Gia đình', 'Bạn', 'Đồ ăn', 'Nước'),
  (2, '"I like it" in Vietnamese is:', 'Tôi thích nó', 'Tôi không thích', 'Bạn thích nó', 'Gia đình tôi'),
  (2, 'Choose the correct phrase:', 'Can I have water?', 'Can water have I?', 'I have can water?', 'Water can I have?'),
  (2, 'How do you ask for location?', 'Where is...?', 'What is...?', 'Who is...?', 'How is...?'),
  (2, '"Bạn" means:', 'Friend', 'Family', 'Food', 'Water')
ON CONFLICT DO NOTHING;

-- Level 3 Vocabulary
INSERT INTO vocabulary (level_id, english, vietnamese, pronunciation) VALUES
  (3, 'Beautiful', 'Đẹp', 'ˈbyü-tə-fəl'),
  (3, 'Interesting', 'Thú vị', 'ˈin-tə-rə-stiŋ'),
  (3, 'Difficult', 'Khó', 'ˈdi-fi-kəlt'),
  (3, 'Important', 'Quan trọng', 'im-ˈpȯr-tənt'),
  (3, 'Wonderful', 'Tuyệt vời', 'ˈwən-dər-fəl')
ON CONFLICT DO NOTHING;

-- Level 3 Phrases
INSERT INTO phrases (level_id, english, vietnamese) VALUES
  (3, 'That is beautiful', 'Điều đó rất đẹp'),
  (3, 'I think it is important', 'Tôi nghĩ nó quan trọng'),
  (3, 'This task is difficult', 'Nhiệm vụ này khó'),
  (3, 'What do you think?', 'Bạn nghĩ sao?'),
  (3, 'I have an idea', 'Tôi có một ý tưởng')
ON CONFLICT DO NOTHING;

-- Level 3 Quiz
INSERT INTO quiz_questions (level_id, question_text, correct_answer, option_b, option_c, option_d) VALUES
  (3, '"Beautiful" in Vietnamese is:', 'Đẹp', 'Thú vị', 'Khó', 'Quan trọng'),
  (3, 'Complete: "That is _____"', 'wonderful', 'wonderfull', 'wonderfu', 'wonder'),
  (3, 'What does "Khó" mean in English?', 'Difficult', 'Beautiful', 'Interesting', 'Important'),
  (3, 'Choose the correct sentence:', 'I think it is important', 'I thinking it important', 'I thinks it important', 'It think I important'),
  (3, '"Tôi có một ý tưởng" means:', 'I have an idea', 'I have ideas', 'I have no idea', 'I ideas have')
ON CONFLICT DO NOTHING;
