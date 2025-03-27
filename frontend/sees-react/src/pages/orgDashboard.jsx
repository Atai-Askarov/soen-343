import React, { useEffect, useState } from "react";
import "./css/orgDashboard.css";
import Button from "../components/Button.jsx";
import { Link} from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Event Newsletter", status: "Ongoing" },
    { id: 2, name: "New Subscribers", status: "Done" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      // Fetch events organized by the logged-in user
      const fetchEvents = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/events?organizerid=${user.id}`);
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

  // Handler to add a new campaign
  const handleAddCampaign = () => {
    const newCampaign = {
      id: campaigns.length + 1,
      name: `New Campaign ${campaigns.length + 1}`,
      status: "Pending",
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  return (
    <div className="dashboard-container">
      <h1 className="welcome-header">
        {user ? `Welcome back, ${user.username}!` : "Loading..."}
      </h1>

      {/* My Events Section */}
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
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.eventid}>
                <td>{event.eventname}</td>
                <td>{event.event_type}</td>
                <td>{event.eventdate}</td>
                <td>{event.eventid}</td>
                  <td> <Link to={`/eventDashboard/${event.eventid}`}>Event Dashboard</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No events found.</p>
        )}

        <Button type="button">Create Event</Button>
      </div>

      {/* My Email Campaigns Section (UNCHANGED) */}
      <div className="campaigns-section">
        <h2 className="section-header">My Email Campaigns</h2>
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

      <Button type="button" onClick={handleAddCampaign}>
        New Campaign
      </Button>
    </div>
  );
};

export default Dashboard;

