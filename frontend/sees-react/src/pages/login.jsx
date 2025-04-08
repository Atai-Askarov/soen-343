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

    if (!email || !password) {
      setError("Please fill out all fields.");
      console.log("Missing email or password");
      return;
    }

    try {
      console.log(
        "Sending login request with email:",
        email,
        "and password:",
        password,
      );

      const response = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      console.log("Response received:", response); // Check the entire response

      if (response.status === 200) {
        const { token, user } = response.data;

        console.log("Login successful, user data:", user); // Log the user data
        console.log("Storing token and user data in localStorage");

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // Save user details like ID

        console.log("Redirecting to home page...");
        navigate("/home");
      }
    } catch (err) {
      console.log("Error occurred during login:", err);
      setError(
        err.response?.data?.message || "Login failed. Please try again.",
      );
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
