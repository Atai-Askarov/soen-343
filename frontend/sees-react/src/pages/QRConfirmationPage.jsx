import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import "./css/confirmationPage.css"
const QRConfirmationPage = () => {
  const { ticketId } = useParams(); // Retrieve the dynamic ticketId from the URL
  const location = useLocation(); // Access the state passed via navigate
  const {
    eventname,
    eventdate,
    eventstarttime,
    eventendtime,
    eventdescription,
    venue_id,
  } = location.state || {}; // Destructure the state object
  
  return (
    <div className="confirmation-page">
      <h1>Confirmation</h1>
      <p>You have confirmed your presence at:</p>
      <h2>{eventname || "Event Name"}</h2>
      <p>Start Time: {eventstarttime}</p>
      <p>End Time: {eventendtime}</p>
      <p>Thank you for checking in!</p>
    </div>
  );
};

export default QRConfirmationPage;