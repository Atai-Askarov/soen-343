import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/manageevents.css';

import useEventData from '../hooks/useEventData';
import commandService from '../services/CommandService';

// Components
import EventsHeader from '../components/EventManagement/EventsHeader';
import FilterPanel from '../components/EventManagement/FilterPanel';
import StatsCards from '../components/EventManagement/StatsCards';
import EventsTable from '../components/EventManagement/EventsTable';
import Loading from '../components/EventManagement/Loading';

const ManageEvents = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [isPendingLoading, setIsPendingLoading] = useState(true);
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
  
  // Fetch pending events
  useEffect(() => {
    const fetchPendingEvents = async () => {
      try {
        const commands = await commandService.getCommands();
        // Filter commands for CreateEvent type with status "pending"
const pendingEventCommands = commands.filter(cmd => 
  cmd.type === 'CreateEvent' && cmd.status === 'pending'
);
        
        // Transform commands to match event structure
        const formattedPendingEvents = pendingEventCommands.map(cmd => ({
          id: `pending-${cmd.id}`,
          eventname: cmd.eventData.eventname,
          eventdate: cmd.eventData.eventdate,
          eventlocation: cmd.eventData.eventlocation,
          event_type: cmd.eventData.event_type,
          isPending: true,
          commandId: cmd.id,
          timestamp: cmd.timestamp
        }));
        
        setPendingEvents(formattedPendingEvents);
      } catch (error) {
        console.error("Failed to fetch pending events:", error);
      } finally {
        setIsPendingLoading(false);
      }
    };
    
    fetchPendingEvents();
  }, []);
  console.log("Start allEvents:", filteredEvents.map(e => ({ id: e.id, name: e.eventname })));

  // Combine regular and pending events
  const allEvents = [...filteredEvents, ...pendingEvents.filter(pending => {
    // Apply the same filters as regular events
    const matchesSearch = (
      (pending.eventname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pending.eventdate?.includes(searchTerm)) ||
      (pending.eventlocation?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const matchesLocation = locationFilter.includes(pending.eventlocation);
    const matchesType = typeFilter.includes(pending.event_type);
    
    // Always show pending events when "upcoming" is selected
    const matchesStatus = statusFilter.upcoming;
    
    return matchesSearch && matchesLocation && matchesType && matchesStatus;
  })];
  console.log("Final allEvents:", allEvents.map(e => ({ id: e.id, name: e.eventname })));

  const handleEventClick = (eventId) => {
    if (!eventId) {
      console.error('Event ID is undefined');
      return;
    }
    
    const eventIdStr = String(eventId);
    
    if (eventIdStr.startsWith('pending-')) {
      // Extract original command ID from the formatted ID
      const commandId = eventIdStr.replace('pending-', '');
      // Use a DEDICATED route for pending event review
      navigate(`/review-event/${commandId}`);
    } else {
      navigate(`/event-details/${eventId}`);
    }
  };
  
  const handleFunctionClick = (eventId, functionType, e) => {
    e.stopPropagation();
    // Don't allow function clicks on pending events
    if (!eventId.toString().startsWith('pending-')) {
      navigate(`/events/${eventId}/${functionType}`);
    }
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
      
      {(loading || isPendingLoading) ? (
        <Loading />
      ) : (
        <>
          <StatsCards events={events} filteredEvents={allEvents} />
          <EventsTable 
            filteredEvents={allEvents}
            handleEventClick={handleEventClick}
            handleFunctionClick={handleFunctionClick}
          />
        </>
      )}
    </div>
  );
};

export default ManageEvents;