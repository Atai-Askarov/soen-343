import React from 'react';
import EventRow from './EventRow';
import { FaUserFriends } from 'react-icons/fa';

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
            >
              <button 
                className="table-action-btn attendees-btn"
                onClick={(e) => handleFunctionClick(event.id, 'attendees', e)}
                disabled={event.isPending}
              >
                <FaUserFriends className="action-icon" /> Attendees
              </button>
            </EventRow>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventsTable;