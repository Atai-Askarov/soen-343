// src/pages/SponsorAnalytics.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/analytics.css";

const SponsorAnalytics = () => {
  const navigate = useNavigate();

  // Static, hard-coded analytics data
  const analyticsData = {
    totalSponsorships: 50,
    uniqueEvents: 10,
    totalRevenue: "$5000",
    feedbackScore: "4.5/5"
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <button className="back-button" onClick={() => navigate("/sponsor-dashboard")}>
          &larr; Back to Dashboard
        </button>
        <h1>Sponsor Analytics</h1>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <h2>Total Sponsorships</h2>
          <p>{analyticsData.totalSponsorships}</p>
        </div>
        <div className="metric-card">
          <h2>Unique Events</h2>
          <p>{analyticsData.uniqueEvents}</p>
        </div>
        <div className="metric-card">
          <h2>Total Revenue</h2>
          <p>{analyticsData.totalRevenue}</p>
        </div>
        <div className="metric-card">
          <h2>Feedback Score</h2>
          <p>{analyticsData.feedbackScore}</p>
        </div>
      </div>
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button 
          className="make-more-button" 
          onClick={() => navigate("/sponsor-view")}
        >
          Make More Sponsorships
        </button>
      </div>
      <div className="analytics-footer">
        <p>Analytics data is updated daily.</p>
      </div>
    </div>
  );
};

export default SponsorAnalytics;
