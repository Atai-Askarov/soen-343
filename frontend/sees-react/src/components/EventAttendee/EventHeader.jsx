import React from 'react';

const EventHeader = ({ event }) => {
  const isEventUpcoming = new Date(event.eventdate) > new Date();
  
  return (
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
  );
};

export default EventHeader;