import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Login from './components/Login';
import Signup from './components/Signup';
import Welcome from './components/Welcome';
import About from './components/About';
import Messages from './components/Messages';
import Retreats from './components/Retreats';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      setAuthToken(token);
      const decoded = jwt_decode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    }
  }, []);

  const nowCurrentUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar handleLogout={handleLogout} isAuth={isAuthenticated} />
      <div className="container mt-5">
        <Switch>
          <Route path="/signup" component={Signup} />
          <Route 
            path="/login"
            render={(props) => (
              <Login {...props} nowCurrentUser={nowCurrentUser} setIsAuthenticated={setIsAuthenticated} user={user} />
            )}
          />
          <Route 
            path="/profile"
            render={(props) => (
              isAuthenticated ? <Profile {...props} user={user} /> : <Redirect to="/login" />
            )}
          />
          <Route exact path="/" component={Welcome} />
          <Route path="/about" component={About} />
          <Route 
            path="/messages"
            render={(props) => (
              isAuthenticated ? <Messages {...props} user={user} /> : <Redirect to="/login" />
            )}
          />
          <Route 
            path="/retreats"
            render={(props) => (
              isAuthenticated ? <Retreats {...props} user={user} setUser={setUser} /> : <Redirect to="/login" />
            )}
          />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
