import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './css/ticketPage.css';

const TicketsPage = () => {
  const { eventId } = useParams();  // Get the event ID from the URL
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTicket = async () => {
    // Prepare ticket data to send to backend
    const newTicket = {
      price: parseFloat(ticketPrice),
      name: ticketName,
      description: ticketDescription,
      ticketlimit: parseInt(ticketQuantity),
      eventid: parseInt(eventId),  // The eventId comes from the URL
    };

    setLoading(true);
    setError('');

    try {
      // Send the POST request to the backend to create the ticket
      const response = await fetch(`http://localhost:5000/create_ticket_description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTicket),
      });

      const result = await response.json();

      if (response.ok) {
        // Ticket created successfully, add it to the list
        setTickets([...tickets, {
          id: result.ticket_desc_id,
          name: result.name,
          description: result.description,
          price: result.price,
          ticketlimit: result.ticketlimit,
          eventid: result.eventid,
        }]);

        // Reset the form
        setTicketName('');
        setTicketPrice('');
        setTicketQuantity('');
        setTicketDescription('');
      } else {
        setError(result.message || 'Failed to create ticket.');
      }
    } catch (error) {
      setError('An error occurred while creating the ticket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticketsPage">
      <h2>Create Tickets for Event {eventId}</h2>

      {/* Error Message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Ticket Creation Form */}
      <label className="tickets-label">Ticket Name: </label>
        <input
          type="text"
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
          placeholder="Ticket Name"
        />

      <label className="tickets-label">Ticket Price:</label>
      <input
        type="number"
        value={ticketPrice}
        onChange={(e) => setTicketPrice(e.target.value)}
        placeholder="Ticket Price"
      />
      <label className="tickets-label">Ticket Quantity:</label>
      <input
        type="number"
        value={ticketQuantity}
        onChange={(e) => setTicketQuantity(e.target.value)}
        placeholder="Quantity"
      />

      <label className="tickets-label">Ticket Description:</label>
      <textarea
        value={ticketDescription}
        onChange={(e) => setTicketDescription(e.target.value)}
        placeholder="Description"
      ></textarea>
      <button className="tickets-button" onClick={handleCreateTicket} disabled={loading}>
        {loading ? 'Creating...' : 'Create Ticket'}
      </button>

      {/* Created Tickets List */}
      <div>
        <h3>Created Tickets:</h3>
        {tickets.length === 0 ? (
          <p>No tickets created yet.</p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: '2px solid #ccc',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '10px',
                backgroundColor: ticket.active ? '#e0f7fa' : '#fff', // Light blue if active
              }}
            >
              <h4>{ticket.name}</h4>
              <p>{ticket.description}</p>
              <p>Price: ${ticket.price}</p>
              <p>Quantity: {ticket.ticketlimit}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TicketsPage;