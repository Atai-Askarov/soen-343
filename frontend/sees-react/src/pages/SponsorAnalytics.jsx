// src/pages/SponsorAnalytics.jsx
import React, { useEffect, useState } from "react";
import "./css/eventDashboard.css";

const SponsorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assume the sponsor (user) info is stored in localStorage under "user"
  const user = JSON.parse(localStorage.getItem("user"));
  const sponsorId = user ? user.id : null;

  useEffect(() => {
    if (!sponsorId) {
      setError("Sponsor ID not found.");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/analytics/sponsor/${sponsorId}`);
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

  if (loading) {
    return <p>Loading analytics...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="event-details-dashboard">
      <h1 style={{ textAlign: "center" }}>Sponsor Analytics</h1>
      <div className="event-details-card">
        <h3>Your Analytics</h3>
        <p>
          <strong>Total Sponsorships:</strong> {analytics.total_sponsorships}
        </p>
        <p>
          <strong>Unique Events Sponsored:</strong> {analytics.total_events_sponsored}
        </p>
      </div>
    </div>
  );
};

export default SponsorAnalytics;
