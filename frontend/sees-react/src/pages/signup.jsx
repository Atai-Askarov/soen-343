import React, { useState } from "react";
import "./css/signUp.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("learner"); // Default value
  const [interests, setInterests] = useState("coding"); // Default value
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();

    if (!email || !password || !username) {
      alert("Please fill out all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      alert(
        "Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter.",
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/add_user", {
        username,
        email,
        password,
        user_type: userType,
        interests,
      });

      console.log("Server Response:", response);

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response && error.response.status === 409) {
        alert("Email already in use.");
      } else {
        alert("Error creating account. Please try again.");
      }
    }
  };

  return (
    <div className="SignUpContent">
      <div className="container">
        <form onSubmit={handleSignUp}>
          <h2 className="welcome">Welcome!</h2>

          <label className="text">Username:</label>
          <input
            className="userInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="text">Email:</label>
          <input
            className="userInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="text">Password:</label>
          <input
            className="userInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Dropdown for User Type */}
          <label className="text">User Type:</label>
          <select
            className="userInput"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="organizer">Organizer</option>
            <option value="learner">Learner</option>
            <option value="sponsor">Sponsor</option>
            <option value="speaker">Speaker</option>
          </select>

          {/* Dropdown for Interests */}
          <label className="text">Interests:</label>
          <select
            className="userInput"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          >
            <option value="coding">Coding</option>
            <option value="reading">Reading</option>
            <option value="gaming">Gaming</option>
            <option value="sports">Sports</option>
            <option value="music">Music</option>
          </select>

          <div className="button-container">
            <Button type="submit">Sign Up</Button>
            <Link to="/login" className="have-account">
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
