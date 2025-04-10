import React from 'react';
import { Link } from 'react-router-dom';
import './css/confirmationPage.css'; // Import the CSS file

const Canceled = () => {
  return (
    <div className="confirmation-page">
      <h1>Your payment was canceled</h1>
      <h2>We’re sorry to see you go!</h2>
      <p>
        If you have any questions, feel free to contact support.
      </p>
      <p>
        <Link to="/">Navigate Back Home</Link>
      </p>
    </div>
  );
};

export default Canceled;