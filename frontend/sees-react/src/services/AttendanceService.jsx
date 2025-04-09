const attendanceService = {
    /**
     * Check in a single attendee
     * @param {number} ticketId - The ticket ID
     * @param {number} eventId - The event ID
     * @returns {Promise<Object>} Response from the server
     */
    async checkInAttendee(ticketId, eventId) {
      const response = await fetch('http://127.0.0.1:5000/attendance/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_id: ticketId,
          event_id: eventId
        })
      });
      
      return await response.json();
    },
    
    /**
     * Check in multiple attendees
     * @param {Array<Object>} attendees - Array of {ticket_id, event_id} objects
     * @returns {Promise<Object>} Response with success and errors
     */
    async batchCheckIn(attendees) {
      const response = await fetch('http://127.0.0.1:5000/attendance/batch-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          attendees: attendees
        })
      });
      
      return await response.json();
    }
  };
  
  export default attendanceService;