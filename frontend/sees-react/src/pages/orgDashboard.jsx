import React, { useEffect, useState, useRef } from "react";
import "./css/orgDashboard.css";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const popupRef = useRef(null); // Reference to popup
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Store popup position

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchEvents = async () => {
        try {
          const response = await fetch(
            `http://127.0.0.1:5000/events/organizer/${user.id}`,
          );
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
    }
  }, [user]);

  // Handle adding a campaign
  const handleAddCampaign = async () => {
    if (!selectedEventId) {
      alert("Please select an event before adding a campaign.");
      return;
    }

    const selectedEvent = events.find(
      (event) => event.eventid === parseInt(selectedEventId),
    );

    const newCampaign = {
      id: campaigns.length + 1,
      name: `${selectedEvent.eventname}`,
      status: "Sending",
      eventId: selectedEvent.eventid,
    };

    setCampaigns([...campaigns, newCampaign]);
    setSelectedEventId(""); // Reset the selection

    try {
      // Sending the eventId to the backend using a GET request
      const response = await fetch(
        `http://localhost:5000/emailSending?eventId=${selectedEvent.eventid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Email sent successfully!", data);
        alert(`Email sent for event: ${selectedEvent.eventname}`);
        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((c) =>
            c.eventId === selectedEvent.eventid ? { ...c, status: "Sent" } : c,
          ),
        );
      } else {
        console.error("❗ Error sending email:", data);
        alert(`Failed to send email: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❗ Network error:", error);
      alert("Failed to connect to the server.");
    }
  };

  const eventList = events.map((event) => ({
    id: event.eventid,
    title: event.eventname,
    start: new Date(`${event.eventstarttime}`),
    end: new Date(`${event.eventendtime}`),
  }));

  // Handle clicking on an event to show the popup
  const handleEventClick = (event, e) => {
    // Get the position of the click event
    const { clientX, clientY } = e;

    // Adjust position if necessary (optional: use getBoundingClientRect() to account for page scrolling and other offsets)
    setPopupPosition({
      x: clientX,
      y: clientY,
    });
    setSelectedEvent(event);
  };

  // Close popup if clicked outside
  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setSelectedEvent(null);
    }
  };

  // Attach the event listener to the document to detect outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="welcome-header">
        {user ? `Welcome back, ${user.username}!` : "Loading..."}
      </h1>

      <div className="events-section">
        <h2 className="section-header">My Events:</h2>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <table className="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Date</th>
                <th>Dashboard</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.eventid}>
                  <td>{event.eventname}</td>
                  <td>{event.event_type}</td>
                  <td>{event.eventdate}</td>
                  <td>
                    {" "}
                    <Link to={`/eventDashboard/${event.eventid}`}>
                      Event Dashboard
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events found.</p>
        )}
      </div>

      <div className="calendar-section">
        <h2 className="section-header">Event Calendar</h2>
        <Calendar
          localizer={localizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, width: "100%" }}
          views={["month", "week", "day"]}
          defaultView={Views.MONTH}
          onSelectEvent={handleEventClick}
        />
      </div>

      {selectedEvent && (
        <div
          ref={popupRef}
          className="event-popup"
          style={{
            position: "absolute",
            top: popupPosition.y + window.scrollY, // Add window.scrollY to account for page scrolling
            left: popupPosition.x + window.scrollX, // Add window.scrollX to account for page scrolling
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "300px",
            fontSize: 14, // Optional: Limit the max width of the popup
          }}
        >
          <h3>Event Details</h3>
          <p>
            <strong>Name:</strong> {selectedEvent.title}
          </p>
          <p>
            <strong>Start Time:</strong> {selectedEvent.start.toLocaleString()}
          </p>
          <p>
            <strong>End Time:</strong> {selectedEvent.end.toLocaleString()}
          </p>
        </div>
      )}

      {/* Campaign Section */}
      <div className="campaigns-section">
        <h2 className="section-header">My Email Campaigns</h2>

        {/* Event Selector for Campaign */}
        <label>
          Select an Event for New Campaign:
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.eventid} value={event.eventid}>
                {event.eventname}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" onClick={handleAddCampaign}>
          New Campaign
        </Button>

        {/* Campaigns Table */}
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id}>
                <td>{campaign.name}</td>
                <td>{campaign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
