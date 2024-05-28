import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const Navbar = (props) => {
  return (
    <nav className="navbar">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <img src="/ActsLogo.png" alt="ACTS Logo" className="logo" />
        </Link>
        <div className="navbar-menu">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink className="nav-link" exact to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/retreats">Retreats</NavLink>
            </li>
            {props.isAuth ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">Profile</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/messages">Messages</NavLink>
                </li>
                <li className="nav-item">
                  <span onClick={props.handleLogout} className="nav-link logout-link">
                    Logout
                  </span>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/signup">Create Account</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">Login</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
