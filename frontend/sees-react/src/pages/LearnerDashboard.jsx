import React, { useState, useEffect } from "react";
import "./css/dashboard.css";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LearnerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Sample events data - replace with your actual API call
  const sampleEvents = {
    coding: [
      {
        id: 1,
        title: "The Dangers of Chemicals",
        date: "2023-12-15",
        time: "10:00 AM",
        location: "Virtual",
        description: "Learn Python fundamentals in this 2-hour workshop",
      },
      {
        id: 2,
        title: "GinaCody Event Management Conference",
        date: "2023-12-20",
        time: "9:00 AM",
        location: "Tech Campus",
        description: "24-hour coding competition for web developers",
      }
    ],
    gaming: [
      {
        id: 3,
        title: "Game Design Meetup",
        date: "2023-12-18",
        time: "6:00 PM",
        location: "Game Dev Hub",
        description: "Network with fellow game developers",
      }
    ]
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulate API call - replace with your actual user data fetch
        setTimeout(() => {
          const interests = localStorage.getItem("userInterests") || "coding";
          setUserData({
            username: localStorage.getItem("username") || "Learner",
            email: localStorage.getItem("email") || "user@example.com",
            interests: interests
          });
          
          // Get events based on interests
          setEvents(sampleEvents[interests] || []);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your personalized dashboard...</p>
      </div>
    );
  }

  return (
    <div className="learner-dashboard">
      {/* Welcome Header */}
      <header className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome back, <span>{userData.username}</span>!</h1>
          <p>Here's what's happening with your learning journey</p>
        </div>
        
        <div className="interest-badge">
          <div className="badge-icon">🎯</div>
          <div className="badge-content">
            <p>Your Center of Interest</p>
            <h3>{userData.interests || "coding"}</h3>
          </div>
        </div>
      </header>

      {/* Upcoming Events Section */}
      <section className="events-section">
        <div className="section-header">
          <h2>Your Upcoming Events</h2>
          <Button variant="outline" onClick={() => navigate("/events")}>
            View All Events
          </Button>
        </div>s

        <div className="section-header">
          <h2>Upcoming Events based on your interest !</h2>
          
        </div>

        {events.length > 0 ? (
          <div className="events-grid">
            {events.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-image" style={{ backgroundImage: `url(${event.image})` }}></div>
                <div className="event-content">
                  <div className="event-date">
                    <span className="day">{new Date(event.date).getDate()}</span>
                    <span className="month">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="event-details">
                    <h3>{event.title}</h3>
                    <p className="event-meta">
                      <span>⏰ {event.time}</span>
                      <span>📍 {event.location}</span>
                    </p>
                    <p className="event-description">{event.description}</p>
                  </div>
                  <Button 
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="event-button"
                  >
                    Join Event
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <img src="https://via.placeholder.com/300x200?text=No+Events" alt="No events" />
            <h3>No upcoming events for {userData.interests}</h3>
            <p>Check back later or explore events in other categories</p>
            <Button onClick={() => navigate("/events")}>Browse Events</Button>
          </div>
        )}
      </section>

      
    </div>
  );
};

export default LearnerDashboard;