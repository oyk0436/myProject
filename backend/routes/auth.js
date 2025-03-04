const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // 유저 모델 불러오기

const router = express.Router();

// 회원가입 API
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 이메일 중복 체크
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '이미 가입된 이메일입니다.' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 유저 생성 후 저장
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: '회원가입 성공!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

module.exports = router;
