import React from 'react';
import EventRow from './EventRow';

const EventsTable = ({ filteredEvents, handleEventClick, handleFunctionClick }) => {
  return (
    <div className="events-table-container">
      <table className="events-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Location</th>
            <th>Type</th>
            <th>Status</th>
            <th>Management</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(event => (
            <EventRow 
              key={event.id}
              event={event}
              handleEventClick={handleEventClick}
              handleFunctionClick={handleFunctionClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;