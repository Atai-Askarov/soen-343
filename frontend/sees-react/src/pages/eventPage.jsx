// src/pages/eventPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import "./css/eventPage.css";

// Sample event data (for testing purposes)
const sampleEvents = [
  {
    id: "1",
    name: "The Dangers of Chemicals",
    type: "Webinar",
    date: "Friday, March 21, 2025 2:00 PM - 4:00 PM EDT",
    location: "Zoom - www.zoom.funnyahlink/12321",
    description: "An insightful webinar about the dangers of chemicals in everyday life.",
    image: null,
  },
  {
    id: "2",
    name: "GinaCody Event Management Conference",
    type: "Conference",
    date: "Saturday, April 10, 2025 9:00 AM - 5:00 PM EDT",
    location: "In-Person - 123 Main St, City",
    description: "A conference about event planning best practices.",
    image: null,
  },
];

const Event = () => {
  const { id } = useParams();
  const event = sampleEvents.find((e) => e.id === id);

  const handlePurchaseTicket = () => {
    alert("Ticket purchase functionality coming soon!");
  };

  const handleUpdateEvent = () => {
    alert("Update event functionality coming soon!");
  };

  const handleShareEvent = () => {
    const shareUrl = window.location.href;
    navigator.clipboard.writeText(`Check out this event: ${shareUrl}`);
    alert("Event link copied to clipboard! Share it on your socials.");
  };

  if (!event) {
    return <div className="error-message">Event not found.</div>;
  }

  return (
    <div className="event-container">
      <div className="event-thumbnail">
        <img
          src={event.image || "/images/default.jpg"}
          alt={event.image ? event.name : "Default event thumbnail"}
        />
      </div>

      <h1 className="event-name">{event.name}</h1>
      <p className="event-type"> {event.type} </p>

      <h2 className="event-section-header">Date and Time</h2>
      <p className="event-date">{event.date}</p>

      <h2 className="event-section-header">Location</h2>
      <p className="event-location">{event.location}</p>

      <h2 className="event-section-header">Event Description</h2>
      <p className="event-description">{event.description}</p>

      <h1 className="event-name">Interested?</h1>
      <Button type="button" className="purchase-ticket-button" onClick={handlePurchaseTicket}>
        Purchase Ticket
      </Button>
      
      <h1 className="event-section-header">Actions</h1>
      <Button type="button" className="update-event-button" onClick={handleUpdateEvent}>
        Update Event
      </Button>
      <Button type="button" className="share-event-button" onClick={handleShareEvent}>
        Share on Social Media
      </Button>
    </div>
  );
};

export default Event;