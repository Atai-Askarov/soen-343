import React from 'react';
import { FaUsers, FaChartBar, FaDollarSign, FaBullhorn, FaNetworkWired, FaBox } from 'react-icons/fa';

const ManagementButtons = ({ eventId, handleFunctionClick }) => {
  return (
    <div className="btn-group">
      <button 
        className="function-button attendees" 
        onClick={(e) => handleFunctionClick(eventId, 'attendees', e)}
      >
        <span className="btn-icon"><FaUsers /></span>
        <span className="btn-text">Attendees</span>
      </button>
      
      <button 
        className="function-button analytics" 
        onClick={(e) => handleFunctionClick(eventId, 'analytics', e)}
      >
        <span className="btn-icon"><FaChartBar /></span>
        <span className="btn-text">Analytics</span>
      </button>
      
      <button 
        className="function-button financials" 
        onClick={(e) => handleFunctionClick(eventId, 'financials', e)}
      >
        <span className="btn-icon"><FaDollarSign /></span>
        <span className="btn-text">Financials</span>
      </button>
      
      <button 
        className="function-button promotions" 
        onClick={(e) => handleFunctionClick(eventId, 'promotions', e)}
      >
        <span className="btn-icon"><FaBullhorn /></span>
        <span className="btn-text">Promotions</span>
      </button>
      
      <button 
        className="function-button resources" 
        onClick={(e) => handleFunctionClick(eventId, 'resources', e)}
      >
        <span className="btn-icon"><FaBox /></span>
        <span className="btn-text">Resources</span>
      </button>
      
      <button 
        className="function-button networking" 
        onClick={(e) => handleFunctionClick(eventId, 'networking', e)}
      >
        <span className="btn-icon"><FaNetworkWired /></span>
        <span className="btn-text">Networking</span>
      </button>
    </div>
  );
};

export default ManagementButtons;