// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import ReactDOM from 'react-dom';
import "./App.css";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/login";
import Home from "./pages/Home";
import Signup from "./pages/signup";
import CreateEvent from "./pages/createEvent";
import Dashboard from "./pages/orgDashboard";
import Event from "./pages/eventPage";
import Checkout from './components/Checkout';
import Success from './components/Success';
import Canceled from './components/Canceled';

import './css/normalize.css';
import './css/global.css';
const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="page-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/success.html" element={<Success />} />
              <Route path="/canceled.html" element={<Canceled />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/createEvent" element={<CreateEvent />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Event/:id" element={<Event />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
export default App;
