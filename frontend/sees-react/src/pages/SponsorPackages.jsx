// src/pages/SponsorPackages.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/eventDashboard.css";
import axios from 'axios';

const SponsorPackages = () => {
  const { eventId } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch packages for this event from the backend
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/packages/${eventId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server error");
        setPackages(data.packages || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [eventId]);

  
const handleSponsor = async (selectedPackage) => {
  try {
    const value = {
      event_id: parseInt(eventId),
      sponsor_id: user?.id,
      package_id: selectedPackage.id,
      name: selectedPackage.name,
      width: selectedPackage.width,
      height: selectedPackage.height,
      price: selectedPackage.price,
      product_type: "sponsorship",
    };

    // Sending the request with axios
    const res = await axios.post("http://127.0.0.1:5000/create-checkout-session", value, {
      headers: { "Content-Type": "application/json" },
    });

    // If the response contains a URL, redirect to it
    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      alert("❌ Error: " + res.data.error);
    }
  } catch (err) {
    alert("❌ Sponsorship failed: " + err.message);
  }
};


  return (
    <div className="event-details-dashboard">
      <h1 style={{ textAlign: "center" }}>Choose a Sponsorship Package</h1>

      {loading && <p>Loading packages…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && packages.length === 0 && <p>No packages found for this event.</p>}

      <div className="event-details-card">
        <h3>Available Packages</h3>
        {packages.map((pkg, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p>
              <strong>Name:</strong> {pkg.name}
            </p>
            <p>
              <strong>Dimensions:</strong> {pkg.width} x {pkg.height}
            </p>
            <p>
              <strong>Price:</strong> ${pkg.price}
            </p>
            <button className="menu-item" onClick={() => handleSponsor(pkg)}>
              Sponsor with {pkg.name} – ${pkg.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorPackages;
