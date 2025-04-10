// src/pages/MySponsorships.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/mysponsorships.css";

const MySponsorships = () => {
  const [sponsorships, setSponsorships] = useState([]);
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
    const fetchSponsorships = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/mysponsorships/${sponsorId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server error");
        setSponsorships(data.sponsorships || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSponsorships();
  }, [sponsorId]);

  return (
    <div className="my-sponsor-container">
      <div className="dashboard-main">
        <div className="my-sponsorship-header">
          <button 
            className="back-button" 
            onClick={() => navigate("/sponsor-dashboard")}
          >
            &larr; Back to Dashboard
          </button>
          <h1>My Sponsorships</h1>
        </div>
        {loading ? (
          <p>Loading your sponsorships...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : sponsorships.length === 0 ? (
          <p>You have not sponsored any packages yet.</p>
        ) : (
          <div className="sponsorship-list">
            {sponsorships.map((s) => (
              <div key={s.sponsorship_id} className="sponsorship-card">
                <h2>Sponsorship ID: {s.sponsorship_id}</h2>
                <p><strong>Event ID:</strong> {s.event_id}</p>
                <h3>Package Details</h3>
                <p><strong>Name:</strong> {s.package.name}</p>
                <p>
                  <strong>Dimensions:</strong> {s.package.width} x {s.package.height}
                </p>
                <p><strong>Price:</strong> ${s.package.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySponsorships;
