// src/pages/SponsorPackages.jsx
import React from "react";
import { useParams } from "react-router-dom";
import "./css/eventDashboard.css";

const SponsorPackages = () => {
  const { eventId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  // Later you can fetch this from the backend instead of hardcoding
  const packages = [
    {
      name: "Basic Banner",
      width: "300px",
      height: "100px",
      price: 50,
    },
    {
      name: "Premium Panel",
      width: "600px",
      height: "200px",
      price: 100,
    },
  ];

  const handleSponsor = async (selectedPackage) => {
    try {
      const res = await fetch("http://127.0.0.1:5000/sponsorship", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event_id: parseInt(eventId),
          sponsor_id: user?.id,
          package: selectedPackage.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(`✅ You sponsored with: ${selectedPackage.name}`);
    } catch (err) {
      alert("❌ Sponsorship failed: " + err.message);
    }
  };

  return (
    <div className="event-details-dashboard">
      <h1 style={{ textAlign: "center" }}>Choose a Sponsorship Package</h1>

      <div className="event-details-card">
        <h3>Available Packages</h3>
        {packages.map((pkg, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <p><strong>Name:</strong> {pkg.name}</p>
            <p><strong>Dimensions:</strong> {pkg.width} x {pkg.height}</p>
            <p><strong>Price:</strong> ${pkg.price}</p>
            <button
              className="menu-item"
              onClick={() => handleSponsor(pkg)}
            >
              Sponsor with {pkg.name} – ${pkg.price}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorPackages;
