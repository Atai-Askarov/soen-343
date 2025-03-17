import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/login';
import Home from './pages/home';
import Signup from './pages/signup';

const App = () => {
  return (
    <div className="App">
      <Router>
        <div className="page-container">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </div>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
