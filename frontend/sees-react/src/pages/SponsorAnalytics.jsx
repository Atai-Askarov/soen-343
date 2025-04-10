// src/pages/SponsorAnalytics.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/eventDashboard.css";

const SponsorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const sponsorId = user ? user.id : null;

  useEffect(() => {
    if (!sponsorId) {
      setError("Sponsor ID not found. Please log in.");
      setLoading(false);
      return;
    }
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/analytics/sponsor/${sponsorId}`);
        // Ensure that the response content type is JSON.
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Server error");
        }
        setAnalytics(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [sponsorId]);

  return (
    <div className="event-details-dashboard">
      <div style={{ padding: "30px", background: "#ecf0f1" }}>
        <button 
          className="menu-item" 
          onClick={() => navigate("/sponsor-dashboard")}
          style={{ marginBottom: "20px", maxWidth: "200px" }}
        >
          &larr; Back to Dashboard
        </button>
        <h1 style={{ marginBottom: "20px", color: "#2c3e50" }}>Sponsor Analytics</h1>
        {loading && <p>Loading analytics...</p>}
        {error && <p>Error: {error}</p>}
        {analytics && (
          <div className="event-details-card">
            <p><strong>Total Sponsorships:</strong> {analytics.total_sponsorships}</p>
            <p><strong>Unique Events Sponsored:</strong> {analytics.total_events_sponsored}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SponsorAnalytics;
