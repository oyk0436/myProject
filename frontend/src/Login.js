import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Auth.css'; // CSS 파일 추가

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('로그인 성공!');
      } else {
        setMessage('로그인 실패: ' + data.message);
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      setMessage('서버와 연결 실패');
    }
  };

  return (
    <div className="auth-container">
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="auth-button">로그인</button>
      </form>
      {message && <p className="auth-message">{message}</p>}

      <p>
        계정이 없으신가요? <Link to="/register" className="auth-link">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
