import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaUserTie, FaUserCog, FaBuilding, FaLink } from 'react-icons/fa';
import CheckInPanel from '../components/AttendanceButton';
import './css/eventDetails.css';
import QRCode from '../components/QRCode';

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
      <div className="neuro-container">
        <div className="neuro-loading">
          <div className="neuro-loading-spinner"></div>
          <span>Loading event details...</span>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="neuro-container">
        <div className="neuro-message error">
          <h3>Event not found</h3>
          <p>The event you're looking for doesn't exist or has been removed.</p>
        </div>
        <button onClick={() => navigate('/manage-events')} className="neuro-button back">
          Back to Events
        </button>
      </div>
    );
  }
  
  return (
    <div className="neuro-container">
      <div className="neuro-header">
        <button onClick={() => navigate('/manage-events')} className="neuro-button back">
          &larr; Back
        </button>
        <h1>Event Details</h1>
      </div>
      
      {message && (
        <div className={`neuro-message ${message.type}`}>
          <p>{message.text}</p>
        </div>
      )}
      
      <div className="neuro-card main-card">
        <div className="event-title-wrapper">
          <h2>{event.eventname}</h2>
          <div className={`neuro-status ${new Date(event.eventdate) > new Date() ? 'upcoming' : 'past'}`}>
            {new Date(event.eventdate) > new Date() ? 'Upcoming' : 'Past'}
          </div>
        </div>
        
        <div className="neuro-divider"></div>
        
        <div className="event-primary-details">
          <div className="neuro-detail-item">
            <div className="neuro-icon">
              <FaCalendarAlt />
            </div>
            <div className="neuro-detail-content">
              <span className="neuro-label">Date</span>
              <span className="neuro-value">{formatDate(event.eventdate)}</span>
            </div>
          </div>
          
          <div className="neuro-detail-item">
            <div className="neuro-icon">
              <FaClock />
            </div>
            <div className="neuro-detail-content">
              <span className="neuro-label">Time</span>
              <span className="neuro-value">
                {event.eventstarttime && event.eventendtime ? 
                  `${formatTime(event.eventstarttime)} - ${formatTime(event.eventendtime)}` : 
                  'Not specified'}
              </span>
            </div>
          </div>
          
          <div className="neuro-detail-item">
            <div className="neuro-icon">
              <FaMapMarkerAlt />
            </div>
            <div className="neuro-detail-content">
              <span className="neuro-label">Location</span>
              <span className="neuro-value">{event.eventlocation}</span>
            </div>
          </div>
          
          <div className="neuro-detail-item">
            <div className="neuro-icon">
              <FaTag />
            </div>
            <div className="neuro-detail-content">
              <span className="neuro-label">Event Type</span>
              <span className="neuro-value">{event.event_type}</span>
            </div>
          </div>
        </div>
        
        <div className="neuro-divider"></div>
        
        <div className="event-description">
          <h3>Description</h3>
          <div className="neuro-inset">
            <p>{event.eventdescription || 'No description provided.'}</p>
          </div>
        </div>
        
        <div className="neuro-divider"></div>
        
        <div className="event-secondary-details">
          <h3>Additional Information</h3>
          <div className="neuro-grid">
            <div className="neuro-detail-item secondary">
              <div className="neuro-icon small">
                <FaUserTie />
              </div>
              <div className="neuro-detail-content">
                <span className="neuro-label">Speaker</span>
                <span className="neuro-value">{event.speakerid || 'None assigned'}</span>
              </div>
            </div>
            
            <div className="neuro-detail-item secondary">
              <div className="neuro-icon small">
                <FaUserCog />
              </div>
              <div className="neuro-detail-content">
                <span className="neuro-label">Organizer</span>
                <span className="neuro-value">{event.organizerid}</span>
              </div>
            </div>
            
            <div className="neuro-detail-item secondary">
              <div className="neuro-icon small">
                <FaBuilding />
              </div>
              <div className="neuro-detail-content">
                <span className="neuro-label">Venue</span>
                <span className="neuro-value">{event.venue_id || 'None assigned'}</span>
              </div>
            </div>
            
            <div className="neuro-detail-item secondary">
              <div className="neuro-icon small">
                <FaLink />
              </div>
              <div className="neuro-detail-content">
                <span className="neuro-label">Social Media</span>
                <span className="neuro-value">
                  {event.social_media_link ? 
                    <a href={event.social_media_link} target="_blank" rel="noopener noreferrer">View Link</a> : 
                    'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        
        
        <div className="event-actions">
          <button className="neuro-button action">Edit Event</button>
          <button className="neuro-button action danger">Delete Event</button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;