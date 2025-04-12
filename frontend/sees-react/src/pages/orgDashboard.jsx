import React, { useEffect, useState, useRef } from "react";
import "./css/orgDashboard.css";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import EventCalendar from "../components/EventCalendar.jsx"; 
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import commandService from "../services/CommandService";
import { SendEmailCampaignCommand } from "../components/Command/SendEmailCampaignCommand";



const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const popupRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
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
    const { clientX, clientY } = e;
    setPopupPosition({ x: clientX, y: clientY });
    setSelectedEvent(event);
  };

  const handleOutsideClick = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      setSelectedEvent(null);
    }
  };

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
      <div className="calendar-and-events">
      <div className="events-section">
        <h2 className="section-header">My Events:</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <div className="events-table-wrapper">
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
                  <td><Link to={`/eventDashboard/${event.eventid}`}>Event Dashboard</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        ) : (
          <p>No events found.</p>
        )}
      </div>
     

      {/* Reusable calendar component */}
      <EventCalendar
        events={events}
        view={view}
        date={date}
        onViewChange={setView}
        onDateChange={(newDate) => setDate(new Date(newDate))}
        onEventClick={handleEventClick}
      />
      </div>
      {selectedEvent && (
        <div
          ref={popupRef}
          className="event-popup"
          style={{
            position: "absolute",
            top: popupPosition.y + window.scrollY,
            left: popupPosition.x + window.scrollX,
            backgroundColor: "white",
            padding: "10px",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            maxWidth: "300px",
            fontSize: 14,
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

  <div className="campaign-form">
    <div>
    <select
      id="eventSelect"
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
    </div>
    <div>
    <button
      type="button"
      onClick={handleAddCampaign}
      className="campaign-btn"
    >
      + New Campaign
    </button>
    </div>
  </div>

  <div className="campaigns-table-wrapper">
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

    </div>
  );
};

export default Dashboard;




