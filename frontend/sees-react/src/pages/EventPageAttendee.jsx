import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaUserTie } from 'react-icons/fa';
import EventQuestionsSection from '../components/EventAttendee/EventQuestionsSection';
import './css/eventPageAttendee.css';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
        setError(error.message);
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
      <div className="event-page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }
  
  if (error || !event) {
    return (
      <div className="event-page-container">
        <div className="error-container">
          <h2>Unable to load event</h2>
          <p>{error || "Event not found"}</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Go to Homepage</button>
        </div>
      </div>
    );
  }
  
  const isEventUpcoming = new Date(event.eventdate) > new Date();
  
  return (
    <div className="event-page-container">
      <div className="event-header">
        <div className="header-image" 
          style={{backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${event.event_img || 'https://via.placeholder.com/1200x400?text=Event+Banner'})`}}>
          <div className="header-content">
            <h1>{event.eventname}</h1>
            <div className="event-status-badge">
              {isEventUpcoming ? 'Upcoming Event' : 'Past Event'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="event-content">
        <div className="event-main">
          <div className="event-detail-card">
            <div className="event-essentials">
              <div className="essential-item">
                <FaCalendarAlt className="icon" />
                <div>
                  <span className="label">Date</span>
                  <span className="value">{formatDate(event.eventdate)}</span>
                </div>
              </div>
              
              <div className="essential-item">
                <FaClock className="icon" />
                <div>
                  <span className="label">Time</span>
                  <span className="value">
                    {event.eventstarttime && event.eventendtime ? 
                      `${formatTime(event.eventstarttime)} - ${formatTime(event.eventendtime)}` : 
                      'Time not specified'}
                  </span>
                </div>
              </div>
              
              <div className="essential-item">
                <FaMapMarkerAlt className="icon" />
                <div>
                  <span className="label">Location</span>
                  <span className="value">{event.eventlocation}</span>
                </div>
              </div>
              
              <div className="essential-item">
                <FaTag className="icon" />
                <div>
                  <span className="label">Category</span>
                  <span className="value">{event.event_type}</span>
                </div>
              </div>
            </div>
            
            <div className="event-section">
              <h2>About This Event</h2>
              <p>{event.eventdescription}</p>
            </div>
            
            {event.speakerid && (
              <div className="event-section">
                <h2>Speaker</h2>
                <div className="speaker-info">
                  <div className="speaker-avatar">
                    <FaUserTie className="avatar-icon" />
                  </div>
                  <div className="speaker-details">
                    <h3>Speaker #{event.speakerid}</h3>
                  </div>
                </div>
              </div>
            )}
            
            <div className="event-section">
              <h2>Venue Information</h2>
              <div className="venue-info">
                <div className="venue-map">
                  <iframe 
                    title="Event Location"
                    width="100%" 
                    height="250" 
                    frameBorder="0" 
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(event.eventlocation)}&output=embed`}
                    allowFullScreen>
                  </iframe>
                </div>
                <div className="venue-details">
                  <h3>{event.eventlocation}</h3>
                </div>
              </div>
            </div>
          </div>
          
          <EventQuestionsSection eventId={id} />
        </div>
        
        <div className="event-sidebar">
          <div className="organizer-card">
            <h3>Organized By</h3>
            <div className="organizer-info">
              <span>Organizer #{event.organizerid}</span>
            </div>
          </div>
          
          {event.social_media_link && (
            <div className="social-card">
              <h3>Connect</h3>
              <a href={event.social_media_link} target="_blank" rel="noopener noreferrer" className="social-link">
                Event Social Media
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;