import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css"; // Ensure you have your styles

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
    <div>
      <h1>Event Page</h1>
      {event ? (
        <div>
          <h2>{event.eventname}</h2>
          <p>Type: {event.event_type}</p>
          <p>Date: {event.eventdate}</p>
          <p>Location: {event.eventlocation}</p>
          <p>Description: {event.eventdescription}</p>
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
    </div>
  );
};

export default Event;

