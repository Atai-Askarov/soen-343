import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventQuestionsSection from '../components/EventAttendee/EventQuestionsSection';
import EventHeader from '../components/EventAttendee/EventHeader';
import EventSidebar from '../components/EventAttendee/EventSideBar';
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
  
  // Fetch event details
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
  
  return (
    <div className="event-page-container">
      {/* Event Header */}
      <EventHeader event={event} />
      
      <div className="event-content">
        <div className="event-main">
          {/* Main content area */}
          <div className="event-detail-card">
            {/* Event details - could be further modularized if desired */}
          </div>
          
          {/* Q&A Section */}
          <EventQuestionsSection eventId={id} />
        </div>
        
        {/* Sidebar with organizer info and similar interests */}
        <EventSidebar 
          event={event} 
          user={user} 
          loadingSimilar={loadingSimilar} 
          similarAttendees={similarAttendees} 
        />
      </div>
    </div>
  );
};

export default EventPage;