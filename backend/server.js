// backend/server.js
const express     = require('express');       // Node.js에서 HTTP 서버를 쉽게 만들 수 있도록 도와주는 프레임워크
const mongoose    = require('mongoose');      // MongoDB와 Node.js를 연결해주는 ODM(Object Data Modeling) 라이브러리 
const cors        = require('cors');          // Cross-Origin Resource Sharing의 약자로, 다른 도메인 간에 자원을 공유할 수 있게 해주는 메커니즘
const dotenv      = require('dotenv');        // 환경 변수를 관리하기 위한 라이브러리
const User        = require('./models/User'); // User 모델 추가
const bcrypt      = require('bcryptjs');      // 비밀번호 암호화를 위한 라이브러리
const authRoutes  = require('./routes/auth'); // 회원가입 라우트 추가


dotenv.config(); // .env 파일에서 환경 변수 로드

const app   = express(); // Express 앱 생성
const PORT  = process.env.PORT || 5000; // 포트 설정

// Middleware
app.use(express.json()); // JSON 파싱
app.use(cors()); // CORS 허용

// API 라우트 추가
app.use('/api', authRoutes); // 회원가입 엔드포인트 추가

// MongoDB 연결
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // MongoDB Node.js 드라이버의 새로운 URL 파서 및 엔진
    useUnifiedTopology: true, // 새로운 서버 발견 및 모니터링 엔진 사용
  })
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ MongoDB Connection Error:', err));

// 로그인 API
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('입력된 비밀번호:', password); // 입력된 비밀번호 확인
    console.log('저장된 비밀번호:', user.password); // 데이터베이스에 저장된 암호화된 비밀번호 확인
    console.log('비밀번호 일치 여부:', isMatch); // 비교 결과 확인
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    return res.json({ success: true, message: '로그인 성공!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: '서버 오류' });
  }
});

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
      return res.json({ success: false, message: "모든 필드를 입력해주세요." });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
      return res.json({ success: false, message: "이미 존재하는 이메일입니다." });
  }

  const newUser = new User({ email, password });
  await newUser.save();

  res.json({ success: true, message: "회원가입 성공!" });
});

// 서버 실행
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
