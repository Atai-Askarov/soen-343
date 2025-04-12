import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import commandService from '../services/CommandService';
import './css/eventDetails.css';

const ReviewEvent = () => {
  const { commandId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [message, setMessage] = useState(null);
  
  useEffect(() => {
    const fetchPendingEvent = async () => {
      setLoading(true);
      
      try {
        // Get the command data directly - no need to check for prefixes
        const command = commandService.getCommandById(commandId);
        
        if (!command) {
          setMessage({ type: 'error', text: 'Pending event not found' });
          setLoading(false);
          return;
        }
        
        // Format command data as an event
        setEvent({
          id: commandId,
          eventname: command.eventData.eventname,
          eventdate: command.eventData.eventdate,
          eventstarttime: command.eventData.eventstarttime,
          eventendtime: command.eventData.eventendtime,
          eventlocation: command.eventData.eventlocation,
          eventdescription: command.eventData.eventdescription,
          speakerid: command.eventData.speakerid,
          organizerid: command.eventData.organizerid,
          event_type: command.eventData.event_type,
          social_media_link: command.eventData.social_media_link,
          venue_id: command.eventData.venue_id,
          timestamp: command.timestamp,
          commandData: command // Store original command for approval
        });
      } catch (error) {
        console.error('Error fetching pending event:', error);
        setMessage({ type: 'error', text: `Error: ${error.message}` });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPendingEvent();
  }, [commandId]);
  
  const handleApprove = async () => {
    if (!event) return;
    
    setProcessing(true);
    setMessage({ type: 'info', text: 'Processing approval...' });
    
    try {
      const result = await commandService.approveCommand(commandId);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Event approved and created successfully!' });
        setTimeout(() => {
          navigate('/manage-events');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setProcessing(false);
    }
  };
  
  const handleReject = () => {
    if (!event) return;
    
    if (!rejectionReason.trim()) {
      setMessage({ type: 'error', text: 'Please provide a reason for rejection' });
      return;
    }
    
    setProcessing(true);
    setMessage({ type: 'info', text: 'Processing rejection...' });
    
    try {
      const result = commandService.rejectCommand(commandId, rejectionReason);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Event request rejected' });
        setTimeout(() => {
          navigate('/manage-events');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: `Error: ${result.error}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Error: ${error.message}` });
    } finally {
      setProcessing(false);
    }
  };
  
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
        <div className="loading">Loading pending event details...</div>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="event-detail-container">
        <div className="message error">Pending event not found</div>
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
        <h1>Review Event Request</h1>
      </div>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}
      
      <div className="event-card">
        <div className="event-title-section">
          <h2>{event.eventname}</h2>
          <span className="status-pill pending">Pending Approval</span>
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
        
        {event.timestamp && (
          <div className="event-metadata">
            <p>Submitted on: {formatDate(event.timestamp)} at {new Date(event.timestamp).toLocaleTimeString()}</p>
          </div>
        )}
        
        <div className="approval-section">
          <div className="rejection-reason">
            <label htmlFor="rejectionReason">Reason for Rejection (if applicable)</label>
            <textarea
              id="rejectionReason"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Provide a reason if you're rejecting this event request"
              disabled={processing}
            ></textarea>
          </div>
          
          <div className="approval-actions">
            <button 
              className="approve-button"
              onClick={handleApprove}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Approve & Create Event'}
            </button>
            <button 
              className="reject-button"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              Reject Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewEvent;