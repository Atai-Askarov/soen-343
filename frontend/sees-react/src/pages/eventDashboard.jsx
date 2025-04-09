import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css";
import AnalyticsModal from "../components/Analytics/AnalyticsModal";
import AnalyticsCard from "../components/Analytics/AnalyticsCard";
//? Service File to fetch the analytics 
import eventAnalyticsService from "../services/EventAnalyticsService";



const EventDashboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  //? Modal state for popping up the analytics cards
  const [activeModal, setActiveModal] = useState(null);
 //? Analytics data
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

  // Fetch event data when the component mounts
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await fetch(`http://127.0.0.1:5000/events/${eventId}`);
        const eventData = await eventResponse.json();
        setEvent(eventData);
      } catch (error) {
        setError("Error fetching event data.");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

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
            <h2>{event.eventname}</h2>
                <p><strong>Type:</strong> {event.event_type}<br></br>
                <strong>Date:</strong> {event.eventdate}<br></br>
                <strong>Location:</strong> {event.eventlocation}<br></br>
                <strong>Description:</strong> {event.eventdescription}</p>
                <a href={event.social_media_link} className="share-link">📸 {event.social_media_link}</a>
              </div>
            </div>
          </div>

          {/* Buttons with links */}
          <div className="side-menu">
          <Link to={`/eventDashboard/${eventId}`} className="menu-item">Analytics</Link>
            <Link to={`/manage-ticketing/${eventId}`} className="menu-item">Manage Ticketing</Link>
            <Link to={`/promotion/${eventId}`} className="menu-item">Promotion</Link>
            <Link to={`/budget/${eventId}`} className="menu-item">Budgeting</Link>
            <Link to={`/sponsorships/${eventId}`} className="menu-item">Sponsorships</Link>
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