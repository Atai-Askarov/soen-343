import React, { useEffect, useState } from "react";
import { Link,  } from "react-router-dom";
import Button from "../components/Button";
import "./css/home.css"; 

const Home = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/events");
        const data = await response.json();
        if (data.events) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle ticket purchase
  const handlePurchaseTicket = (eventId) => {
    console.log("Purchasing ticket for event with ID:", eventId);
  };

  return (
    <div>
      <div className="scrollImage">
        <img className="image" src="./images/placeholder.png" alt="placeholder" />
      </div>
      <div className="content">
        <h1>Upcoming Events</h1>
        {user ? (
          <div>
            <p>Welcome, {user.username}!</p>
            <p>Your user ID is: {user.id}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}

        {loading ? (
          <p>Loading events...</p>
        ) : (
          <div>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="event-container">
                  {/* Event Thumbnail */}
                  <div className="event-thumbnail">
                    <img
                      src={event.image || "/images/default.jpg"}
                      alt={event.image ? event.eventname : "Default event thumbnail"}
                    />
                  </div>

                  {/* Event Name */}
                  <h1 className="event-name">{event.eventname}</h1>

                  {/* Event Type */}
                  <p className="event-type">{event.event_type}</p>

                  {/* Date and Time */}
                  <h2 className="event-section-header">Date and Time</h2>
                  <p className="event-date">
                    {event.eventdate} from {event.eventstarttime} to {event.eventendtime}
                  </p>

                  {/* Location */}
                  <h2 className="event-section-header">Location</h2>
                  <p className="event-location">{event.eventlocation}</p>

                  {/* Speaker */}
                  <h2 className="event-section-header">Speaker</h2>
                  <p className="event-speaker">
                    {event.speakerid ? `Speaker ID: ${event.speakerid}` : "TBA"}
                  </p>

                  {/* Description */}
                  <h2 className="event-section-header">Event Description</h2>
                  <p className="event-description">{event.eventdescription}</p>

                  <h1 className="event-name">Interested?</h1>

                  {/* Purchase Ticket Button */}
                  <Button type="button" className="purchase-ticket-button" onClick={() => handlePurchaseTicket(event.id)}> Purchase Ticket</Button>
                  <Button type="button" className="view-more-button">
                    <Link to={`/eventpage/${event.eventid}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      View More!
                    </Link>
                  </Button>
                </div>
              ))
            ) : (
              <p>No events available at the moment.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;



