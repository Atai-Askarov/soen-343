// src/pages/eventPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Button from "../components/Button";
import "./css/eventPage.css";

// Sample event data (for testing purposes) view samples by going to http://localhost:3000/Event/(number)
const sampleEvents = [
  {
    id: "1",
    name: "The Dangers of Chemicals",
    type: "Webinar",
    date: "Friday, March 21, 2025 2:00 PM - 4:00 PM EDT", // Possible to switch to Date object
    location: "Zoom - www.zoom.funnyahlink/12321",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    image: null, // No image
  },
  {
    id: "2",
    name: "GinaCody Event Management Conference",
    type: "Conference",
    date: "Saturday, April 10, 2025 9:00 AM - 5:00 PM EDT", // Possible to switch to Date object
    location: "In-Person - 123 Main St, City",
    description:
      "A conference about event planning best practices. Join us for a full day of learning and networking with industry experts. Topics include event marketing, logistics, and attendee engagement strategies.",
    image: null, // No image to test the placeholder
  },
];

//TODO - Fetch event from backend and use the commented lines below
// const Event = () => {
//   const { id } = useParams(); // Get the event ID from the URL
//   const [event, setEvent] = useState(null);
//   const [error, setError] = useState('');

//   // Fetch the event data when the component mounts
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5050/api/events/${id}`, { // Get the event data from the API, change port to backend one
//           withCredentials: true, // Include cookies for authentication
//         });
//         setEvent(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to load event. Please try again.');
//       }
//     };

//     fetchEvent();
//   }, [id]);

const Event = () => {
  //Placeholder function using sample events
  const { id } = useParams(); // Get the event ID from the URL

  // Find the event with the matching ID
  const event = sampleEvents.find((e) => e.id === id);

  // Handle ticket purchase (placeholder for now)
  const handlePurchaseTicket = () => {
    alert("Ticket purchase functionality coming soon!");
  };

  // If no event is found, display an error message
  if (!event) {
    return <div className="error-message">Event not found.</div>;
  }

  return (
    <div className="event-container">
      {/* Event Thumbnail */}
      <div className="event-thumbnail">
        <img
          src={event.image || "/images/default.jpg"} // Use the event image if available, otherwise use the default image
          alt={event.image ? event.name : "Default event thumbnail"}
        />
      </div>

      {/* Event Name */}
      <h1 className="event-name">{event.name}</h1>

      {/* Short Description (Type) */}
      <p className="event-type"> {event.type} </p>

      {/* Date and Time */}
      <h2 className="event-section-header">Date and Time</h2>
      <p className="event-date">{event.date}</p>

      {/* Location */}
      <h2 className="event-section-header">Location</h2>
      <p className="event-location">{event.location}</p>

      {/* Event Description */}
      <h2 className="event-section-header">Event Description</h2>
      <p className="event-description">{event.description}</p>

      <h1 className="event-name">Interested?</h1>

      {/* Purchase Ticket Button */}
      <Button
        type="button"
        className="purchase-ticket-button"
        onClick={handlePurchaseTicket}
      >
        Purchase Ticket
      </Button>
    </div>
  );
};

export default Event;
