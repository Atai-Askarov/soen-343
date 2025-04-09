import React from 'react';
import { FaEye } from 'react-icons/fa';
import ManagementButtons from './ManagementButtons';

const EventRow = ({ event, handleEventClick, handleFunctionClick }) => {
  // Check if this is a pending event
  const isPending = event.isPending === true;
  
  // For regular events, check if the event is upcoming
  const isUpcoming = !isPending && new Date(event.eventdate) > new Date();
  
  return (
    <tr onClick={() => handleEventClick(event.id)}>
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
            eventId={event.id} 
            handleFunctionClick={handleFunctionClick} 
          />
        )}
        {isPending && (
          <button 
            className="view-event-button"
            onClick={(e) => {
              e.stopPropagation();
              handleEventClick(event.id);
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