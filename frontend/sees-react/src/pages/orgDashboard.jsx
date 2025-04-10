import React, { useEffect, useState, useRef } from "react";
import "./css/orgDashboard.css";
import Button from "../components/Button.jsx";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import commandService from "../services/CommandService";
import { SendEmailCampaignCommand } from "../components/Command/SendEmailCampaignCommand";



const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId]= useState("");
  const [campaigns, setCampaigns] = useState([ ]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const popupRef = useRef(null);  // Reference to popup
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 }); // Store popup position
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());

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
          const response = await fetch(`http://127.0.0.1:5000/events/organizer/${user.id}`);
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

  // Add this effect to fetch existing email campaign commands
  useEffect(() => {
    const fetchPendingCampaigns = async () => {
      if (!user) return;
      
      try {
        // Fetch all commands from the command service
        const allCommands = await commandService.getCommands();
        
        // Filter for email campaign commands only
        const emailCampaigns = allCommands.filter(
          cmd => cmd.type === 'SendEmailCampaign' && 
                 cmd.status === 'pending' &&
                 events.some(event => event.eventid === cmd.eventId)
        );
        
        // Transform commands into campaign format
        const existingCampaigns = emailCampaigns.map((cmd, index) => ({
          id: `existing-${cmd.id}`,
          name: cmd.eventName || `Campaign for Event #${cmd.eventId}`,
          status: cmd.status === 'pending' ? 'Pending' : cmd.status,
          eventId: cmd.eventId,
          commandId: cmd.id
        }));
        
        setCampaigns(existingCampaigns);
      } catch (error) {
        console.error("Error fetching pending campaigns:", error);
      }
    };
    
    if (events.length > 0) {
      fetchPendingCampaigns();
    }
  }, [user, events]); // Re-run when user or events change

  // Handle adding a campaign
const handleAddCampaign = async () => {
  if (!selectedEventId) {
    alert("Please select an event before adding a campaign.");
    return;
  }

  const selectedEvent = events.find(event => event.eventid === parseInt(selectedEventId));
  
  try {
    // Create the command
    const command = new SendEmailCampaignCommand(
      selectedEvent.eventid,
      selectedEvent.eventname
    );
    
    // Add command to the service but don't execute it
    const commandId = await commandService.addCommand(command);
    
    // Add new campaign to state with the command ID
    const newCampaign = {
      id: `new-${commandId}`,
      name: selectedEvent.eventname,
      status: "Pending",
      eventId: selectedEvent.eventid,
      commandId: commandId
    };
    
    setCampaigns(prevCampaigns => [...prevCampaigns, newCampaign]);
    setSelectedEventId(""); // Reset the selection
    
    console.log("✅ Email campaign command added successfully with ID:", commandId);
    alert(`Email campaign for "${selectedEvent.eventname}" is pending approval.`);
    
  } catch (error) {
    console.error("❗ Command error:", error);
    alert("Failed to create email campaign command.");
  }
};
  const eventList = events.map(event => ({
    id: event.eventid,
    title: event.eventname,
    start: new Date(`${event.eventstarttime}`),
    end: new Date(`${event.eventendtime}`),
    description: event.eventdescription,
    
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
                  <td> <Link to={`/eventDashboard/${event.eventid}`}>Event Dashboard</Link></td>
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
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          defaultView={view}
          view={view} // Include the view prop
          date={date} // Include the date prop
          onView={(view) => setView(view)}
          onNavigate={(date) => {
              setDate(new Date(date));
          }}
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
      fontSize: 14// Optional: Limit the max width of the popup
    }}
  >
    <h3>Event Details</h3>
    <p><strong>Name:</strong> {selectedEvent.title}</p>
    <p><strong>Description:</strong> {selectedEvent.description}</p>
  </div>
)}


      {/* Campaign Section */}
      <div className="campaigns-section">
        <h2 className="section-header">My Email Campaigns</h2>
        
        {/* Event Selector for Campaign */}
        <label>
          Select an Event for New Campaign:
          <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)}>
            <option value="">-- Select Event --</option>
            {events.map((event) => (
              <option key={event.eventid} value={event.eventid}>
                {event.eventname}
              </option>
            ))}
          </select>
        </label>
        <Button type="button" onClick={handleAddCampaign}>New Campaign</Button>

        {/* Campaigns Table */}
        <table className="campaigns-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>
                    <span className={`status-badge ${campaign.status.toLowerCase()}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td>{campaign.created || "Just now"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-campaigns">No campaigns created yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default Dashboard;



