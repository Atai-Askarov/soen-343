import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/manageevents.css';

import useEventData from '../hooks/useEventData';

// Components
import EventsHeader from '../components/EventManagement/EventsHeader';
import FilterPanel from '../components/EventManagement/FilterPanel';
import StatsCards from '../components/EventManagement/StatsCards';
import EventsTable from '../components/EventManagement/EventsTable';
import Loading from '../components/EventManagement/Loading';

const ManageEvents = () => {
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  
  const { 
    events,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    locationFilter,
    typeFilter,
    uniqueLocations,
    uniqueTypes,
    filteredEvents,
    handleStatusFilterChange,
    handleLocationFilterChange,
    handleTypeFilterChange,
    selectAllLocations,
    selectAllTypes,
    clearLocationFilter,
    clearTypeFilter,
  } = useEventData();

  // Navigation functions
  const handleEventClick = (eventId) => navigate(`/event-details/${eventId}`);
  const handleFunctionClick = (eventId, functionType, e) => {
    e.stopPropagation();
    navigate(`/events/${eventId}/${functionType}`);
  };

  return (
    <div className="manage-events-container">
      <EventsHeader 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
      
      {showFilters && (
        <FilterPanel
          statusFilter={statusFilter}
          handleStatusFilterChange={handleStatusFilterChange}
          uniqueLocations={uniqueLocations}
          locationFilter={locationFilter}
          handleLocationFilterChange={handleLocationFilterChange}
          selectAllLocations={selectAllLocations}
          clearLocationFilter={clearLocationFilter}
          uniqueTypes={uniqueTypes}
          typeFilter={typeFilter}
          handleTypeFilterChange={handleTypeFilterChange}
          selectAllTypes={selectAllTypes}
          clearTypeFilter={clearTypeFilter}
        />
      )}
      
      {loading ? (
        <Loading />
      ) : (
        <>
          <StatsCards events={events} filteredEvents={filteredEvents} />
          <EventsTable 
            filteredEvents={filteredEvents}
            handleEventClick={handleEventClick}
            handleFunctionClick={handleFunctionClick}
          />
        </>
      )}
    </div>
  );
};

export default ManageEvents;