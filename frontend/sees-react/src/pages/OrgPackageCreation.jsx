// src/pages/OrgPackageCreation.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/orgPackageCreation.css";

const OrgPackageCreation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [packageName, setPackageName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      event_id: eventId,
      name: packageName,
      width: width,
      height: height,
      price: parseFloat(price),
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "Error creating package.");
      } else {
        setSuccess("Package created successfully!");
        // Clear form
        setPackageName("");
        setWidth("");
        setHeight("");
        setPrice("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="org-package-container">
      <div className="org-package-card">
        <h1>Create Sponsorship Package</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Package Name:</label>
            <input
              type="text"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Width (e.g., 400px):</label>
            <input
              type="text"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Height (e.g., 150px):</label>
            <input
              type="text"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Price ($):</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Creating..." : "Create Package"}
          </button>
        </form>
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default OrgPackageCreation;
