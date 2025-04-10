import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/ticketPage.css';
import { CreateTicketCommand } from '../components/Command/CreateTicketCommand';
import commandService from '../services/CommandService';

const TicketsPage = () => {
  const { eventId } = useParams();
  const [ticketName, setTicketName] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketQuantity, setTicketQuantity] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(null);
  
  // Fetch both existing tickets and pending ticket commands
  useEffect(() => {
    const fetchTicketsData = async () => {
      try {
        // Fetch existing tickets from database
        const ticketsResponse = await fetch(`http://localhost:5000/ticket-descriptions/${eventId}`);
        let existingTickets = [];
        if (ticketsResponse.ok) {
          const data = await ticketsResponse.json();
          existingTickets = data.ticket_descriptions || [];
        }
        
        // Fetch pending ticket commands
        const allCommands = await commandService.getCommands();
        const pendingTicketCommands = allCommands.filter(cmd => 
          cmd.type === 'CreateTicket' && 
          cmd.status === 'pending' &&
          cmd.ticketData?.eventid === parseInt(eventId)
        );
        
        // Convert commands to ticket format
        const pendingTickets = pendingTicketCommands.map(cmd => ({
          id: `pending-${cmd.id}`,
          name: cmd.ticketData.name,
          description: cmd.ticketData.description,
          price: cmd.ticketData.price,
          ticketlimit: cmd.ticketData.ticketlimit,
          eventid: cmd.ticketData.eventid,
          isPending: true,
          commandId: cmd.id
        }));
        
        // Combine existing and pending tickets
        setTickets([...existingTickets, ...pendingTickets]);
        
      } catch (error) {
        console.error('Error fetching tickets data:', error);
      }
    };
    
    if (eventId) {
      fetchTicketsData();
    }
  }, [eventId]);

  const handleCreateTicket = async () => {
    // Validate input
    if (!ticketName || !ticketPrice || !ticketQuantity) {
      setError('Please fill in all required fields');
      return;
    }
    
    // Prepare ticket data
    const ticketData = {
      price: parseFloat(ticketPrice),
      name: ticketName,
      description: ticketDescription,
      ticketlimit: parseInt(ticketQuantity),
      eventid: parseInt(eventId),
    };
    
    setLoading(true);
    setError('');
    
    try {
      // Create the command
      const command = new CreateTicketCommand(ticketData);
      
      // Add command to service (queues it for approval)
      const commandId = await commandService.addCommand(command);
      
      // Show success message
      setMessage({ 
        type: 'success',
        text: 'Your ticket creation request has been submitted for approval.'
      });
      
      // For immediate feedback, add a pending ticket to the list
      setTickets(prevTickets => [...prevTickets, {
        id: `pending-${commandId}`,
        name: ticketData.name,
        description: ticketData.description,
        price: ticketData.price,
        ticketlimit: ticketData.ticketlimit,
        eventid: ticketData.eventid,
        isPending: true, // Flag to show it's pending approval
        commandId: commandId
      }]);
      
      // Reset form
      setTicketName('');
      setTicketPrice('');
      setTicketQuantity('');
      setTicketDescription('');
    } catch (error) {
      setError(`Error creating ticket command: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ticketsPage">
      <h2>Create Ticket Descriptions - Event #{eventId}</h2>

      {/* Message display */}
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button 
            className="close-message" 
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <p className="error-message">
          {error}
          <button 
            className="close-message" 
            onClick={() => setError('')}
          >
            ×
          </button>
        </p>
      )}

      {/* Ticket Creation Form */}
      <div className="ticket-form">
        <label className="tickets-label">Ticket Name: </label>
        <input
          type="text"
          value={ticketName}
          onChange={(e) => setTicketName(e.target.value)}
          placeholder="Ticket Name"
          required
        />

        <label className="tickets-label">Ticket Price:</label>
        <input
          type="number"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
          placeholder="Ticket Price"
          required
        />
        <label className="tickets-label">Ticket Quantity:</label>
        <input
          type="number"
          value={ticketQuantity}
          onChange={(e) => setTicketQuantity(e.target.value)}
          placeholder="Quantity"
          required
        />

        <label className="tickets-label">Ticket Description:</label>
        <textarea
          value={ticketDescription}
          onChange={(e) => setTicketDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
        <button className="tickets-button" onClick={handleCreateTicket} disabled={loading}>
          {loading ? 'Submitting...' : 'Create Ticket'}
        </button>
      </div>

      {/* Created Tickets List */}
      <div className="tickets-list">
        <h3>Ticket Descriptions:</h3>
        {tickets.length === 0 ? (
          <p>No tickets created yet.</p>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`ticket-card ${ticket.isPending ? 'pending' : ''}`}
              >
                <div className="ticket-content">
                  <h4>
                    {ticket.name} 
                    {ticket.isPending && <span className="pending-badge">Pending Approval</span>}
                  </h4>
                  <p className="ticket-description">{ticket.description}</p>
                  <p className="ticket-price">Price: ${ticket.price}</p>
                  <p className="ticket-quantity">Quantity: {ticket.ticketlimit}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsPage;