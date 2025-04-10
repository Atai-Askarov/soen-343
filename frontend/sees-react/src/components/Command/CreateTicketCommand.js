import { Command } from './Command';

export class CreateTicketCommand extends Command {
  constructor(ticketData) {
    super(
      'CreateTicket', 
      `Create ticket "${ticketData.name}" for event #${ticketData.eventid}`
    );
    this.ticketData = ticketData;
  }
  
  async execute() {
    try {
      const response = await fetch('http://localhost:5000/create_ticket_description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.ticketData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ticket creation failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Ticket creation error:', error);
      throw error;
    }
  }
  
  getDetails() {
    return {
      ...super.getDetails(),
      ticketName: this.ticketData.name,
      ticketPrice: this.ticketData.price,
      ticketLimit: this.ticketData.ticketlimit,
      eventId: this.ticketData.eventid,
      description: this.ticketData.description
    };
  }
}