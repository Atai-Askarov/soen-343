import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/login';
import Home from './pages/Home';
import Signup from './pages/signup';
import CreateEvent from './pages/createEvent';

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
              <Route path="/createEvent" element={<CreateEvent />} /> 
            </Routes>
          </div>
        </div>
      </Router>
      <Footer />
    </div>
  );
};

export default App;
