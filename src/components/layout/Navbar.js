import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const isAuthenticated = localStorage.getItem('token') ? true : false;

  const authLinks = (
    <ul>
      <li>
        <Link to="/dashboard">Dashboard</Link>
      </li>
      <li>
        <Link to="/sessions">Sessions</Link>
      </li>
      <li>
        <Link to="/drafts">Drafts</Link>
      </li>
      <li>
        <a
          href="#!"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}
        >
          Logout
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link to="/sessions">Browse Sessions</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );

  return (
    <nav className="navbar">
      <h1>
        <Link to="/">
          <i className="fas fa-heartbeat"></i> Wellness Platform
        </Link>
      </h1>
      <div className="navbar-links">{isAuthenticated ? authLinks : guestLinks}</div>
    </nav>
  );
};

export default Navbar;