// src/App.tsx

import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <h1>Welcome to My Simple Homepage</h1>
        <p>This is a simple homepage built with React and TypeScript!</p>
        <button onClick={() => alert('Button clicked!')}>Click Me</button>
      </header>
      <Footer />
    </div>
  );
};

export default App;
