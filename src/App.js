import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
// import Retreat from './components/Retreat';
import Messaging from './components/Messaging';
// import Event from './components/Event';
import Signup from './components/Signup';
import Login from './components/Login';
import Welcome from './components/Welcome';
import About from './components/About';

import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decoded = jwt_decode(token);
      setAuthToken(token);
      setUser(decoded);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    setUser(null);
  };

  return (
    <Router>
      <Navbar isAuth={!!user} handleLogout={handleLogout} />
      <Switch>
        <Route path="/profile" render={() => <Profile user={user} />} />
        {/* <Route path="/retreats" component={Retreat} /> */}
        <Route path="/messages" render={() => <Messaging user={user} />} />
        {/* <Route path="/events" component={Event} /> */}
        <Route path="/signup" component={Signup} />
        <Route path="/login" render={() => <Login setUser={setUser} />} />
        <Route path="/about" component={About} />
        <Route exact path="/" component={Welcome} />
      </Switch>
    </Router>
  );
};

export default App;
