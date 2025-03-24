// src/pages/Dashboard.jsx
import React, { useState } from "react";
import "./css/orgDashboard.css";
import Button from "../components/Button";

const Dashboard = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "Eruption of Mount Vesuvius in 79 AD",
      type: "Webinar",
      date: "March 28",
      status: "On Sale",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "The Dangers of Chemicals",
      type: "Seminar",
      date: "March 31",
      status: "On Sale",
      image: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Trump and his Tariffs",
      type: "Conference",
      date: "March 22",
      status: "Finished",
      image: "https://via.placeholder.com/50",
    },
  ]);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: "Event Newsletter", status: "Ongoing" },
    { id: 2, name: "New Subscribers", status: "Done" },
  ]);

  // Handler to add a new event, placeholder for now
  const handleAddEvent = () => {
    const newEvent = {
      id: events.length + 1,
      name: `New Event ${events.length + 1}`,
      type: "Workshop",
      date: "April 5",
      status: "On Sale",
      image: "https://via.placeholder.com/50",
    };
    setEvents([...events, newEvent]);
  };

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
      {/* Header */}
      <h1 className="welcome-header">Welcome back, User!</h1>{" "}
      {/* Placeholder for now */}
      {/* My Events Section */}
      <div className="events-section">
        <h2 className="section-header">My Events:</h2>
        <table className="events-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td>
                  <img
                    src={event.image}
                    alt={event.name}
                    className="event-image"
                  />
                  {event.name}
                </td>
                <td>{event.type}</td>
                <td>{event.date}</td>
                <td>{event.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Button type="button" onClick={handleAddEvent}>
          {" "}
          Create Event{" "}
        </Button>
      </div>
      {/* My Email Campaigns Section */}
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
        {" "}
        New Campaign
      </Button>
    </div>
  );
};

export default Dashboard;
