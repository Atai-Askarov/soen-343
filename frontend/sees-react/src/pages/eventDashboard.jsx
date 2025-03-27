import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css";

const EventDashboard = () => {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return (
    <div>
      <h1>Event Dashboard</h1>
      {loading ? <p>Loading...</p> : event ? (
        <div>
          <h2>{event.eventname}</h2>
          <p>Type: {event.event_type}</p>
          <p>Date: {event.eventdate}</p>
          <p>Location: {event.eventlocation}</p>
          <p>Description: {event.eventdescription}</p>
          <a href={event.social_media_link}>📸 Share the event! {event.social_media_link}</a>

          {/* Buttons with links */}
          <div style={{ marginTop: "20px" }}>
            <Link to={`/manage-ticketing/${eventId}`} className="btn">Manage Ticketing</Link>
            <Link to={`/analytics/${eventId}`} className="btn">Analytics</Link>
            <Link to={`/promotion/${eventId}`} className="btn">Promotion</Link>
          </div>
        </div>
      ) : (
        <p>Event not found.</p>
      )}
    </div>
  );
};

export default EventDashboard;
