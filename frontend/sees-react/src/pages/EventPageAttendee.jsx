import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag, FaUserTie, FaLinkedin } from 'react-icons/fa';
import EventQuestionsSection from '../components/EventAttendee/EventQuestionsSection';
import './css/eventPageAttendee.css';

const EventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [similarAttendees, setSimilarAttendees] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  
  // Get current user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
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
  
  // Fetch similar interest attendees
  useEffect(() => {
    const fetchSimilarAttendees = async () => {
      if (!user || !user.id) return;
      
      setLoadingSimilar(true);
      try {
        const response = await fetch(`http://127.0.0.1:5000/events/${id}/similar-interests/${user.id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch similar attendees');
        }
        
        const data = await response.json();
        setSimilarAttendees(data.similar_attendees || []);
      } catch (error) {
        console.error('Error fetching similar attendees:', error);
      } finally {
        setLoadingSimilar(false);
      }
    };
    
    if (user && event) {
      fetchSimilarAttendees();
    }
  }, [id, user, event]);
  
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
      {/* Header and main content remain unchanged */}
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
          {/* Main content remains unchanged */}
          <div className="event-detail-card">
            {/* Event details remain unchanged */}
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
          
          {/* New section for similar interest attendees */}
          {user && (
            <div className="similar-interests-card">
              <h3>People With Similar Interests</h3>
              
              {loadingSimilar ? (
                <div className="loading-similar">
                  <div className="spinner-small"></div>
                  <p>Finding similar attendees...</p>
                </div>
              ) : similarAttendees.length === 0 ? (
                <p className="no-similar">No other attendees with similar interests found.</p>
              ) : (
                <div className="similar-attendees-list">
                  {similarAttendees.map(attendee => (
                    <div key={attendee.id} className="similar-attendee">
                      <div className="attendee-info">
                        <span className="attendee-name">{attendee.username}</span>
                        <span className="attendee-interest">{attendee.sharedInterest}</span>
                      </div>
                      <button className="linkedin-btn" title="Connect on LinkedIn">
                        <FaLinkedin className="linkedin-icon" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;