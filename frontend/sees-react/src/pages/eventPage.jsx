import React, { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import "./css/eventPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Event = () => {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [ticketDescriptions, setTicketDescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handlePurchase = async (ticket) => {
    try {
      const response = await axios.post("http://localhost:5000/create-checkout-session", {
        userid: JSON.parse(localStorage.getItem('user')).id,
        eventid: ticket.eventid,
        descid: ticket.id,
        name: ticket.name,
        description: ticket.description,
        price: parseFloat(ticket.price),
        priceId: ticket.priceId  // Make sure you have this priceId available
      });
  
      // Redirect to Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error.response?.data || error.message);
    }
  };
  

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
    <div className="event-container-page">
      {event ? (
        <div>
          <div className="event-thumbnail-page">
              <img
                src={event.event_img || "/images/default.jpg"} // Use the event image if available, otherwise use the default image
                alt={event.event_img ? event.name : "Default event thumbnail"}
              />
           </div>
          <h1 className="event-name-page">{event.eventname}</h1>
          <p className="event-type-page">{event.event_type}</p>
          <h2 className="event-section-header">Date and Time</h2>
          <p className="event-date-page">{event.eventdate}</p>
          <h2 className="event-section-header">Event Location</h2>
          <p className="event-location-page">{event.eventlocation}</p>
          <h2 className="event-section-header">Event Description</h2>
          <p className="event-description-page">{event.eventdescription}</p>
        </div>
      ) : (
        <p>Event not found.</p>
      )}

      {/* Ticket Options Section */}
      <div>
        <h1>Ticket Options</h1>
        {ticketDescriptions.length > 0 ? (
          <div className="ticket-list" style={{ display: "flex", flexDirection: "row", gap: "20px",contentAlign: "center" }}>
            {ticketDescriptions.map((ticket) => (
              <div key={ticket.id} className="ticket-card">
                <h4>{ticket.name}</h4>
                <p><strong>Price:</strong> ${ticket.price}</p>
                <p><strong>Description:</strong> {ticket.description || "No description available"}</p>
                <button onClick={() => {handlePurchase(ticket)}}>Purchase Ticket</button>
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

