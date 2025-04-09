import React from 'react';
import { FaLinkedin } from 'react-icons/fa';

// Helper function to format camelCase text
const formatCamelCase = (text) => {
  // Replace camelCase with spaces (e.g., "machineLearnin" → "Machine Learning")
  return text.replace(/([A-Z])/g, ' $1')
    // Capitalize first letter
    .replace(/^./, (str) => str.toUpperCase());
};

const SimilarInterestsSection = ({ loading, attendees }) => {
  return (
    <div className="similar-interests-card">
      <h3>People With Similar Interests</h3>
      
      {loading ? (
        <div className="loading-similar">
          <div className="spinner-small"></div>
          <p>Finding similar attendees...</p>
        </div>
      ) : attendees.length === 0 ? (
        <p className="no-similar">No other attendees with similar interests found.</p>
      ) : (
        <div className="similar-attendees-list">
          {attendees.map(attendee => (
            <div key={attendee.id} className="similar-attendee">
              <div className="attendee-info">
                <span className="attendee-name">{attendee.username} - </span>
                <span className="attendee-interest">
                  {attendee.sharedInterest}
                </span>
              </div>
              <button className="linkedin-btn" title="Connect on LinkedIn">
                <FaLinkedin className="linkedin-icon" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimilarInterestsSection;