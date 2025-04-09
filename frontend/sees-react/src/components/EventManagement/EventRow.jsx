import React from 'react';
import { FaEye } from 'react-icons/fa';
import ManagementButtons from './ManagementButtons';

const EventRow = ({ event, handleEventClick, handleFunctionClick }) => {
  // Check if this is a pending event
  const isPending = event.isPending === true;
  
  // For regular events, check if the event is upcoming
  const isUpcoming = !isPending && new Date(event.eventdate) > new Date();
  
  // Get the correct event ID, handling different naming conventions
  const getEventId = () => {
    // Try all possible ID field names
    return event.id || event.eventid || event.event_id || '';
  };
  
  return (
    <tr onClick={() => {
      const id = getEventId();
      if (id) {
        handleEventClick(id);
      } else {
        console.error('Event is missing ID:', event);
      }
    }}>
      <td className="event-name">
        {event.eventname}
        {isPending && <span className="pending-badge">PENDING</span>}
      </td>
      <td>{new Date(event.eventdate).toLocaleDateString()}</td>
      <td>{event.eventlocation}</td>
      <td>{event.event_type}</td>
      <td>
        <span className={`status-pill ${isPending ? 'pending' : (isUpcoming ? 'upcoming' : 'past')}`}>
          {isPending ? 'Pending Approval' : (isUpcoming ? 'Upcoming' : 'Past')}
        </span>
      </td>
      <td className="management-buttons">
        {!isPending && (
          <ManagementButtons 
            eventId={getEventId()} 
            handleFunctionClick={handleFunctionClick} 
          />
        )}
        {isPending && (
          <button 
            className="view-event-button"
            onClick={(e) => {
              e.stopPropagation();
              const id = getEventId();
              if (id) {
                handleEventClick(id);
              }
            }}
          >
            <FaEye /> <span>Review</span>
          </button>
        )}
      </td>
    </tr>
  );
};

export default EventRow;