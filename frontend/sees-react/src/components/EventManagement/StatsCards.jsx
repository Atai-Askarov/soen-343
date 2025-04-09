import React from 'react';

const StatsCards = ({ events, filteredEvents }) => {
  return (
    <div className="stats-container">
      <div className="stat-card">
        <span className="stat-label">Total Events</span>
        <span className="stat-value">{events.length}</span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Upcoming Events</span>
        <span className="stat-value">
          {events.filter(event => new Date(event.eventdate) > new Date()).length}
        </span>
      </div>
      <div className="stat-card">
        <span className="stat-label">Past Events</span>
        <span className="stat-value">
          {events.filter(event => new Date(event.eventdate) <= new Date()).length}
        </span>
      </div>
      <div className="stat-card results">
        <span className="stat-label">Filtered Results</span>
        <span className="stat-value">{filteredEvents.length}</span>
      </div>
    </div>
  );
};

export default StatsCards;