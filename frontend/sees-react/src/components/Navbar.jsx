import React from 'react';
import './css/Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo">Logo</div>
        <div className="search-bar">
          <input type="text" placeholder="Find Events" />
        </div>
      </div>
      <div className="navbar-right">
        <ul>
          <li className="nav-button"><Link to ="/">Pricing</Link></li>
          <li className="nav-button">Plan Event</li>
          <li className="nav-button"><Link to ="login">Login</Link></li>
          <li className="nav-button sign-up"><Link to ="signup">Sign Up</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;