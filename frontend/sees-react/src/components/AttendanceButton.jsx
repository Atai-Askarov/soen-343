import React, { useState } from 'react';
import attendanceService from '../services/AttendanceService';

const CheckInPanel = () => {
  const [ticketId, setTicketId] = useState('');
  const [eventId, setEventId] = useState('');
  const [batchAttendees, setBatchAttendees] = useState([
    { ticket_id: 101, event_id: 1 },
    { ticket_id: 102, event_id: 1 }
  ]);
  const [response, setResponse] = useState(null);

  const handleSingleCheckIn = async () => {
    try {
      const result = await attendanceService.checkInAttendee(Number(ticketId), Number(eventId));
      setResponse(result);
    } catch (error) {
      console.error('Single check-in failed:', error);
    }
  };

  const handleBatchCheckIn = async () => {
    try {
      const result = await attendanceService.batchCheckIn(batchAttendees);
      setResponse(result);
    } catch (error) {
      console.error('Batch check-in failed:', error);
    }
  };

  return (
    <div className="checkin-panel">
      <h2>Check-In Panel</h2>

      <div>
        <label>Ticket ID:</label>
        <input
          type="number"
          value={ticketId}
          onChange={(e) => setTicketId(e.target.value)}
        />
      </div>

      <div>
        <label>Event ID:</label>
        <input
          type="number"
          value={eventId}
          onChange={(e) => setEventId(e.target.value)}
        />
      </div>

      <button onClick={handleSingleCheckIn}>Check In Single Attendee</button>


      {response && (
        <div className="response">
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CheckInPanel;
