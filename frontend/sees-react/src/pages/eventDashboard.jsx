import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css";
import AnalyticsModal from "../components/Analytics/AnalyticsModal";
import AnalyticsCard from "../components/Analytics/AnalyticsCard";
//? Service File to fetch the analytics 
import eventAnalyticsService from "../services/EventAnalyticsService";
import { QRCodeSVG } from "qrcode.react";

function QrModalButton({ eventid }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Button to open the modal */}
      <button
        className="menu-item"
        onClick={() => setIsOpen(true)}
      >
        Show QR Code
      </button>

      {/* Modal for displaying the QR code */}
      {isOpen && (
        <div className="centered-qr-modal">
          <div>
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="close-button"
            >
              &times;
            </button>

            <h2 className="text-center">Scan the QR Code</h2>

            {/* QR Code wrapped in a clickable link */}
            <a
              target="_blank" // Opens the link in a new tab
              rel="noopener noreferrer" // Security best practice
            >
              <QRCodeSVG
                
                size={350}
                level="H"
                includeMargin={true}
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
}


 


const EventDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState({});
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  //? Modal state for popping up the analytics cards
  const [activeModal, setActiveModal] = useState(null);
 //? Analytics data
  const [user, setUser] = useState(null); // State to hold the user data
  const [analyticsData, setAnalyticsData] = useState({});


  //! HARD CODED ANALYTICS DATA FOR TESTING
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await eventAnalyticsService.getEventAnalytics(eventId);
        setEvent(data.event);
        setAnalyticsData(data);
      } catch (error) {
        setError("Error fetching event data: " + error.message);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);
  const eventTypes = ["workshop", "webinar", "conference", "seminar"];
  
  
  const getTimeInputValue = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
  
    // Try parsing the time string into 24-hour format
    const date = new Date(`${dateStr} ${timeStr}`);
    if (isNaN(date.getTime())) return "";
  
    // Return HH:MM:SS (24-hour) format
    return date.toTimeString().split(" ")[0]; // → "04:33:59"
  };
  
  
  
  const handleUpdateSubscribers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/eventEmailUpdate/${eventId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`❌ Error: ${errorData.error || "Failed to send email"}`);
        return;
      }
  
      const data = await response.json();
      alert(data.message || "✅ Email sent successfully!");
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Something went wrong while trying to send the emails.");
    }
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
      alert("✅ Event update Request Sent succesfully! Event will be updated and Subscribers will be notified via email once Admin approves the request.");

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
        setEvent(eventData);
        setEditedEvent(eventData); // Preload editable version

      } catch (error) {
        setError("Error fetching event data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);
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
      {event ? (
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
            <p><strong>Type: </strong> 
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
        getTimeInputValue(editedEvent.eventdate, editedEvent.eventstarttime)
      }
      onChange={(e) =>
        setEditedEvent({
          ...editedEvent,
          eventstarttime: e.target.value,
        })
      }
    />
  ) : (
    new Date(new Date(event.eventstarttime).getTime() - 4 * 60 * 60 * 1000)
      .toTimeString()
      .split(" ")[0]  )
}</p>

<p><strong>End Time:</strong> {
  isEditing ? (
    <input 
      type="time"
      step="1"
      value={
        getTimeInputValue(editedEvent.eventdate, editedEvent.eventendtime)
      }
      onChange={(e) =>
        setEditedEvent({
          ...editedEvent,
          eventendtime: e.target.value,
        })
      }
    />
  ) : (
    new Date(new Date(event.eventendtime).getTime() - 4 * 60 * 60 * 1000)
      .toTimeString()
      .split(" ")[0]  )
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
            <div className="PromotionButtons">
            <button onClick={handleUpdateSubscribers}>
              Re-send Event Details via Email
            </button>
            <button>
            <Link to={`/share-resources/${eventId}`}
            style={{ color: 'white', textDecoration: 'none' }}>
              Share Resources to Everyone via Email
              </Link>

            </button>
            </div>
          </div>


          {/* Buttons with links */}
          <div className="side-menu">
            <Link to={`/eventDashboard/${eventId}`} className="menu-item">Analytics</Link>
            <Link to={`/manage-ticketing/${eventId}`} className="menu-item">Manage Ticketing</Link>
            <Link to={`/promotion/${eventId}`} className="menu-item">Promotion</Link>
            <Link to={`/budget/${eventId}`} className="menu-item">Budgeting</Link>
            <Link to={`/sponsorships/${eventId}`} className="menu-item">Sponsorships</Link>
            <Link to={`/manage-qa/${eventId}`} className="menu-item">Q&A Management</Link>
            <QrModalButton  className="menu-item"eventid={ eventId}/>
            
          </div>

          {/* Dashboard for Analytics */}
          <div className="dashboard">
            <div className="card-container">
              <AnalyticsCard title="Ticket Sales" onClick={() => setActiveModal("ticketSales")}>
                <p>Placeholder for ticket sales data</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Attendee Numbers" onClick={() => setActiveModal("attendeeNumbers")}>
                <p>Placeholder for attendee numbers</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Event Views" onClick={() => setActiveModal("eventViews")}>
                <p>Placeholder for event view counts</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Profit" onClick={() => setActiveModal("profit")}>
                <p>Placeholder for profit data</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Feedback" onClick={() => setActiveModal("feedback")}>
                <p>Placeholder for feedback summary</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Social Media Engagement" onClick={() => setActiveModal("socialMedia")}>
                <p>Placeholder for social media metrics</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Ticket Type Breakdown" onClick={() => setActiveModal("ticketTypes")}>
                <p>Placeholder for ticket type stats</p>
              </AnalyticsCard>
              
              <AnalyticsCard title="Revenue by Source" onClick={() => setActiveModal("revenueSources")}>
                <p>Placeholder for revenue breakdown</p>
              </AnalyticsCard>
            </div>
          </div>

          {/* Render modal if active */}
          {activeModal && (
            <AnalyticsModal
              isOpen={!!activeModal}
              onClose={() => setActiveModal(null)}
              title={analyticsData[activeModal].title}
            >
              {analyticsData[activeModal].content}
            </AnalyticsModal>
          )}
        </div>
      ) : (
        <p>No event data available</p>
      )}
    </div>
  );
};

export default EventDashboard;