import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './css/confirmationPage.css'; // Import the CSS file

const Success = () => {
  const [session, setSession] = useState({});
  const location = useLocation();
  const sessionId = location.search.replace('?session_id=', '');

  useEffect(() => {
    async function fetchSession() {
      setSession(
        await fetch('/api/checkout-session?sessionId=' + sessionId).then((res) =>
          res.json()
        )
      );
    }
    fetchSession();
  }, [sessionId]);

  return (
    <div className="confirmation-page">
      <h1>Your payment succeeded</h1>
      <h2>Thank you for your purchase!</h2>
      <p>
        <Link to="/">Navigate Back Home</Link>
      </p>
    </div>
  );
};

export default Success;