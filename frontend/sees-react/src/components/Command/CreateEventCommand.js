import { Command } from './Command';

export class CreateEventCommand extends Command {
  constructor(eventData) {
    super(
      'CreateEvent', 
      `Create event "${eventData.eventname}" on ${new Date(eventData.eventdate).toLocaleDateString()}`
    );
    this.eventData = eventData;
  }
  
  async execute() {
    try {
      const response = await fetch('http://localhost:5000/create_event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.eventData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Event creation failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Event creation error:', error);
      throw error;
    }
  }
  
  getDetails() {
    return {
      ...super.getDetails(),
      eventName: this.eventData.eventname,
      eventDate: this.eventData.eventdate,
      eventLocation: this.eventData.eventlocation,
      eventType: this.eventData.event_type,
      speakerId: this.eventData.speakerid,
      organizerId: this.eventData.organizerid,
      venueId: this.eventData.venue_id
    };
  }
}