import React from 'react';
import { FaFilter } from 'react-icons/fa';

const EventsHeader = ({ searchTerm, setSearchTerm, showFilters, setShowFilters }) => {
  return (
    <div className="events-header">
      <h1>Manage Events</h1>
      
      <div className="search-filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <button 
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> <span>Filters</span>
        </button>
      </div>
    </div>
  );
};

export default EventsHeader;