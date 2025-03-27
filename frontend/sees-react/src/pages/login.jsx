import React, { useState } from "react";
import "./css/login.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

 // LoginPage.js
const handleLogin = async (event) => {
  event.preventDefault();

  if (!email || !password) {
    setError("Please fill out all fields.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/login", {
      email,
      password
    });

    if (response.status === 200) {
      // Store user data in localStorage
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("userType", response.data.user.user_type);
      localStorage.setItem("userInterests", response.data.user.interests || 'coding');
      
      // Debug: Check what we're getting from the server
      console.log("Login response:", response.data);
      
      navigate("/");
      // Redirect based on user type
      
    }
  } catch (err) {
    console.error("Login error:", err.response);
    setError(err.response?.data?.message || "Login failed. Please try again.");
  }
};

  return (
    <div className="loginContent">
      <div className="container">
        <form onSubmit={handleLogin}>
          <h2 className="welcome">Welcome Back!</h2>

          {error && <p className="error-message">{error}</p>}

          <label htmlFor="email" className="text">
            Email:
          </label>
          <input
            id="email"
            className="userInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password" className="text">
            Password:
          </label>
          <input
            id="password"
            className="userInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div className="button-container">
            <Button type="submit">Login</Button>
            <Link to="/signup" className="no-account">
              Don't have an account? Sign up.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
