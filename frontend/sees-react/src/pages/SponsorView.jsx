// src/pages/SponsorView.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/sponsorView.css";

const SponsorView = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Server error");
        setEvents(data.events || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const goToSponsorshipPage = (eventId) => {
    navigate(`/sponsor/${eventId}`);
  };

  return (
    <div className="event-details-dashboard">
      <h1 style={{ textAlign: "center" }}>Available Events for Sponsorship</h1>

      {loading && <p>Loading…</p>}
      {error && <p>{error}</p>}
      {!loading && !error && events.length === 0 && <p>No events found.</p>}

      {events.map((ev) => (
        <div className="event-details-card" key={ev.eventid}>
          <div className="event-card-body">
            <div className="event-details-img">
              <img className="event-img-dashboard" src={ev.event_img} alt={ev.eventname} />
            </div>
            <div className="event-details-info">
              <h2>{ev.eventname}</h2>
              <p>
                <strong>Date:</strong> {ev.eventdate}
              </p>
              <p>
                <strong>Location:</strong> {ev.eventlocation}
              </p>
              <p>
                <strong>Description:</strong> {ev.eventdescription}
              </p>
            </div>
          </div>
          <div style={{ marginTop: 15 }}>
            <button className="menu-item" onClick={() => goToSponsorshipPage(ev.eventid)}>
              Sponsor This Event
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SponsorView;
