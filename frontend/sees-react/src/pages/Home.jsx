import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <p>Welcome to the homepage.</p>
      <button onClick={() => alert('Button clicked!')}>Click Me</button>
    </div>
  );
};

export default Home;