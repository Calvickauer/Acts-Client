import React, { useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

const { REACT_APP_SERVER_URL } = process.env;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState(false);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword && password.length >= 8) {
      const newUser = { name, email, password };
      axios.post(`${REACT_APP_SERVER_URL}/users/signup`, newUser)
        .then((response) => {
          console.log('New user created', response);
          setRedirect(true);
        })
        .catch((error) => {
          console.error('Error in Signup', error);
          alert('Error in signup. Please try again.');
        });
    } else {
      if (password !== confirmPassword) alert("Passwords don't match");
      if (password.length < 8) alert('Password needs to be at least 8 characters. Please try again.');
    }
  };

  if (redirect) return <Redirect to="/login" />;

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleName}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmail}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePassword}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              className="form-input"
            />
          </div>
          <button type="submit" className="btn-submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
