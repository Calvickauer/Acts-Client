import React, { useState } from 'react';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/users/login', { email, password });
      const { token, userData } = response.data;
      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      setUser(userData);
    } catch (err) {
      console.error('Error logging in', err);
      alert('Login failed. Please check your credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Auth;
