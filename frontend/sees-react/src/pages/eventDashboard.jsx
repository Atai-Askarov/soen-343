import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./css/eventDashboard.css";
import AnalyticsModal from "../components/Analytics/AnalyticsModal";
import AnalyticsCard from "../components/Analytics/AnalyticsCard";
// Nice charts :D!!
import TicketSalesChart from '../components/Analytics/TicketSalesChart';
import TicketTypeChart from '../components/Analytics/TicketTypeChart';
import EventViewsChart from '../components/Analytics/EventViewsChart';
import AttendeeNumbersChart from '../components/Analytics/AttendeeNumbersChart';
import ProfitChart from '../components/Analytics/ProfitChart';
import SocialMediaChart from '../components/Analytics/SocialMediaChart';
import FeedbackChart from '../components/Analytics/FeedbackChart';
import RevenueSourcesChart from '../components/Analytics/RevenueSourcesChart';


const EventDashboard = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [activeModal, setActiveModal] = useState(null);

  //! HARD CODED ANALYTICS DATA FOR TESTING
const analyticsData = {
  ticketSales: {
    title: "Ticket Sales",
    content: (
      <div>
        <h3>Ticket Sales Details</h3>
        <p>Total tickets sold: 250</p>
        <p>Revenue: $12,500</p>
        <TicketSalesChart data={[
          { name: 'Jan', value: 20 },
          { name: 'Feb', value: 35 },
          { name: 'Mar', value: 42 },
          { name: 'Apr', value: 58 },
          { name: 'May', value: 95 }
        ]} />
      </div>
    )
  },
  attendeeNumbers: {
    title: "Attendee Numbers",
    content: (
      <div>
        <h3>Attendee Details</h3>
        <p>Total registered: 300</p>
        <p>Check-ins: 250 (83%)</p>
        <AttendeeNumbersChart data={[
          { name: 'Week 1', registered: 50, attended: 42 },
          { name: 'Week 2', registered: 75, attended: 65 },
          { name: 'Week 3', registered: 90, attended: 70 },
          { name: 'Week 4', registered: 85, attended: 73 }
        ]} />
      </div>
    )
  },
  eventViews: {
    title: "Event Views",
    content: (
      <div>
        <h3>View Statistics</h3>
        <p>Total page views: 1,240</p>
        <p>Unique visitors: 875</p>
        <EventViewsChart data={[
          { date: '3/1', pageViews: 120, uniqueVisitors: 80 },
          { date: '3/8', pageViews: 250, uniqueVisitors: 170 },
          { date: '3/15', pageViews: 310, uniqueVisitors: 220 },
          { date: '3/22', pageViews: 340, uniqueVisitors: 240 },
          { date: '3/29', pageViews: 220, uniqueVisitors: 165 }
        ]} />
      </div>
    )
  },
  profit: {
    title: "Profit",
    content: (
      <div>
        <h3>Financial Summary</h3>
        <p>Total revenue: $15,000</p>
        <p>Total costs: $8,500</p>
        <p>Net profit: $6,500</p>
        <ProfitChart data={[
          { name: 'Jan', revenue: 3000, costs: 2000, profit: 1000 },
          { name: 'Feb', revenue: 4000, costs: 2200, profit: 1800 },
          { name: 'Mar', revenue: 3500, costs: 1800, profit: 1700 },
          { name: 'Apr', revenue: 4500, costs: 2500, profit: 2000 }
        ]} />
      </div>
    )
  },
  feedback: {
    title: "Feedback",
    content: (
      <div>
        <h3>Attendee Feedback</h3>
        <FeedbackChart 
          rating={4.2}
          themeData={[
            { name: 'Location', count: 42 },
            { name: 'Speakers', count: 38 },
            { name: 'Food', count: 35 },
            { name: 'Organization', count: 28 },
            { name: 'Content', count: 25 }
          ]}
        />
      </div>
    )
  },
  socialMedia: {
    title: "Social Media Engagement",
    content: (
      <div>
        <h3>Social Media Metrics</h3>
        <p>Mentions: 156</p>
        <p>Hashtag usage: 87 posts</p>
        <SocialMediaChart data={[
          { platform: 'Instagram', value: 85 },
          { platform: 'Twitter', value: 65 },
          { platform: 'Facebook', value: 45 },
          { platform: 'LinkedIn', value: 30 },
          { platform: 'TikTok', value: 20 }
        ]} />
      </div>
    )
  },
  ticketTypes: {
    title: "Ticket Type Breakdown",
    content: (
      <div>
        <h3>Ticket Types</h3>
        <TicketTypeChart data={[
          { name: 'VIP', value: 50 },
          { name: 'General', value: 175 },
          { name: 'Student', value: 25 }
        ]} />
        <p>VIP: 50 (20%)</p>
        <p>General: 175 (70%)</p>
        <p>Student: 25 (10%)</p>
      </div>
    )
  },
  revenueSources: {
    title: "Revenue by Source",
    content: (
      <div>
        <h3>Revenue Sources</h3>
        <RevenueSourcesChart data={[
          { name: 'Ticket Sales', value: 12500 },
          { name: 'Merchandise', value: 1800 },
          { name: 'Sponsorships', value: 750 }
        ]} />
        <p>Ticket sales: $12,500 (83%)</p>
        <p>Merchandise: $1,800 (12%)</p>
        <p>Sponsorships: $750 (5%)</p>
      </div>
    )
  }
};
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
                <p><strong>Type:</strong> {event.event_type}</p>
                <p><strong>Date:</strong> {event.eventdate}</p>
                <p><strong>Location:</strong> {event.eventlocation}</p>
                <p><strong>Description:</strong> {event.eventdescription}</p>
                <a href={event.social_media_link} className="share-link">📸 {event.social_media_link}</a>
              </div>
            </div>
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