import React, { useEffect, useState } from "react";
import "./css/home.css";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user data and set it in state
    }
  }, []);

  return (
    <div>
      <div className="scrollImage">
        <img
          className="image"
          src="./images/placeholder.png"
          alt="placeholder"
        />
      </div>
      <div className="content">
        <h1>Display all the events here</h1>

        {user ? (
          <div>
            <p>Welcome, {user.name}!</p>
            <p>Your user ID is: {user.id}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

      </div>
    </div>
  );
};

export default Home;

