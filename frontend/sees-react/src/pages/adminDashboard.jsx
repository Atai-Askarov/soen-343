import React, { useState, useEffect } from "react";
import "./css/adminDashboard.css";
import axios from "axios";

// Sample events data for admin approval, to be replaced with API call from backend
const initialEvents = [
  {
    id: "1",
    name: "Eruption of Mount Vesuvius in 79 AD",
    type: "Webinar",
    date: "March 28",
    description:
      "A webinar discussing the historical eruption of Mount Vesuvius.",
    speaker: "David",
    stakeholder: "Atai",
    organizer: "Bob",
    image: "https://via.placeholder.com/50",
    status: "pending",
  },
  {
    id: "2",
    name: "The Fall of the Roman Empire",
    type: "Conference",
    date: "April 5",
    description: "A conference on the decline and fall of the Roman Empire.",
    speaker: "Alice",
    stakeholder: "Eve",
    organizer: "Charlie",
    image: "https://via.placeholder.com/50",
    status: "pending",
  },
];

const AdminDashboard = () => {
  const [events, setEvents] = useState(initialEvents); //Please remove this when backend logic is made to retrieve events list

  //TODO - Fetch events from backend and use the 2 commented lines below
  //const [events, setEvents] = useState([]);
  // const [error, setError] = useState('');

  //TODO - Fetch events from backend and use the commented useEffect below
  //  useEffect(() => {
  //     const fetchPendingEvents = async () => {
  //       try {
  //         const response = await axios.get('http://localhost:5050/api/admin/events/pending', { //Change port to backend one
  //           withCredentials: true, // Include cookies for authentication
  //         });
  //         const eventData = response.data.map((event) => ({
  //           ...event,
  //           id: event.id,
  //         }));
  //         setEvents(eventData);
  //       } catch (err) {
  //         setError('Failed to load pending events. Please try again.');
  //       }
  //     };

  //     fetchPendingEvents();
  //   }, []);

  // Function to approve an event placeholder
  const handleApprove = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "approved" } : event,
      ),
    );
  };

  //TODO - Implement approve event functionality with backend, adjust port and URL. BTW THIS CODE ASSUMES USAGE OF COOKIES :O
  //   const handleApprove = async (id) => {
  //     try {
  //       await axios.put(
  //         `http://localhost:5050/api/admin/events/${id}/approve`,
  //         {},
  //         { withCredentials: true }
  //       );
  //       setEvents(events.filter((event) => event.id !== id)); // Remove the event from the list
  //     } catch (err) {
  //       setError('Failed to approve event. Please try again.');
  //     }
  //   };

  // Function to reject an event
  const handleReject = (id) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, status: "rejected" } : event,
      ),
    );
  };

  //TODO - Same as approve functionality, make backend, adjust port and url
  //   const handleReject = async (id) => {
  //     try {
  //       await axios.put(
  //         `http://localhost:5050/api/admin/events/${id}/reject`,
  //         {},
  //         { withCredentials: true }
  //       );
  //       setEvents(events.filter((event) => event.id !== id));
  //     } catch (err) {
  //       setError('Failed to reject event. Please try again.');
  //     }
  //   };

  // Filter events to show only those with status "pending"
  const pendingEvents = events.filter((event) => event.status === "pending");

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <h1 className="welcome-header">Welcome!</h1>
      <h2 className="sub-header">Event Approvals</h2>

      {/* Events Awaiting Approval Section */}
      <div className="events-section">
        <h2 className="section-header">Events Awaiting Approval:</h2>
        {pendingEvents.length === 0 ? (
          <p>No events awaiting approval.</p>
        ) : (
          <table className="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Date</th>
                <th>Speaker</th>
                <th>Stakeholder</th>
                <th>Organizer</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <img
                      src={event.image}
                      alt={event.name}
                      className="event-image"
                    />
                    {event.name}
                  </td>
                  <td>{event.type}</td>
                  <td>{event.date}</td>
                  <td>{event.speaker}</td>
                  <td>{event.stakeholder}</td>
                  <td>{event.organizer}</td>
                  <td>{event.status}</td>
                  <td>
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(event.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(event.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
