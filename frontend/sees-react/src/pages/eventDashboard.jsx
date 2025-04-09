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
  const eventTypes = ["workshop", "webinar", "conference", "seminar"];
  const getTimeInputValue = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return ""; // early return for invalid values
  
    const combined = `${dateStr}T${timeStr}`;
    const d = new Date(combined);
  
    if (isNaN(d.getTime())) return ""; // invalid date object
  
    return d.toISOString().split("T")[1].slice(0, 8);
  };
  
  const handleSave = async () => {
    console.log("Edited Event before validation:", editedEvent);
  
    const normalizeDate = (input) => {
      const date = new Date(input);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split("T")[0]; // "YYYY-MM-DD"
    };
  
    const normalizeDateTime = (input) => {
      const date = new Date(input);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split(".")[0]; // "YYYY-MM-DDTHH:MM:SS"
    };
  
    const requiredFields = {
      eventname: editedEvent.eventname,
      event_type: editedEvent.event_type,
      eventdate: editedEvent.eventdate,
      eventstarttime: editedEvent.eventstarttime,
      eventendtime: editedEvent.eventendtime,
      eventlocation: editedEvent.eventlocation,
      eventdescription: editedEvent.eventdescription,
      social_media_link: editedEvent.social_media_link
    };
  
    const emptyFields = Object.entries(requiredFields).filter(
      ([_, value]) => !value || String(value).trim() === ""
    );
  
    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.map(([key]) => key).join(", ");
      console.warn(`Blocked save — missing fields: ${fieldNames}`);
      alert(`Please fill in the required fields: ${fieldNames}`);
      return;
    }
  
    // Normalize date and time
    const normalizedDate = normalizeDate(editedEvent.eventdate);
    const normalizedStart = normalizeDateTime(`${editedEvent.eventdate} ${editedEvent.eventstarttime}`);
    const normalizedEnd = normalizeDateTime(`${editedEvent.eventdate} ${editedEvent.eventendtime}`);
  
    if (!normalizedDate || !normalizedStart || !normalizedEnd) {
      alert("Invalid date or time format.");
      return;
    }
  
    // ⛔ Check: eventdate cannot be before today
    const today = new Date().toISOString().split("T")[0];
    if (normalizedDate < today) {
      alert("Event date cannot be before today.");
      return;
    }
  
    // ⛔ Check: end time cannot be before start time
    const startTime = new Date(normalizedStart);
    const endTime = new Date(normalizedEnd);
  
    if (endTime <= startTime) {
      alert("End time must be after start time.");
      return;
    }
  
    try {
      const payload = {
        ...editedEvent,
        eventdate: normalizedDate,
        eventstarttime: normalizedStart,
        eventendtime: normalizedEnd,
      };
  
      const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update event.");
      }
  
      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setEditedEvent(updatedEvent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving event:", error);
      setError("Error saving event data.");
    }
  };
  
  
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete event.");
      }
  
      alert("Event deleted successfully!");
      window.location.href = "/"; // Redirect after deletion (you can change this)
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("An error occurred while deleting the event.");
    }
  };
  
  
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
            <h2>{isEditing ? (
                    <input 
                      value={editedEvent.eventname}
                      onChange={e => setEditedEvent({ ...editedEvent, eventname: e.target.value })}
                    />
                  ) : (
                    event.eventname
                  )}</h2>
            <p><strong>Type:</strong> 
                  {isEditing ? (
                    <select
  value={editedEvent.event_type}
  onChange={e => setEditedEvent({ ...editedEvent, event_type: e.target.value })}
>
  <option value="">-- Select Event Type --</option>
  {eventTypes.map((type) => (
    <option key={type} value={type}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </option>
  ))}
</select>

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
  step="1"
  value={
    isEditing
      ? getTimeInputValue(editedEvent.eventdate, editedEvent.eventstarttime)
      : ""
  }
  onChange={(e) =>
    setEditedEvent({
      ...editedEvent,
      eventstarttime: e.target.value,
    })
  }
/>

  ) : (
    new Date(event.eventstarttime).toISOString().split("T")[1].slice(0, 8)
  )
}</p>


<p><strong>End Time:</strong> {
  isEditing ? (
    <input
  type="time"
  step="1"
  value={
    isEditing
      ? getTimeInputValue(editedEvent.eventdate, editedEvent.eventendtime)
      : ""
  }
  onChange={(e) =>
    setEditedEvent({
      ...editedEvent,
      eventendtime: e.target.value,
    })
  }
/>

  ) : (
    new Date(event.eventendtime).toISOString().split("T")[1].slice(0, 8)
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
              <><button onClick={handleSave}>Save Changes</button>
                  <button onClick={handleDelete} style={{ marginLeft: "10px", backgroundColor: "#e74c3c", color: "white" }}>
                    Delete Event
                  </button>
              </>
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


