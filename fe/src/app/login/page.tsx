"use client";

import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await api.post('/api/Users/login', {
        username,
        password
      });

      const token = response.data.token;

      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });

      console.log('Login successful', token);

      window.location.href = '/photoupload';
    } catch (error) {
      setErrorMessage('Invalid username or password');
      console.error('Login failed', error);
    }
  };

  return (
    <div>
      <h1>Admin Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Login;
