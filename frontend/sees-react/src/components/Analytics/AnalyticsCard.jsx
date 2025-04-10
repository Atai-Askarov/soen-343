import React from 'react';
import '../css/AnalyticsCard.css';

const AnalyticsCard = ({ title, children, onClick }) => {
  return (
    <div className="analytics-card" onClick={onClick}>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default AnalyticsCard;