import React from "react";
import "./css/home.css";

// Hardcoded list of users with similar interests
const similarUsers = [
  { email: "user1@example.com" },
  { email: "user2@example.com" },
  { email: "user3@example.com" },
];

const Home = () => {
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
        <h1>Home Page</h1>
        <p>Welcome to the homepage.</p>

        {/* People with Similar Interests Section (always visible, hardcoded), will need to change visibility with role implementation */}
        <div className="similar-interests-section">
          <h2>People with Similar Interests</h2>
          {similarUsers.length === 0 ? (
            <p>No users found with similar interests.</p>
          ) : (
            <ul className="matching-users-list">
              {similarUsers.slice(0, 3).map((user, index) => (
                <li key={index}>{user.email}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
