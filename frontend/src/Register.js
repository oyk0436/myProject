import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css'; // CSS 파일 추가

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('회원가입 성공! 로그인 페이지로 이동합니다.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('회원가입 실패: ' + data.message);
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      setMessage('서버와 연결 실패');
    }
  };

  return (
    <div className="auth-container">
      <h1>회원가입</h1>
      <form onSubmit={handleRegister}>
        <div className="input-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">비밀번호 확인:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">회원가입</button>
      </form>
      {message && <p className="auth-message">{message}</p>}

      <p>
        이미 계정이 있으신가요? <Link to="/login" className="auth-link">로그인</Link>
      </p>
    </div>
  );
};

export default Register;
