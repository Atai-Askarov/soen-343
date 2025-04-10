// src/pages/SponsorDashboard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/eventDashboard.css";

const SponsorDashboard = () => {
  const navigate = useNavigate();

  // Define the menu items with label and target route.
  const menuItems = [
    { label: "Available Events", path: "/sponsor-view" },
    { label: "Analytics", path: "/sponsor/analytics" },
    { label: "My Sponsorships", path: "/sponsor/mysponsorships" } // if you later implement this
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "240px",
          backgroundColor: "#2c3e50",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        <h2 style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "20px" }}>
          Sponsor Dashboard
        </h2>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "15px" }}>
              <button
                onClick={() => navigate(item.path)}
                style={{
                  width: "100%",
                  padding: "10px 15px",
                  fontSize: "1rem",
                  color: "#fff",
                  backgroundColor: "#34495e",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease, transform 0.3s ease"
                }}
                onMouseOver={(e) => { e.target.style.backgroundColor = "#1abc9c"; }}
                onMouseOut={(e) => { e.target.style.backgroundColor = "#34495e"; }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                // Clear localStorage user info and navigate to login.
                localStorage.removeItem("user");
                navigate("/login");
              }}
              style={{
                width: "100%",
                padding: "10px 15px",
                fontSize: "1rem",
                color: "#fff",
                backgroundColor: "#e74c3c",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.3s ease"
              }}
              onMouseOver={(e) => { e.target.style.backgroundColor = "#c0392b"; }}
              onMouseOut={(e) => { e.target.style.backgroundColor = "#e74c3c"; }}
            >
              Sign Out
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#ecf0f1"
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>
          Welcome to Your Dashboard!
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#333" }}>
          Please select an option from the menu to continue.
        </p>
      </div>
    </div>
  );
};

export default SponsorDashboard;
