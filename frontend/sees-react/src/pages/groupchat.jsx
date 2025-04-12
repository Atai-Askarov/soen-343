import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Chatbox from '../components/Chatbox.jsx'; // Import the Chatbox component

const GroupchatPage = () => {
  const { groupchatTitle } = useParams();  // Get the groupchatTitle from the URL path
  const location = useLocation();  // Get the current URL's location
  const [eventId, setEventId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);  // Track loading state

  useEffect(() => {
    // Log the full location object to inspect the URL
    console.log('Current Location:', location);
    
    // Log the query string directly
    console.log('Query String:', location.search);

    // Use URLSearchParams to get 'eventId' from the query string
    const queryParams = new URLSearchParams(location.search);
    const eventIdParam = queryParams.get('eventId');
    
    // Log the eventId value we extract
    console.log('Extracted eventId:', eventIdParam);
    
    // Set the eventId to state
    setEventId(eventIdParam);
    
    // Once eventId is set, stop loading
    setIsLoading(false);
  }, [location]);  // Re-run this effect whenever the location changes

  // Decode the URL-encoded groupchatTitle
  const decodedGroupchatTitle = decodeURIComponent(groupchatTitle);

  // Log the groupchat title
  console.log('Decoded Groupchat Title:', decodedGroupchatTitle);

  // Show a loading spinner or message until eventId is set
  if (isLoading) {
    return <div>Loading...</div>;  // Show loading message while eventId is not set
  }

  return (
    <div style={{backgroundImage: 'linear-gradient(#5f2c82, #49a09d)', width: '100vw', height: '100vh', padding: '40px'}}>
      <div className="groupchat-page"> 
        <h2 style={{color:'white', marginTop:'0px'}}> Welcome to - {decodedGroupchatTitle}</h2>
        <h3 style={{color:'white'}}>Open The Chat Bubble to get Networking!</h3>
        {eventId ? (
          <div className='chat-secret'>
            <div className="chatbox-container">
              <Chatbox eventId={eventId} />
            </div>  
          </div>
        ) : (
          <p>Event ID is missing from the query string.</p> // Handle case where eventId is missing
        )}
      </div>
    </div>
  );
};

export default GroupchatPage;




