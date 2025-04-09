import { useState, useEffect } from 'react';

export default function useEventData() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState({ past: true, upcoming: true });
  const [locationFilter, setLocationFilter] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  const fetchEvents = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/events');
      const data = await response.json();
      const eventsData = data.events || [];
      setEvents(eventsData);
      
      // Extract unique locations and types for filters
      const locations = [...new Set(eventsData.map(event => event.eventlocation))];
      const types = [...new Set(eventsData.map(event => event.event_type))];
      
      setLocationFilter(locations);
      setTypeFilter(types);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };
  
  // Get unique locations and types
  const uniqueLocations = [...new Set(events.map(event => event.eventlocation))];
  const uniqueTypes = [...new Set(events.map(event => event.event_type))];
  
  // Filter events based on criteria
  const filteredEvents = events.filter(event => {
    const matchesSearch = (
      (event.eventname?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (event.eventdate?.includes(searchTerm)) ||
      (event.eventlocation?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const isUpcoming = new Date(event.eventdate) > new Date();
    const matchesStatus = (
      (isUpcoming && statusFilter.upcoming) || 
      (!isUpcoming && statusFilter.past)
    );
    
    const matchesLocation = locationFilter.includes(event.eventlocation);
    const matchesType = typeFilter.includes(event.event_type);
    
    return matchesSearch && matchesStatus && matchesLocation && matchesType;
  });
  
  // Filter management functions
  const handleStatusFilterChange = (status) => {
    setStatusFilter(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };
  
  const handleLocationFilterChange = (location) => {
    setLocationFilter(prev => prev.includes(location) 
      ? prev.filter(loc => loc !== location) 
      : [...prev, location]
    );
  };
  
  const handleTypeFilterChange = (type) => {
    setTypeFilter(prev => prev.includes(type)
      ? prev.filter(t => t !== type)
      : [...prev, type]
    );
  };
  
  const selectAllLocations = () => setLocationFilter(uniqueLocations);
  const selectAllTypes = () => setTypeFilter(uniqueTypes);
  const clearLocationFilter = () => setLocationFilter([]);
  const clearTypeFilter = () => setTypeFilter([]);
  
  return {
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
  };
}