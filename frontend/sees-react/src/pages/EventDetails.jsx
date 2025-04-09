import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/eventDetails.css';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      
      try {
        const response = await fetch(`http://localhost:5000/events/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch event details');
        }
        
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
        setMessage({ type: 'error', text: `Error: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventDetails();
  }, [id]);
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time for display
  const formatTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (loading) {
    return (
      <div className="event-detail-container">
        <div className="loading">Loading event details...</div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="message error">Event not found</div>
        <button onClick={() => navigate('/manage-events')} className="back-button">
          Back to Events
        </button>
      </div>
    );
  }
  
  return (
    <div className="event-detail-container">
      <div className="event-header">
        <button onClick={() => navigate('/manage-events')} className="back-button">
          &larr; Back to Events
        </button>
        <h1>Event Details</h1>
      </div>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="event-card">
        <div className="event-title-section">
          <h2>{event.eventname}</h2>
          <span className={`status-pill ${new Date(event.eventdate) > new Date() ? 'upcoming' : 'past'}`}>
            {new Date(event.eventdate) > new Date() ? 'Upcoming' : 'Past'}
          </span>
        </div>
        
        <div className="event-details-grid">
          <div className="detail-item">
            <span className="detail-label">Date</span>
            <span className="detail-value">{formatDate(event.eventdate)}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Time</span>
            <span className="detail-value">
              {event.eventstarttime && event.eventendtime ? 
                `${formatTime(event.eventstarttime)} - ${formatTime(event.eventendtime)}` : 
                'Not specified'}
            </span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Location</span>
            <span className="detail-value">{event.eventlocation}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Type</span>
            <span className="detail-value">{event.event_type}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Speaker ID</span>
            <span className="detail-value">{event.speakerid || 'None'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Organizer ID</span>
            <span className="detail-value">{event.organizerid}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Venue ID</span>
            <span className="detail-value">{event.venue_id || 'None'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Social Media</span>
            <span className="detail-value">{event.social_media_link || 'None'}</span>
          </div>
        </div>
        
        <div className="event-description">
          <h3>Description</h3>
          <p>{event.eventdescription || 'No description provided.'}</p>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;