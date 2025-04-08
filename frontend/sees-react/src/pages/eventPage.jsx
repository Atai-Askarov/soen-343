import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventPage.css";
import Chatbox from "../components/Chatbox.jsx";


const Event = () => {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [ticketDescriptions, setTicketDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
        const eventData = await eventResponse.json();
        setEvent(eventData); // Set the event details

        const ticketResponse = await fetch(`http://127.0.0.1:5000/ticket-descriptions/${eventId}`);
        const ticketData = await ticketResponse.json();
        if (ticketData.ticket_descriptions) {
          setTicketDescriptions(ticketData.ticket_descriptions); // Set the ticket descriptions
        }
      } catch (error) {
        setError("Error fetching event details or ticket descriptions.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (  
    <div className="event-container">
      <h1>Event Page</h1>
      {event ? (
        <div>
          <div className="event-thumbnail">
              <img
                src={event.image || "/images/default.jpg"} // Use the event image if available, otherwise use the default image
                alt={event.image ? event.name : "Default event thumbnail"}
              />
           </div>
          <h1 className="event-name">{event.eventname}</h1>
          <p className="event-type">{event.event_type}</p>
          <h2 className="event-section-header">Date and Time</h2>
          <p className="event-date">{event.eventdate}</p>
          <h2 className="event-section-header">Event Location</h2>
          <p className="event-location">{event.eventlocation}</p>
          <h2 className="event-section-header">Event Description</h2>
          <p className="event-description">{event.eventdescription}</p>
        </div>
      ) : (
        <p>Event not found.</p>
      )}

      {/* Ticket Options Section */}
      <div>
        <h1>Ticket Options</h1>
        {ticketDescriptions.length > 0 ? (
          <div className="ticket-list">
            {ticketDescriptions.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h4>{ticket.name}</h4>
                <p><strong>Price:</strong> ${ticket.price}</p>
                <p><strong>Ticket Limit:</strong> {ticket.ticketlimit}</p>
                <p><strong>Description:</strong> {ticket.description || "No description available"}</p>
                <Link to={`/purchase/${ticket.id}`} className="btn">Purchase Ticket</Link>
              </div>
            ))}
          </div>
        ) : (
          <p>No ticketing options available for this event.</p>
        )}
      </div>
      <div>
        <Chatbox eventId={eventId} />
      </div>
    </div>
  );
};

export default Event;

