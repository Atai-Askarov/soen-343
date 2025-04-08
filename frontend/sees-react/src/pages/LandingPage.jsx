import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/home.css";

const LandingPage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/home"); // Redirect to home if logged in
    }
  }, [navigate]);

  return (
    <div className="content">
      <h1>Welcome to Our Platform</h1>
      <p>Join us and start networking today!</p>
    </div>
  );
};

export default LandingPage;
