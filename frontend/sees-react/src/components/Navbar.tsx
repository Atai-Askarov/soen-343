// src/components/Navbar.tsx

import React from 'react';
import './css/Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="Navbar">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/services">Services</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
