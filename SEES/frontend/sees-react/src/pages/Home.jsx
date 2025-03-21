import React from 'react';
import './css/home.css';

const Home = () => {
  return (
    <div>
      <div className="scrollImage">
        <img className="image" src="./images/placeholder.png" alt='placeholder'/>
      </div>

      <div className="content">
        <h1>Home Page</h1>
        <p>Welcome to the homepage.</p>
        <button onClick={() => alert('Button clicked!')}>Click Me</button>
      </div>
    </div>
  );
};

export default Home;