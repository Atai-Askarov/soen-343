import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css";

const EventDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const { eventId } = useParams(); // Get the eventId from URL
  const [event, setEvent] = useState(null); // State to hold the event data
  const [user, setUser] = useState(null); // State to hold the user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const handleSave = async () => {
  }
  const handleEditToggle = () => {
    if (!isEditing) {
      setEditedEvent(event); // Pre-fill on first click
    }
    setIsEditing(!isEditing);
  };
  
  // Fetch event data when the component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
        const eventData = await eventResponse.json();
        setEvent(eventData); // Set the event data
        setEditedEvent(eventData); // Preload editable version

      } catch (error) {
        setError("Error fetching event data.");
        console.error("Error:", error);
      } finally {
        setLoading(false); // Set loading to false once the data is fetched
      }
    };

    fetchEventDetails();
  }, [eventId]); // Refetch data when eventId changes
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/usersid/${event.speakerid}`);
        const data = await response.json();
        setUser(data);
        console.log("User data:", data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    if (event && event.speakerid) {
      fetchUser();
    }
  }, [event]);
  
  
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      {loading ? <p>Loading...</p> : event ? (
        <div className="event-details-dashboard">
          <div className="event-details-card">
            <div className="event-card-body">
              <div className="event-details-img">
                <img className="event-img-dashboard" src={event.event_img} alt={event.eventname} />
              </div>
              <div className="event-details-info">
            <h2>{event.eventname}</h2>
            <p><strong>Type:</strong> 
                  {isEditing ? (
                    <input 
                      value={editedEvent.event_type}
                      onChange={e => setEditedEvent({ ...editedEvent, event_type: e.target.value })}
                    />
                  ) : (
                    event.event_type
                  )}
                </p>
                <p><strong>Date:</strong> {
  isEditing ? (
    <input
      type="date"
      value={editedEvent.eventdate}
      onChange={e => setEditedEvent({
        ...editedEvent,
        eventdate: e.target.value
      })}
    />
  ) : (
    event.eventdate
  )
}</p>
<p><strong>Start Time:</strong> {
  isEditing ? (
    <input
      type="time"
      value={editedEvent.eventstarttime}
      onChange={e => setEditedEvent({
        ...editedEvent,
        eventstarttime: e.target.value
      })}
    />
  ) : (
    event.eventstarttime
  )
}</p>

<p><strong>End Time:</strong> {
  isEditing ? (
    <input
      type="time"
      value={editedEvent.eventendtime}
      onChange={e => setEditedEvent({
        ...editedEvent,
        eventendtime: e.target.value
      })}
    />
  ) : (
    event.eventendtime
  )
}</p>

                <p><strong>Location:</strong> {
                  isEditing ? (
                    <input 
                      value={editedEvent.eventlocation} 
                      onChange={e => setEditedEvent({
                        ...editedEvent, 
                        eventlocation: e.target.value
                      })}
                    />
                  ) : (
                    event.eventlocation
                  )}
                </p>
                <p><strong>Description:</strong> {
                isEditing? (
                  <textarea
                  value={editedEvent.eventdescription}
                  onChange={e=>setEditedEvent({
                    ...editedEvent,
                    eventdescription:e.target.value
                  })}
                  />
                ):(
                  event.eventdescription)}</p>
                <p><strong>Speaker:</strong> {
                  isEditing ? (
                    <input
                      value={user?.username || ""}
                      onChange={e => setUser({
                        ...user,
                        username: e.target.value
                      })}
                    />
                  ) : (
                    user?.username || "Loading..."
                  )}
                </p>
                <p><strong>Social Link:</strong> {
  isEditing ? (
    <input
      type="text"
      value={editedEvent.social_media_link}
      onChange={e => setEditedEvent({
        ...editedEvent,
        social_media_link: e.target.value
      })}
    />
  ) : (
    <a href={event.social_media_link} className="share-link" target="_blank" rel="noopener noreferrer">
      📸 {event.social_media_link}
    </a>
  )
}</p>
              </div>
            </div>
            <button onClick={handleEditToggle}>
  {isEditing ? "Cancel" : "Edit Event"}
</button>


            {isEditing && (
              <button onClick={handleSave}>Save Changes</button>
            )}
          </div>

          {/* Buttons with links */}
          <div className="side-menu">
            <Link to={`/manage-ticketing/${eventId}`} className="menu-item">Manage Ticketing</Link>
            <Link to={`/promotion/${eventId}`} className="menu-item">Promotion</Link>
            <Link to={`/budgeting/${eventId}`} className="menu-item">Budgeting</Link>
          </div>

          {/* Dashboard for Analytics */}
          <div className="dashboard">
            <div className="card-container">
              <div className="card">
                <h3>Ticket Sales</h3>
                <p>Placeholder for ticket sales data</p>
              </div>
              <div className="card">
                <h3>Attendee Numbers</h3>
                <p>Placeholder for attendee numbers</p>
              </div>
              <div className="card">
                <h3>Event Views</h3>
                <p>Placeholder for event view counts</p>
              </div>
              <div className="card">
                <h3>Profit</h3>
                <p>Placeholder for profit data</p>
              </div>
              <div className="card">
                <h3>Feedback</h3>
                <p>Placeholder for feedback summary</p>
              </div>
              <div className="card">
                <h3>Social Media Engagement</h3>
                <p>Placeholder for social media metrics</p>
              </div>
              <div className="card">
                <h3>Ticket Type Breakdown</h3>
                <p>Placeholder for ticket type stats</p>
              </div>
              <div className="card">
                <h3>Revenue by Source</h3>
                <p>Placeholder for revenue breakdown</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No event data available</p>
      )}
    </div>
  );
};

export default EventDashboard;


