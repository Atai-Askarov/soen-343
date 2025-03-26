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

  const handleLogin = async (event) => {
    event.preventDefault();

    // Basic form validation
    if (!email || !password) {
      setError("Please fill out all fields.");
      return;
    }

    try {
      // Send the POST request to the backend API
      const response = await axios.post(
        "http://localhost:5000/login", // Ensure the correct backend URL is used
        { email, password }
      );

      if (response.status === 200) {
        // Redirect to the home page after successful login
        navigate("/home");
      }
    } catch (err) {
      // Handle any errors (invalid login, etc.)
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
