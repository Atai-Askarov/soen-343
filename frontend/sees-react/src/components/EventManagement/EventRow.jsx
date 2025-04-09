import React from 'react';
import ManagementButtons from './ManagementButtons';

const EventRow = ({ event, handleEventClick, handleFunctionClick }) => {
  const isUpcoming = new Date(event.eventdate) > new Date();
  
  return (
    <tr key={event.id} onClick={() => handleEventClick(event.id)}>
      <td className="event-name">{event.eventname}</td>
      <td>{new Date(event.eventdate).toLocaleDateString()}</td>
      <td>{event.eventlocation}</td>
      <td>{event.event_type}</td>
      <td>
        <span className={`status-pill ${isUpcoming ? 'upcoming' : 'past'}`}>
          {isUpcoming ? 'Upcoming' : 'Past'}
        </span>
      </td>
      <td className="management-buttons">
        <ManagementButtons 
          eventId={event.id} 
          handleFunctionClick={handleFunctionClick} 
        />
      </td>
    </tr>
  );
};

export default EventRow;