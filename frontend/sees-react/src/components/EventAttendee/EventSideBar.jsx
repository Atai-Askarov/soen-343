import React from 'react';
import SimilarInterestsSection from './SimilarInterestsSection';
import StarRating from '../RatingStars';

const EventSidebar = ({ event, user, loadingSimilar, similarAttendees }) => {
  return (
    <div className="event-sidebar">
      <div className="organizer-card">
        <h3>Organized By</h3>
        <div className="organizer-info">
          <span>Organizer #{event.organizerid}</span>
        </div>
      </div>
      
      {event.social_media_link && (
        <div className="social-card">
          <h3>Connect</h3>
          <a href={event.social_media_link} target="_blank" rel="noopener noreferrer" className="social-link">
            Event Social Media
          </a>
        </div>
      )}
      
      {/* Similar Interests Section */}
      {user && (
        <SimilarInterestsSection 
          loading={loadingSimilar} 
          attendees={similarAttendees} 
        />
      )}
      <h1>Rate this event!</h1>
      <StarRating 
      event = {event.id}
      user = {user.id}
      />
    </div>
  );
};

export default EventSidebar;