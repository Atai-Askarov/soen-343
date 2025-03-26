import React, { useState } from "react";
import "./css/signUp.css";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const interestsOptions = ["Science", "Engineering", "Arts", "History"];

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpType, setSignUpType] = useState("");
  const [interests, setInterests] = useState([]); // New: Multi-select Interests
  const navigate = useNavigate();

  const handleInterestChange = (interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    // Debugging statements
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Account Type:", signUpType);
    console.log("Selected Interests:", interests);

    if (!email || !password || !signUpType) {
      alert("Please fill out all required fields.");
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
        "Password must be at least 8 characters long, contain at least one number, one lowercase and one uppercase letter."
      );
      return;
    }

    const userData = {
      email,
      password,
      type: signUpType.toLowerCase(),
      interests: interests.join(",")
    };

    // Debugging userData object
    console.log("User Data being sent to backend:", userData);

    try {
      const response = await axios.post("http://localhost:5000/api/signUp", userData);

      // Debugging the response from the server
      console.log("Response from backend:", response);

      if (response.status === 201) {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error.response) {
        // If we get a response error from the backend
        console.error("Error Response: ", error.response);
        alert(error.response.data.message || error.response.statusText);
      } else {
        alert("Error creating account. Please try again.", error.response);
      }
    }
  };

  return (
    <div className="SignUpContent">
      <div className="container">
        <form onSubmit={handleSignUp}>
          <h2 className="welcome">Welcome {signUpType ? ` ${signUpType}!` : "!"}</h2>

          <label className="text">Account Type:</label>
          <select value={signUpType} onChange={(e) => setSignUpType(e.target.value)} required>
            <option value="">Select Account Type</option>
            <option value="Attendee">Attendee</option>
            <option value="Stakeholder">Stakeholder</option>
            <option value="Admin">Admin</option>
          </select>

          <label className="text">Select Your Interests:</label>
          <div className="interest-options">
            {interestsOptions.map((interest) => (
              <label key={interest} className="interest-label">
                <input
                  type="checkbox"
                  value={interest}
                  checked={interests.includes(interest)}
                  onChange={() => handleInterestChange(interest)}
                />
                {interest}
              </label>
            ))}
          </div>

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
