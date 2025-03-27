import React, { useEffect, useState } from "react";
import "./css/home.css"; // Make sure you have the appropriate styles
import "./css/eventPage.css"; // Make sure you have the appropriate styles

const Home = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // For handling loading state

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the user data and set it in state
    }

    // Fetch events from the backend
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/events"); // Correct URL to Flask API
        const data = await response.json();
        if (data.events) {
          setEvents(data.events); // Store events in state
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false); // Stop the loading spinner
      }
    };

    fetchEvents(); // Call the function to fetch events
  }, []);

  // Handle ticket purchase (this function should be defined based on your needs)
  const handlePurchaseTicket = (eventId) => {
    console.log("Purchasing ticket for event with ID:", eventId);
    // You can implement ticket purchasing logic here
  };

  return (
    <div>
      <div className="scrollImage">
        <img
          className="image"
          src="./images/placeholder.png"
          alt="placeholder"
        />
      </div>
      <div className="content">
        <h1>Display all the events here</h1>

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
            <h2>Upcoming Events</h2>
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.eventid} className="event-container">
                  {/* Event Thumbnail */}
                  <div className="event-thumbnail">
                    <img
                      src={event.image || "/images/default.jpg"} // Use the event image if available, otherwise use the default image
                      alt={event.image ? event.eventname : "Default event thumbnail"}
                    />
                  </div>

                  {/* Event Name */}
                  <h1 className="event-name">{event.eventname}</h1>

                  {/* Short Description (Type) */}
                  <p className="event-type">{event.event_type}</p>

                  {/* Date and Time */}
                  <h2 className="event-section-header">Date and Time</h2>
                  <p className="event-date">{event.eventdate}</p>

                  {/* Location */}
                  <h2 className="event-section-header">Location</h2>
                  <p className="event-location">{event.eventlocation}</p>

                  {/* Event Description */}
                  <h2 className="event-section-header">Event Description</h2>
                  <p className="event-description">{event.eventdescription}</p>

                  <h1 className="event-name">Interested?</h1>

                  {/* Purchase Ticket Button */}
                  <button
                    type="button"
                    className="purchase-ticket-button"
                    onClick={() => handlePurchaseTicket(event.eventid)}
                  >
                    Purchase Ticket
                  </button>
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



