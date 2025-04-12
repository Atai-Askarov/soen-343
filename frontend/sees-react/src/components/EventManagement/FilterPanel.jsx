import React from 'react';

const FilterPanel = ({
  statusFilter,
  handleStatusFilterChange,
  uniqueLocations,
  locationFilter,
  handleLocationFilterChange,
  selectAllLocations,
  clearLocationFilter,
  uniqueTypes,
  typeFilter,
  handleTypeFilterChange,
  selectAllTypes,
  clearTypeFilter
}) => {
  return (
    <div className="filter-drawer">
      <div className="filter-panel">
        {/* Status toggles */}
        <div className="filter-group">
          <h3>Status</h3>
          <div className="toggle-group">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={statusFilter.upcoming}
                onChange={() => handleStatusFilterChange('upcoming')}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Upcoming</span>
            </label>
            
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={statusFilter.past}
                onChange={() => handleStatusFilterChange('past')}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-label">Past</span>
            </label>
          </div>
        </div>
        
        {/* Location filters */}
        <div className="filter-group">
          <div className="filter-header">
            <h3>Locations</h3>
            <div className="filter-actions">
              <button className="action-btn" onClick={selectAllLocations}>All</button>
              <button className="action-btn" onClick={clearLocationFilter}>Clear</button>
            </div>
          </div>
          
          <div className="filter-chips">
            {uniqueLocations.map(location => (
              <button
                key={location}
                className={`filter-chip ${locationFilter.includes(location) ? 'active' : ''}`}
                onClick={() => handleLocationFilterChange(location)}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
        
        {/* Type filters */}
        <div className="filter-group">
          <div className="filter-header">
            <h3>Event Types</h3>
            <div className="filter-actions">
              <button className="action-btn" onClick={selectAllTypes}>All</button>
              <button className="action-btn" onClick={clearTypeFilter}>Clear</button>
            </div>
          </div>
          
          <div className="filter-chips">
            {uniqueTypes.map(type => (
              <button
                key={type}
                className={`filter-chip ${typeFilter.includes(type) ? 'active' : ''}`}
                onClick={() => handleTypeFilterChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;