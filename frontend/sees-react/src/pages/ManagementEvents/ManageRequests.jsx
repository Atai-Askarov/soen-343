import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/manageevents.css'; // Reuse the same CSS
import '../css/managerequests.css'; // Additional styles specific to requests

import commandService from '../../services/CommandService';

// Components
import { FaSearch, FaFilter, FaTimes, FaCheck, FaBan, FaEye } from 'react-icons/fa';
import Loading from '../../components/EventManagement/Loading';

const ManageRequests = () => {
  const [commands, setCommands] = useState([]);
  const [filteredCommands, setFilteredCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const navigate = useNavigate();
  
  // Fetch all commands
  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const allCommands = await commandService.getCommands();
        
        // Extract unique command types for filter
        const types = [...new Set(allCommands.map(cmd => cmd.type))];
        setUniqueTypes(types);
        setTypeFilter(types); // Initially select all types
        
        setCommands(allCommands);
        setFilteredCommands(allCommands);
      } catch (error) {
        console.error("Failed to fetch commands:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCommands();
  }, []);
  
  // Filter commands based on search term and type filter
  useEffect(() => {
    if (!commands.length) return;
    
    const filtered = commands.filter(cmd => {
      // Type filter
      if (!typeFilter.includes(cmd.type)) return false;
      
      // Search filter - check various properties based on command type
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      
      // Common checks for all command types
      if (cmd.description.toLowerCase().includes(searchLower)) return true;
      if (cmd.id.toLowerCase().includes(searchLower)) return true;
      
      // Specific checks based on command type
      if (cmd.type === 'CreateEvent' || cmd.type === 'EditEvent') {
        return (
          cmd.eventData?.eventname?.toLowerCase().includes(searchLower) ||
          cmd.eventData?.eventlocation?.toLowerCase().includes(searchLower) ||
          cmd.eventData?.eventdate?.includes(searchLower) ||
          cmd.eventData?.event_type?.toLowerCase().includes(searchLower)
        );
      }
      
      if (cmd.type === 'SendEmailCampaign') {
        return cmd.eventName?.toLowerCase().includes(searchLower);
      }
      
      return false;
    });
    
    setFilteredCommands(filtered);
  }, [commands, searchTerm, typeFilter]);
  
  // Handle type filter changes
  const handleTypeFilterChange = (type) => {
    if (typeFilter.includes(type)) {
      setTypeFilter(typeFilter.filter(t => t !== type));
    } else {
      setTypeFilter([...typeFilter, type]);
    }
  };
  
  const selectAllTypes = () => {
    setTypeFilter([...uniqueTypes]);
  };
  
  const clearTypeFilter = () => {
    setTypeFilter([]);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  // Get request details based on command type
  const getRequestDetails = (command) => {
    switch (command.type) {
      case 'CreateEvent':
        return `Create event "${command.eventData.eventname}" on ${new Date(command.eventData.eventdate).toLocaleDateString()}`;
      case 'EditEvent':
        return `Edit event ID ${command.eventId}: "${command.eventData.eventname}"`;
      case 'SendEmailCampaign':
        return `Send email campaign for event "${command.eventName || `#${command.eventId}`}"`;
      default:
        return command.description;
    }
  };
  
  // Navigate to review page based on command type
  const handleCommandClick = (command) => {
    if (command.type === 'CreateEvent' || command.type === 'EditEvent') {
      navigate(`/review-event/${command.id}`);
    } else {
      // For other types, show details in a modal or navigate to a generic review page
      navigate(`/review-command/${command.id}`);
    }
  };
  
  // Handle approve action
  const handleApprove = async (e, command) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to approve this ${command.type} request?`)) {
      try {
        const result = await commandService.approveCommand(command.id);
        if (result.success) {
          // Remove from list or update status
          setCommands(commands.map(cmd => 
            cmd.id === command.id 
              ? { ...cmd, status: 'approved' } 
              : cmd
          ));
          alert('Command approved successfully!');
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Error approving command:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };
  
  // Handle reject action
  const handleReject = async (e, command) => {
    e.stopPropagation();
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      try {
        const result = commandService.rejectCommand(command.id, reason);
        if (result.success) {
          // Remove from list or update status
          setCommands(commands.map(cmd => 
            cmd.id === command.id 
              ? { ...cmd, status: 'rejected', rejectionReason: reason } 
              : cmd
          ));
          alert('Command rejected successfully!');
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        console.error('Error rejecting command:', error);
        alert(`Error: ${error.message}`);
      }
    }
  };
  
  // Get status badge color based on command status
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pill pending';
      case 'approved': return 'status-pill upcoming';
      case 'rejected': return 'status-pill past';
      case 'failed': return 'status-pill cancelled';
      default: return 'status-pill pending';
    }
  };

  return (
    <div className="manage-events-container">
      {/* Header with search and filters */}
      <div className="events-header">
        <h1>Management Requests</h1>
        
        <div className="search-filter-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="clear-search" 
                onClick={() => setSearchTerm('')}
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button 
            className={`filter-toggle ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filter
          </button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <div className="filter-header">
              <h3>Command Type</h3>
              <div className="filter-actions">
                <button onClick={selectAllTypes}>Select All</button>
                <button onClick={clearTypeFilter}>Clear</button>
              </div>
            </div>
            <div className="checkbox-group">
              {uniqueTypes.map(type => (
                <label key={type} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={typeFilter.includes(type)}
                    onChange={() => handleTypeFilterChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Main content */}
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Stats cards */}
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-icon">&#xE87C;</span>
              </div>
              <div className="stat-content">
                <h3>Total Requests</h3>
                <span className="stat-number">{commands.length}</span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-icon">&#xE645;</span>
              </div>
              <div className="stat-content">
                <h3>Pending Approval</h3>
                <span className="stat-number">
                  {commands.filter(cmd => cmd.status === 'pending').length}
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-icon">&#xE876;</span>
              </div>
              <div className="stat-content">
                <h3>Approved</h3>
                <span className="stat-number">
                  {commands.filter(cmd => cmd.status === 'approved').length}
                </span>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <span className="material-icon">&#xE14C;</span>
              </div>
              <div className="stat-content">
                <h3>Rejected</h3>
                <span className="stat-number">
                  {commands.filter(cmd => cmd.status === 'rejected').length}
                </span>
              </div>
            </div>
          </div>
          
          {/* Commands table */}
          <div className="table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Request Details</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCommands.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-data">No requests found.</td>
                  </tr>
                ) : (
                  filteredCommands.map(command => (
                    <tr 
                      key={command.id} 
                      onClick={() => handleCommandClick(command)}
                      className={command.status !== 'pending' ? 'processed-request' : ''}
                    >
                      <td className="command-type">{command.type}</td>
                      <td className="command-description">
                        {getRequestDetails(command)}
                      </td>
                      <td>{formatDate(command.timestamp)}</td>
                      <td>
                        <span className={getStatusClass(command.status)}>
                          {command.status.charAt(0).toUpperCase() + command.status.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="function-button view-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCommandClick(command);
                            }}
                            title="View details"
                          >
                            <FaEye /> View
                          </button>
                          
                          {command.status === 'pending' && (
                            <>
                              <button 
                                className="function-button approve-button"
                                onClick={(e) => handleApprove(e, command)}
                                title="Approve request"
                              >
                                <FaCheck /> Approve
                              </button>
                              <button 
                                className="function-button reject-button"
                                onClick={(e) => handleReject(e, command)}
                                title="Reject request"
                              >
                                <FaBan /> Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageRequests;