const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User');  // User 모델 가져오기

mongoose.connect('mongodb://localhost:27017/my_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB Connection Error:', err));

const password = '1';  // 원하는 비밀번호

bcrypt.hash(password, 10, async (err, hashedPassword) => {
  if (err) throw err;
  // 해당 이메일의 사용자를 찾아서 비밀번호를 업데이트
  const user = await User.findOne({ email: 'test@example.com' });
  if (user) {
    user.password = hashedPassword;  // 비밀번호를 새로 암호화된 비밀번호로 변경
    await user.save();
    console.log('비밀번호 업데이트 완료');
  } else {
    console.log('사용자를 찾을 수 없습니다.');
  }
  mongoose.connection.close();  // 데이터베이스 연결 종료
});
